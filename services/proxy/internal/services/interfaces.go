package services

import (
	"context"

	"github.com/saferoute/proxy/internal/models"
)

type NERService interface {
	DetectEntities(ctx context.Context, text string) ([]models.Entity, error)
}

type VaultService interface {
	StoreEntities(ctx context.Context, requestID string, entities []models.Entity) error
	GetEntities(ctx context.Context, requestID string) ([]models.Entity, error)
}

type LLMService interface {
	ChatCompletion(ctx context.Context, req models.ChatCompletionRequest) (models.ChatCompletionResponse, error)
}
