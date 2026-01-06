use thiserror::Error;

#[derive(Error, Debug)]
pub enum CliError {
    #[error("Docker not found. Please install Docker first.")]
    DockerNotFound,
    
    #[error("Docker command failed: {0}")]
    DockerCommandFailed(String),
    
    #[error("Configuration error: {0}")]
    ConfigError(String),
    
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
    
    #[error("Service not running")]
    ServiceNotRunning,
    
    #[error("Invalid environment file")]
    InvalidEnvFile,
}

pub type Result<T> = std::result::Result<T, CliError>;
