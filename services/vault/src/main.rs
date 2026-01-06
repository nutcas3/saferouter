use actix_web::{web, App, HttpServer, middleware};
use log::info;
use vault::{VaultState, store_entities, retrieve_entities, health, metrics};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    
    let master_key = std::env::var("MASTER_KEY")
        .unwrap_or_else(|_| "default-32-byte-key-change-me!!!".to_string())
        .into_bytes();
    
    if master_key.len() != 32 {
        panic!("MASTER_KEY must be exactly 32 bytes");
    }
    
    let ttl_seconds = std::env::var("TTL_SECONDS")
        .unwrap_or_else(|_| "60".to_string())
        .parse()
        .expect("Invalid TTL_SECONDS");
    
    let vault_state = web::Data::new(VaultState::new(master_key, ttl_seconds));
    
    info!("Vault Service starting on 0.0.0.0:8082");
    
    HttpServer::new(move || {
        App::new()
            .app_data(vault_state.clone())
            .wrap(middleware::Logger::default())
            .route("/store", web::post().to(store_entities))
            .route("/retrieve/{id}", web::get().to(retrieve_entities))
            .route("/health", web::get().to(health))
            .route("/metrics", web::get().to(metrics))
    })
    .bind(("0.0.0.0", 8082))?
    .run()
    .await
}
