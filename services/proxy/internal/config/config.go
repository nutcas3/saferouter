package config

import (
	"os"
)

type Config struct {
	Port            string
	NERServiceURL   string
	VaultServiceURL string
	LLMProviderURL  string
	LLMAPIKey       string
	RedisURL        string
	LogLevel        string
}

func LoadFromEnv() *Config {
	return &Config{
		Port:            getEnv("PORT", "8080"),
		NERServiceURL:   getEnv("NER_SERVICE_URL", "http://localhost:8081"),
		VaultServiceURL: getEnv("VAULT_SERVICE_URL", "http://localhost:8082"),
		LLMProviderURL:  getEnv("LLM_PROVIDER_URL", "https://api.anthropic.com"),
		LLMAPIKey:       getEnv("LLM_API_KEY", ""),
		RedisURL:        getEnv("REDIS_URL", "redis://localhost:6379"),
		LogLevel:        getEnv("LOG_LEVEL", "info"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
