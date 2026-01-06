use clap::{Parser, Subcommand};
use colored::Colorize;
use saferoute::{Config, DockerClient, Result};
use tracing::{info, error};
use tracing_subscriber;

#[derive(Parser)]
#[command(name = "saferoute")]
#[command(about = "Zero-knowledge privacy proxy for LLMs", long_about = None)]
#[command(version = "1.0.0")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
    
    #[arg(short, long, global = true)]
    verbose: bool,
}

#[derive(Subcommand)]
enum Commands {
    Start {
        #[arg(short, long)]
        detached: bool,
    },
    Stop {
        #[arg(short, long)]
        volumes: bool,
    },
    Status,
    Logs {
        #[arg(short, long)]
        follow: bool,
        #[arg(short, long)]
        service: Option<String>,
    },
    Install,
    Uninstall,
    Health,
}

#[tokio::main]
async fn main() {
    let cli = Cli::parse();
    
    let log_level = if cli.verbose { "debug" } else { "info" };
    tracing_subscriber::fmt()
        .with_env_filter(log_level)
        .init();

    let result = match cli.command {
        Commands::Start { detached } => start_services(detached),
        Commands::Stop { volumes } => stop_services(volumes),
        Commands::Status => show_status(),
        Commands::Logs { follow, service } => show_logs(follow, service.as_deref()),
        Commands::Install => install(),
        Commands::Uninstall => uninstall(),
        Commands::Health => health_check().await,
    };
    
    if let Err(e) = result {
        error!("{}", e);
        std::process::exit(1);
    }
}

fn start_services(detached: bool) -> Result<()> {
    println!("{}", "Starting SafeRoute services...".green().bold());
    
    let config = Config::load()?;
    config.validate_docker_compose()?;
    config.ensure_env_file()?;
    
    let docker = DockerClient::new();
    docker.check_installed()?;
    docker.check_compose_installed()?;
    
    docker.compose_up(detached)?;
    
    println!("{}", "✓ SafeRoute started successfully".green());
    println!("\n{}", "Services available at:".bold());
    println!("  {} http://localhost:8080", "Proxy:".cyan());
    println!("  {} http://localhost:3000", "Dashboard:".cyan());
    println!("  {} http://localhost:9090", "Prometheus:".cyan());
    println!("  {} http://localhost:3001", "Grafana:".cyan());
    
    if detached {
        println!("\n{}", "Tip: Run 'saferoute logs -f' to view logs".dimmed());
    }
    
    Ok(())
}

fn stop_services(volumes: bool) -> Result<()> {
    println!("{}", "Stopping SafeRoute services...".yellow().bold());
    
    let docker = DockerClient::new();
    docker.compose_down(volumes)?;
    
    println!("{}", "✓ SafeRoute stopped".green());
    
    if volumes {
        println!("{}", "  (volumes removed)".dimmed());
    }
    
    Ok(())
}

fn show_status() -> Result<()> {
    println!("{}", "SafeRoute Status".cyan().bold());
    println!();
    
    let docker = DockerClient::new();
    docker.compose_ps()?;
    
    Ok(())
}

fn show_logs(follow: bool, service: Option<&str>) -> Result<()> {
    let docker = DockerClient::new();
    docker.compose_logs(follow, service)?;
    Ok(())
}

fn install() -> Result<()> {
    println!("{}", "Installing SafeRoute...".green().bold());
    println!();
    
    let config = Config::load()?;
    let docker = DockerClient::new();
    
    println!("1. Checking Docker...");
    docker.check_installed()?;
    docker.check_compose_installed()?;
    println!("{}", "  ✓ Docker installed".green());
    
    println!("2. Validating project structure...");
    config.validate_docker_compose()?;
    println!("{}", "  ✓ Project structure valid".green());
    
    println!("3. Creating configuration...");
    config.ensure_env_file()?;
    println!("{}", "  ✓ Configuration created".green());
    
    println!("4. Building services...");
    docker.compose_build()?;
    println!("{}", "  ✓ Services built".green());
    
    println!();
    println!("{}", "✓ Installation complete!".green().bold());
    println!();
    println!("Next steps:");
    println!("  1. Edit .env and add your API keys");
    println!("  2. Run: {} to start services", "saferoute start -d".cyan());
    println!("  3. Run: {} to check status", "saferoute status".cyan());
    
    Ok(())
}

fn uninstall() -> Result<()> {
    println!("{}", "Uninstalling SafeRoute...".yellow().bold());
    
    let docker = DockerClient::new();
    docker.compose_down(true)?;
    
    println!("{}", "✓ SafeRoute uninstalled (volumes removed)".green());
    println!("{}", "  Note: .env file preserved".dimmed());
    
    Ok(())
}

async fn health_check() -> Result<()> {
    use reqwest::Client;
    
    println!("{}", "Running health checks...".cyan().bold());
    println!();
    
    let client = Client::new();
    let services = vec![
        ("Proxy", "http://localhost:8080/health"),
        ("NER Service", "http://localhost:8081/health"),
        ("Vault", "http://localhost:8082/health"),
        ("Dashboard", "http://localhost:3000/health"),
    ];
    
    for (name, url) in services {
        match client.get(url).send().await {
            Ok(resp) if resp.status().is_success() => {
                println!("  {} {}", "✓".green(), name);
            }
            _ => {
                println!("  {} {} (not responding)", "✗".red(), name);
            }
        }
    }
    
    Ok(())
}
