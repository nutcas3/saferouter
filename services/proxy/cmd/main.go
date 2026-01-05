package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/saferoute/proxy/internal/config"
	"github.com/saferoute/proxy/internal/handlers"
	"github.com/saferoute/proxy/internal/middleware"
	"github.com/saferoute/proxy/internal/services"
)

func main() {
	cfg := config.LoadFromEnv()

	nerClient := services.NewNERClient(cfg.NERServiceURL)
	vaultClient := services.NewVaultClient(cfg.VaultServiceURL)
	llmClient := services.NewLLMClient(cfg.LLMProviderURL, cfg.LLMAPIKey)

	proxyHandler := handlers.NewProxyHandler(nerClient, vaultClient, llmClient)

	mux := http.NewServeMux()

	mux.HandleFunc("/v1/chat/completions", proxyHandler.HandleChatCompletion)
	mux.HandleFunc("/v1/anonymize", proxyHandler.HandleAnonymize)
	mux.HandleFunc("/v1/restore", proxyHandler.HandleRestore)

	mux.HandleFunc("/health", handlers.HealthCheck)
	mux.HandleFunc("/ready", handlers.ReadinessCheck)
	mux.Handle("/metrics", promhttp.Handler())

	handler := middleware.Chain(
		mux,
		middleware.RequestID,
		middleware.Logger,
		middleware.CORS,
		middleware.RateLimit(100, 1*time.Second),
		middleware.Recovery,
		middleware.Metrics,
	)

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      handler,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("SafeRoute Proxy listening on %s", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced shutdown:", err)
	}

	log.Println("Server gracefully stopped")
}
