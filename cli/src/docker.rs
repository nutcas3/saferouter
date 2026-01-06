use crate::error::{CliError, Result};
use std::process::Command;
use tracing::{info, error};

pub struct DockerClient;

impl DockerClient {
    pub fn new() -> Self {
        Self
    }
    
    pub fn check_installed(&self) -> Result<()> {
        Command::new("docker")
            .arg("--version")
            .output()
            .map_err(|_| CliError::DockerNotFound)?;
        Ok(())
    }
    
    pub fn check_compose_installed(&self) -> Result<()> {
        Command::new("docker")
            .args(["compose", "version"])
            .output()
            .map_err(|_| CliError::DockerCommandFailed(
                "docker compose not found".to_string()
            ))?;
        Ok(())
    }
    
    pub fn compose_up(&self, detached: bool) -> Result<()> {
        let mut cmd = Command::new("docker");
        cmd.args(["compose", "up"]);
        
        if detached {
            cmd.arg("-d");
        }
        
        let status = cmd.status()?;
        
        if !status.success() {
            return Err(CliError::DockerCommandFailed(
                "Failed to start services".to_string()
            ));
        }
        
        Ok(())
    }
    
    pub fn compose_down(&self, volumes: bool) -> Result<()> {
        let mut cmd = Command::new("docker");
        cmd.args(["compose", "down"]);
        
        if volumes {
            cmd.arg("-v");
        }
        
        let status = cmd.status()?;
        
        if !status.success() {
            return Err(CliError::DockerCommandFailed(
                "Failed to stop services".to_string()
            ));
        }
        
        Ok(())
    }
    
    pub fn compose_ps(&self) -> Result<()> {
        let status = Command::new("docker")
            .args(["compose", "ps"])
            .status()?;
        
        if !status.success() {
            return Err(CliError::ServiceNotRunning);
        }
        
        Ok(())
    }
    
    pub fn compose_logs(&self, follow: bool, service: Option<&str>) -> Result<()> {
        let mut cmd = Command::new("docker");
        cmd.args(["compose", "logs"]);
        
        if follow {
            cmd.arg("-f");
        }
        
        if let Some(svc) = service {
            cmd.arg(svc);
        }
        
        cmd.status()?;
        Ok(())
    }
    
    pub fn compose_build(&self) -> Result<()> {
        info!("Building Docker images...");
        
        let status = Command::new("docker")
            .args(["compose", "build"])
            .status()?;
        
        if !status.success() {
            return Err(CliError::DockerCommandFailed(
                "Build failed".to_string()
            ));
        }
        
        Ok(())
    }
}
