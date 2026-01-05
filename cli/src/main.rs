use clap::{Parser, Subcommand};
use colored::Colorize;
use std::process::Command;

#[derive(Parser)]
#[command(name = "saferoute")]
#[command(about = "Zero-knowledge privacy proxy for LLMs", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    Start {
        #[arg(short, long, default_value = "false")]
        detached: bool,
    },
    Stop,
    Status,
    Logs {
        #[arg(short, long)]
        follow: bool,
    },
    Install,
    Uninstall,
}

#[tokio::main]
async fn main() {
    let cli = Cli::parse();

    match cli.command {
        Commands::Start { detached } => start_services(detached),
        Commands::Stop => stop_services(),
        Commands::Status => show_status(),
        Commands::Logs { follow } => show_logs(follow),
        Commands::Install => install(),
        Commands::Uninstall => uninstall(),
    }
}

fn start_services(detached: bool) {
    println!("{}", "Starting SafeRoute services...".green().bold());
    
    let mut cmd = Command::new("docker-compose");
    cmd.arg("up");
    
    if detached {
        cmd.arg("-d");
    }
    
    match cmd.status() {
        Ok(status) if status.success() => {
            println!("{}", "SafeRoute started successfully".green());
            println!("\n{}", "Services available at:".bold());
            println!("  {} http://localhost:8080", "Proxy:".cyan());
            println!("  {} http://localhost:3000", "Dashboard:".cyan());
            println!("  {} http://localhost:9090", "Prometheus:".cyan());
            println!("  {} http://localhost:3001", "Grafana:".cyan());
        }
        Ok(_) => println!("{}", "Failed to start services".red()),
        Err(e) => println!("{} {}", "Error:".red(), e),
    }
}

fn stop_services() {
    println!("{}", "Stopping SafeRoute services...".yellow().bold());
    
    match Command::new("docker-compose").arg("down").status() {
        Ok(status) if status.success() => {
            println!("{}", "SafeRoute stopped".green());
        }
        Ok(_) => println!("{}", "Failed to stop services".red()),
        Err(e) => println!("{} {}", "Error:".red(), e),
    }
}

fn show_status() {
    println!("{}", "SafeRoute Status".cyan().bold());
    println!();
    
    let _ = Command::new("docker-compose")
        .arg("ps")
        .status();
}

fn show_logs(follow: bool) {
    let mut cmd = Command::new("docker-compose");
    cmd.arg("logs");
    
    if follow {
        cmd.arg("-f");
    }
    
    let _ = cmd.status();
}

fn install() {
    println!("{}", "Installing SafeRoute...".green().bold());
    println!();
    
    println!("1. Checking Docker...");
    if !check_docker() {
        println!("{}", "Docker not found. Please install Docker first.".red());
        return;
    }
    println!("{}", "Docker installed".green());
    
    println!("2. Creating configuration...");
    create_env_file();
    println!("{}", "Configuration created".green());
    
    println!("3. Building services...");
    match Command::new("docker-compose").arg("build").status() {
        Ok(status) if status.success() => {
            println!("{}", "Services built".green());
        }
        _ => {
            println!("{}", "Build failed".red());
            return;
        }
    }
    
    println!();
    println!("{}", "Installation complete!".green().bold());
    println!();
    println!("Next steps:");
    println!("  1. Edit .env and add your API keys");
    println!("  2. Run: saferoute start");
}

fn uninstall() {
    println!("{}", "Uninstalling SafeRoute...".yellow().bold());
    
    let _ = Command::new("docker-compose")
        .arg("down")
        .arg("-v")
        .status();
    
    println!("{}", "SafeRoute uninstalled".green());
}

fn check_docker() -> bool {
    Command::new("docker")
        .arg("--version")
        .output()
        .is_ok()
}

fn create_env_file() {
    use std::fs;
    use std::path::Path;
    
    if !Path::new(".env").exists() {
        let _ = fs::copy(".env.example", ".env");
    }
}
