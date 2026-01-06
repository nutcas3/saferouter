package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/saferoute/proxy/internal/models"
	"github.com/saferoute/proxy/internal/services"
)

// Mock implementations
type mockNERClient struct{}

func (m *mockNERClient) DetectEntities(ctx context.Context, text string) ([]models.Entity, error) {
	return []models.Entity{
		{Original: "john@example.com", Token: "[EMAIL_001]", Type: "EMAIL", Position: 12, Confidence: 0.95},
		{Original: "123-45-6789", Token: "[SSN_001]", Type: "SSN", Position: 40, Confidence: 0.98},
	}, nil
}

type mockVaultClient struct{}

func (m *mockVaultClient) StoreEntities(ctx context.Context, requestID string, entities []models.Entity) error {
	return nil
}

func (m *mockVaultClient) GetEntities(ctx context.Context, requestID string) ([]models.Entity, error) {
	return []models.Entity{
		{Original: "john@example.com", Token: "[EMAIL_001]", Type: "EMAIL", Confidence: 0.95},
		{Original: "123-45-6789", Token: "[SSN_001]", Type: "SSN", Confidence: 0.98},
	}, nil
}

type mockLLMClient struct{}

func (m *mockLLMClient) ChatCompletion(ctx context.Context, req models.ChatCompletionRequest) (models.ChatCompletionResponse, error) {
	return models.ChatCompletionResponse{
		ID:      "test-123",
		Object:  "chat.completion",
		Created: 1640995200,
		Model:   "claude-3",
		Choices: []models.Choice{
			{
				Index: 0,
				Message: models.Message{
					Role:    "assistant",
					Content: "LLM response with [EMAIL_001] and [SSN_001]",
				},
				FinishReason: "stop",
			},
		},
		Usage: models.Usage{
			PromptTokens:     10,
			CompletionTokens: 5,
			TotalTokens:      15,
		},
	}, nil
}

func TestHandleAnonymize(t *testing.T) {
	// Mock NER and Vault clients
	var nerClient services.NERService = &mockNERClient{}
	var vaultClient services.VaultService = &mockVaultClient{}
	var llmClient services.LLMService = &mockLLMClient{}

	handler := NewProxyHandler(nerClient, vaultClient, llmClient)

	reqBody := map[string]interface{}{
		"text": "My email is john@example.com and SSN is 123-45-6789",
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/v1/anonymize", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handler.HandleAnonymize(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response map[string]interface{}
	json.NewDecoder(w.Body).Decode(&response)

	if response["anonymized_text"] == nil {
		t.Error("Expected anonymized_text in response")
	}
}

func TestHandleRestore(t *testing.T) {
	var nerClient services.NERService = &mockNERClient{}
	var vaultClient services.VaultService = &mockVaultClient{}
	var llmClient services.LLMService = &mockLLMClient{}

	handler := NewProxyHandler(nerClient, vaultClient, llmClient)

	reqBody := map[string]interface{}{
		"text":       "[EMAIL_001] [SSN_001]",
		"request_id": "test-123",
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/v1/restore", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	handler.HandleRestore(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}
