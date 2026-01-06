use assert_cmd::Command;
use predicates::prelude::*;
use tempfile::TempDir;
use std::fs;

#[test]
fn test_cli_help() {
    let mut cmd = Command::cargo_bin("saferoute").unwrap();
    cmd.arg("--help")
        .assert()
        .success()
        .stdout(predicate::str::contains("Zero-knowledge privacy proxy"));
}

#[test]
fn test_cli_version() {
    let mut cmd = Command::cargo_bin("saferoute").unwrap();
    cmd.arg("--version")
        .assert()
        .success()
        .stdout(predicate::str::contains("1.0.0"));
}

#[test]
fn test_start_without_docker_compose() {
    let temp_dir = TempDir::new().unwrap();
    
    let mut cmd = Command::cargo_bin("saferoute").unwrap();
    cmd.current_dir(temp_dir.path())
        .arg("start")
        .assert()
        .failure();
}

#[test]
fn test_config_validation() {
    let temp_dir = TempDir::new().unwrap();
    
    // Create a minimal docker-compose.yml
    let compose_content = r#"
services:
  test:
    image: alpine
"#;
    fs::write(temp_dir.path().join("docker-compose.yml"), compose_content).unwrap();
    
    // Create .env.example
    fs::write(temp_dir.path().join(".env.example"), "TEST=value").unwrap();
    
    let mut cmd = Command::cargo_bin("saferoute").unwrap();
    cmd.current_dir(temp_dir.path())
        .arg("install")
        .assert()
        .success();
    
    // Verify .env was created
    assert!(temp_dir.path().join(".env").exists());
}
