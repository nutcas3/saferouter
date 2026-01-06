package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/saferoute/proxy/internal/models"
	"github.com/saferoute/proxy/internal/services"
)

// Mock implementations
type mockNERClient struct {
	shouldFail bool
}

func (m *mockNERClient) DetectEntities(ctx context.Context, text string) ([]models.Entity, error) {
	if m.shouldFail {
		return nil, errors.New("NER service error")
	}
	return []models.Entity{
		{Original: "john@example.com", Token: "[EMAIL_001]", Type: "EMAIL", Position: 12, Confidence: 0.95},
		{Original: "123-45-6789", Token: "[SSN_001]", Type: "SSN", Position: 40, Confidence: 0.98},
	}, nil
}

type mockVaultClient struct {
	shouldFailStore    bool
	shouldFailRetrieve bool
}

func (m *mockVaultClient) StoreEntities(ctx context.Context, requestID string, entities []models.Entity) error {
	if m.shouldFailStore {
		return errors.New("Vault store error")
	}
	return nil
}

func (m *mockVaultClient) GetEntities(ctx context.Context, requestID string) ([]models.Entity, error) {
	if m.shouldFailRetrieve {
		return nil, errors.New("Vault retrieve error")
	}
	return []models.Entity{
		{Original: "john@example.com", Token: "[EMAIL_001]", Type: "EMAIL", Confidence: 0.95},
		{Original: "123-45-6789", Token: "[SSN_001]", Type: "SSN", Confidence: 0.98},
	}, nil
}

type mockLLMClient struct {
	shouldFail bool
}

func (m *mockLLMClient) ChatCompletion(ctx context.Context, req models.ChatCompletionRequest) (models.ChatCompletionResponse, error) {
	if m.shouldFail {
		return models.ChatCompletionResponse{}, errors.New("LLM service error")
	}
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

	// Add request_id to context
	ctx := context.WithValue(req.Context(), "request_id", "test-request-123")
	req = req.WithContext(ctx)

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

	// Add request_id to context
	ctx := context.WithValue(req.Context(), "request_id", "test-request-123")
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()

	handler.HandleRestore(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}

func TestHandleChatCompletion(t *testing.T) {
	var nerClient services.NERService = &mockNERClient{}
	var vaultClient services.VaultService = &mockVaultClient{}
	var llmClient services.LLMService = &mockLLMClient{}

	handler := NewProxyHandler(nerClient, vaultClient, llmClient)

	reqBody := models.ChatCompletionRequest{
		Model: "claude-3",
		Messages: []models.Message{
			{Role: "user", Content: "My email is john@example.com and SSN is 123-45-6789"},
		},
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/v1/chat/completions", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	ctx := context.WithValue(req.Context(), "request_id", "test-request-123")
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	handler.HandleChatCompletion(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response models.ChatCompletionResponse
	json.NewDecoder(w.Body).Decode(&response)

	if response.ID != "test-123" {
		t.Error("Expected valid response")
	}
}

func TestHandleChatCompletion_InvalidJSON(t *testing.T) {
	var nerClient services.NERService = &mockNERClient{}
	var vaultClient services.VaultService = &mockVaultClient{}
	var llmClient services.LLMService = &mockLLMClient{}

	handler := NewProxyHandler(nerClient, vaultClient, llmClient)

	req := httptest.NewRequest("POST", "/v1/chat/completions", bytes.NewBuffer([]byte("invalid json")))
	ctx := context.WithValue(req.Context(), "request_id", "test-request-123")
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	handler.HandleChatCompletion(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}
}

func TestHandleChatCompletion_NERFailure(t *testing.T) {
	var nerClient services.NERService = &mockNERClient{shouldFail: true}
	var vaultClient services.VaultService = &mockVaultClient{}
	var llmClient services.LLMService = &mockLLMClient{}

	handler := NewProxyHandler(nerClient, vaultClient, llmClient)

	reqBody := models.ChatCompletionRequest{
		Model: "claude-3",
		Messages: []models.Message{
			{Role: "user", Content: "Test message"},
		},
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/v1/chat/completions", bytes.NewBuffer(body))
	ctx := context.WithValue(req.Context(), "request_id", "test-request-123")
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	handler.HandleChatCompletion(w, req)

	if w.Code != http.StatusServiceUnavailable {
		t.Errorf("Expected status 503, got %d", w.Code)
	}
}

func TestHandleChatCompletion_VaultStoreFailure(t *testing.T) {
	var nerClient services.NERService = &mockNERClient{}
	var vaultClient services.VaultService = &mockVaultClient{shouldFailStore: true}
	var llmClient services.LLMService = &mockLLMClient{}

	handler := NewProxyHandler(nerClient, vaultClient, llmClient)

	reqBody := models.ChatCompletionRequest{
		Model: "claude-3",
		Messages: []models.Message{
			{Role: "user", Content: "Test message"},
		},
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/v1/chat/completions", bytes.NewBuffer(body))
	ctx := context.WithValue(req.Context(), "request_id", "test-request-123")
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	handler.HandleChatCompletion(w, req)

	if w.Code != http.StatusServiceUnavailable {
		t.Errorf("Expected status 503, got %d", w.Code)
	}
}

func TestHandleChatCompletion_LLMFailure(t *testing.T) {
	var nerClient services.NERService = &mockNERClient{}
	var vaultClient services.VaultService = &mockVaultClient{}
	var llmClient services.LLMService = &mockLLMClient{shouldFail: true}

	handler := NewProxyHandler(nerClient, vaultClient, llmClient)

	reqBody := models.ChatCompletionRequest{
		Model: "claude-3",
		Messages: []models.Message{
			{Role: "user", Content: "Test message"},
		},
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/v1/chat/completions", bytes.NewBuffer(body))
	ctx := context.WithValue(req.Context(), "request_id", "test-request-123")
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	handler.HandleChatCompletion(w, req)

	if w.Code != http.StatusServiceUnavailable {
		t.Errorf("Expected status 503, got %d", w.Code)
	}
}

func TestHandleChatCompletion_VaultRetrieveFailure(t *testing.T) {
	var nerClient services.NERService = &mockNERClient{}
	var vaultClient services.VaultService = &mockVaultClient{shouldFailRetrieve: true}
	var llmClient services.LLMService = &mockLLMClient{}

	handler := NewProxyHandler(nerClient, vaultClient, llmClient)

	reqBody := models.ChatCompletionRequest{
		Model: "claude-3",
		Messages: []models.Message{
			{Role: "user", Content: "Test message"},
		},
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/v1/chat/completions", bytes.NewBuffer(body))
	ctx := context.WithValue(req.Context(), "request_id", "test-request-123")
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	handler.HandleChatCompletion(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", w.Code)
	}
}

func TestHandleAnonymize_InvalidJSON(t *testing.T) {
	var nerClient services.NERService = &mockNERClient{}
	var vaultClient services.VaultService = &mockVaultClient{}
	var llmClient services.LLMService = &mockLLMClient{}

	handler := NewProxyHandler(nerClient, vaultClient, llmClient)

	req := httptest.NewRequest("POST", "/v1/anonymize", bytes.NewBuffer([]byte("invalid json")))
	ctx := context.WithValue(req.Context(), "request_id", "test-request-123")
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	handler.HandleAnonymize(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}
}

func TestHandleAnonymize_NERFailure(t *testing.T) {
	var nerClient services.NERService = &mockNERClient{shouldFail: true}
	var vaultClient services.VaultService = &mockVaultClient{}
	var llmClient services.LLMService = &mockLLMClient{}

	handler := NewProxyHandler(nerClient, vaultClient, llmClient)

	reqBody := map[string]interface{}{"text": "Test"}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/v1/anonymize", bytes.NewBuffer(body))
	ctx := context.WithValue(req.Context(), "request_id", "test-request-123")
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	handler.HandleAnonymize(w, req)

	if w.Code != http.StatusServiceUnavailable {
		t.Errorf("Expected status 503, got %d", w.Code)
	}
}

func TestHandleAnonymize_VaultFailure(t *testing.T) {
	var nerClient services.NERService = &mockNERClient{}
	var vaultClient services.VaultService = &mockVaultClient{shouldFailStore: true}
	var llmClient services.LLMService = &mockLLMClient{}

	handler := NewProxyHandler(nerClient, vaultClient, llmClient)

	reqBody := map[string]interface{}{"text": "Test"}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/v1/anonymize", bytes.NewBuffer(body))
	ctx := context.WithValue(req.Context(), "request_id", "test-request-123")
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	handler.HandleAnonymize(w, req)

	if w.Code != http.StatusServiceUnavailable {
		t.Errorf("Expected status 503, got %d", w.Code)
	}
}

func TestHandleRestore_InvalidJSON(t *testing.T) {
	var nerClient services.NERService = &mockNERClient{}
	var vaultClient services.VaultService = &mockVaultClient{}
	var llmClient services.LLMService = &mockLLMClient{}

	handler := NewProxyHandler(nerClient, vaultClient, llmClient)

	req := httptest.NewRequest("POST", "/v1/restore", bytes.NewBuffer([]byte("invalid json")))
	ctx := context.WithValue(req.Context(), "request_id", "test-request-123")
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	handler.HandleRestore(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}
}

func TestHandleRestore_VaultFailure(t *testing.T) {
	var nerClient services.NERService = &mockNERClient{}
	var vaultClient services.VaultService = &mockVaultClient{shouldFailRetrieve: true}
	var llmClient services.LLMService = &mockLLMClient{}

	handler := NewProxyHandler(nerClient, vaultClient, llmClient)

	reqBody := map[string]interface{}{
		"text":       "Test",
		"request_id": "test-123",
	}
	body, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("POST", "/v1/restore", bytes.NewBuffer(body))
	ctx := context.WithValue(req.Context(), "request_id", "test-request-123")
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	handler.HandleRestore(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 500, got %d", w.Code)
	}
}
