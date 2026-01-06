use crate::error::{CliError, Result};
use std::fs;
use std::path::{Path, PathBuf};

pub struct Config {
    pub project_dir: PathBuf,
    pub env_file: PathBuf,
}

impl Config {
    pub fn load() -> Result<Self> {
        let project_dir = std::env::current_dir()?;
        let env_file = project_dir.join(".env");
        
        Ok(Self {
            project_dir,
            env_file,
        })
    }
    
    pub fn ensure_env_file(&self) -> Result<()> {
        if !self.env_file.exists() {
            let example_file = self.project_dir.join(".env.example");
            if example_file.exists() {
                fs::copy(&example_file, &self.env_file)?;
                tracing::info!("Created .env from .env.example");
            } else {
                return Err(CliError::ConfigError(
                    ".env.example not found".to_string()
                ));
            }
        }
        Ok(())
    }
    
    pub fn validate_docker_compose(&self) -> Result<()> {
        let compose_file = self.project_dir.join("docker-compose.yml");
        if !compose_file.exists() {
            return Err(CliError::ConfigError(
                "docker-compose.yml not found".to_string()
            ));
        }
        Ok(())
    }
}
