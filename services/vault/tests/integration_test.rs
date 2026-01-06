use actix_web::{test, App, web};
use vault::*;

#[actix_web::test]
async fn test_store_and_retrieve() {
    let master_key = vec![0u8; 32];
    let vault_state = web::Data::new(VaultState::new(master_key, 60));
    
    let app = test::init_service(
        App::new()
            .app_data(vault_state.clone())
            .route("/store", web::post().to(store_entities))
            .route("/retrieve/{id}", web::get().to(retrieve_entities))
    ).await;
    
    // Store entities
    let store_req = StoreRequest {
        request_id: "test-123".to_string(),
        entities: vec![
            Entity {
                original: "john@example.com".to_string(),
                token: "[EMAIL_001]".to_string(),
                entity_type: "EMAIL".to_string(),
                position: 0,
            }
        ],
    };
    
    let req = test::TestRequest::post()
        .uri("/store")
        .set_json(&store_req)
        .to_request();
    
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    
    let req = test::TestRequest::get()
        .uri("/retrieve/test-123")
        .to_request();
    
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
}

#[actix_web::test]
async fn test_health_endpoint() {
    let app = test::init_service(
        App::new()
            .route("/health", web::get().to(health))
    ).await;
    
    let req = test::TestRequest::get()
        .uri("/health")
        .to_request();
    
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
}

#[actix_web::test]
async fn test_encryption_decryption() {
    let master_key = vec![0u8; 32];
    let vault_state = VaultState::new(master_key, 60);
    
    let plaintext = b"sensitive data";
    let (ciphertext, nonce) = vault_state.encrypt(plaintext).unwrap();
    
    let decrypted = vault_state.decrypt(&ciphertext, &nonce).unwrap();
    assert_eq!(plaintext, &decrypted[..]);
}

#[actix_web::test]
async fn test_invalid_decryption() {
    let master_key = vec![0u8; 32];
    let vault_state = VaultState::new(master_key, 60);
    
    let plaintext = b"sensitive data";
    let (ciphertext, _) = vault_state.encrypt(plaintext).unwrap();
    
    // Try to decrypt with wrong nonce
    let wrong_nonce = vec![0u8; 12];
    let result = vault_state.decrypt(&ciphertext, &wrong_nonce);
    assert!(result.is_err());
}
