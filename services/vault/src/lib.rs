use actix_web::{web, HttpResponse};
use dashmap::DashMap;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::time::{Duration, SystemTime};
use ring::aead::{Aad, LessSafeKey, Nonce, UnboundKey, AES_256_GCM};
use ring::rand::{SecureRandom, SystemRandom};
use log::{info, error};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Entity {
    pub original: String,
    pub token: String,
    #[serde(rename = "type")]
    pub entity_type: String,
    pub position: usize,
}

#[derive(Debug, Clone)]
pub struct EncryptedData {
    pub ciphertext: Vec<u8>,
    pub nonce: Vec<u8>,
    pub created_at: SystemTime,
    pub ttl_seconds: u64,
}

#[derive(Clone)]
pub struct VaultState {
    pub storage: Arc<DashMap<String, EncryptedData>>,
    pub master_key: Vec<u8>,
    pub rng: Arc<SystemRandom>,
    pub ttl_seconds: u64,
}

#[derive(Serialize, Deserialize)]
pub struct StoreRequest {
    pub request_id: String,
    pub entities: Vec<Entity>,
}

#[derive(Serialize)]
pub struct StoreResponse {
    pub success: bool,
    pub request_id: String,
    pub expires_at: u64,
}

#[derive(Serialize)]
pub struct RetrieveResponse {
    pub entities: Vec<Entity>,
}

impl VaultState {
    pub fn new(master_key: Vec<u8>, ttl_seconds: u64) -> Self {
        let state = Self {
            storage: Arc::new(DashMap::new()),
            master_key,
            rng: Arc::new(SystemRandom::new()),
            ttl_seconds,
        };
        
        let storage_clone = state.storage.clone();
        tokio::spawn(async move {
            let mut interval = tokio::time::interval(Duration::from_secs(10));
            loop {
                interval.tick().await;
                cleanup_expired(&storage_clone);
            }
        });
        
        info!("Vault initialized with TTL={}s", ttl_seconds);
        state
    }
    
    pub fn encrypt(&self, data: &[u8]) -> Result<(Vec<u8>, Vec<u8>), String> {
        let unbound_key = UnboundKey::new(&AES_256_GCM, &self.master_key)
            .map_err(|e| format!("Key creation failed: {:?}", e))?;
        let key = LessSafeKey::new(unbound_key);
        
        let mut nonce_bytes = vec![0u8; 12];
        self.rng.fill(&mut nonce_bytes)
            .map_err(|e| format!("Nonce generation failed: {:?}", e))?;
        
        let nonce = Nonce::assume_unique_for_key(
            nonce_bytes.clone().try_into().unwrap()
        );
        
        let mut ciphertext = data.to_vec();
        key.seal_in_place_append_tag(nonce, Aad::empty(), &mut ciphertext)
            .map_err(|e| format!("Encryption failed: {:?}", e))?;
        
        Ok((ciphertext, nonce_bytes))
    }
    
    pub fn decrypt(&self, ciphertext: &[u8], nonce_bytes: &[u8]) -> Result<Vec<u8>, String> {
        let unbound_key = UnboundKey::new(&AES_256_GCM, &self.master_key)
            .map_err(|e| format!("Key creation failed: {:?}", e))?;
        let key = LessSafeKey::new(unbound_key);
        
        let nonce = Nonce::assume_unique_for_key(
            nonce_bytes.try_into().map_err(|_| "Invalid nonce size")?
        );
        
        let mut data = ciphertext.to_vec();
        let plaintext = key.open_in_place(nonce, Aad::empty(), &mut data)
            .map_err(|e| format!("Decryption failed: {:?}", e))?;
        
        Ok(plaintext.to_vec())
    }
}

pub fn cleanup_expired(storage: &Arc<DashMap<String, EncryptedData>>) {
    let now = SystemTime::now();
    let mut expired = Vec::new();
    
    for entry in storage.iter() {
        let age = now.duration_since(entry.created_at).unwrap().as_secs();
        if age > entry.ttl_seconds {
            expired.push(entry.key().clone());
        }
    }
    
    for key in expired {
        storage.remove(&key);
        info!("🗑️  Auto-purged expired entry: {}", key);
    }
}

pub async fn store_entities(
    state: web::Data<VaultState>,
    req: web::Json<StoreRequest>,
) -> HttpResponse {
    let start = std::time::Instant::now();
    
    let entities_json = match serde_json::to_vec(&req.entities) {
        Ok(j) => j,
        Err(e) => {
            error!("Serialization failed: {}", e);
            return HttpResponse::BadRequest().json("Serialization failed");
        }
    };
    
    let (ciphertext, nonce) = match state.encrypt(&entities_json) {
        Ok(data) => data,
        Err(e) => {
            error!("Encryption failed: {}", e);
            return HttpResponse::InternalServerError().json("Encryption failed");
        }
    };
    
    let encrypted_data = EncryptedData {
        ciphertext,
        nonce,
        created_at: SystemTime::now(),
        ttl_seconds: state.ttl_seconds,
    };
    
    state.storage.insert(req.request_id.clone(), encrypted_data);
    
    info!("✓ Stored {} entities for {} in {:?}", 
        req.entities.len(), req.request_id, start.elapsed());
    
    HttpResponse::Ok().json(StoreResponse {
        success: true,
        request_id: req.request_id.clone(),
        expires_at: SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .unwrap()
            .as_secs() + state.ttl_seconds,
    })
}

pub async fn retrieve_entities(
    state: web::Data<VaultState>,
    path: web::Path<String>,
) -> HttpResponse {
    let request_id = path.into_inner();
    
    let encrypted_data = match state.storage.get(&request_id) {
        Some(data) => data.clone(),
        None => {
            error!("Request ID not found: {}", request_id);
            return HttpResponse::NotFound().json("Request ID not found");
        }
    };
    
    let plaintext = match state.decrypt(&encrypted_data.ciphertext, &encrypted_data.nonce) {
        Ok(data) => data,
        Err(e) => {
            error!("Decryption failed: {}", e);
            return HttpResponse::InternalServerError().json("Decryption failed");
        }
    };
    
    let entities: Vec<Entity> = match serde_json::from_slice(&plaintext) {
        Ok(e) => e,
        Err(e) => {
            error!("Deserialization failed: {}", e);
            return HttpResponse::InternalServerError().json("Deserialization failed");
        }
    };
    
    info!("✓ Retrieved {} entities for {}", entities.len(), request_id);
    
    HttpResponse::Ok().json(RetrieveResponse { entities })
}

pub async fn health() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "service": "vault",
        "version": "1.0.0"
    }))
}

pub async fn metrics(state: web::Data<VaultState>) -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "entries_stored": state.storage.len(),
        "ttl_seconds": state.ttl_seconds
    }))
}
