// Re-export types from main for testing
use serde::{Deserialize, Serialize};
use std::time::SystemTime;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Entity {
    pub original: String,
    pub token: String,
    #[serde(rename = "type")]
    pub entity_type: String,
    pub position: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StoreRequest {
    pub request_id: String,
    pub entities: Vec<Entity>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RetrieveResponse {
    pub entities: Vec<Entity>,
}

// Internal types for vault implementation
#[derive(Debug, Clone)]
pub struct EncryptedData {
    pub ciphertext: Vec<u8>,
    pub nonce: Vec<u8>,
    pub created_at: SystemTime,
    pub ttl_seconds: u64,
}

// Re-export main vault types
pub use crate::vault_state::*;

mod vault_state {
    use super::*;
    use dashmap::DashMap;
    use ring::rand::SystemRandom;
    use std::sync::Arc;
    use std::time::Duration;
    use tokio;
    
    #[derive(Clone)]
    pub struct VaultState {
        pub storage: Arc<DashMap<String, EncryptedData>>,
        pub master_key: Vec<u8>,
        pub rng: Arc<SystemRandom>,
        pub ttl_seconds: u64,
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
            
            state
        }
    }
    
    fn cleanup_expired(storage: &DashMap<String, EncryptedData>) {
        let now = SystemTime::now();
        storage.retain(|_, data| {
            if let Ok(elapsed) = now.duration_since(data.created_at) {
                elapsed.as_secs() < data.ttl_seconds
            } else {
                false
            }
        });
    }
}

// Stub handlers for testing
pub async fn store_entities() {}
pub async fn retrieve_entities() {}
