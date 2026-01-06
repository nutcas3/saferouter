package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHandleAnonymize(t *testing.T) {
	// Mock NER and Vault clients
	nerClient := &mockNERClient{}
	vaultClient := &mockVaultClient{}
	llmClient := &mockLLMClient{}

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
	nerClient := &mockNERClient{}
	vaultClient := &mockVaultClient{}
	llmClient := &mockLLMClient{}

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

// Mock implementations
type mockNERClient struct{}

func (m *mockNERClient) DetectEntities(text string, domain string) ([]Entity, error) {
	return []Entity{
		{Original: "john@example.com", Token: "[EMAIL_001]", Type: "EMAIL", Position: 12},
		{Original: "123-45-6789", Token: "[SSN_001]", Type: "SSN", Position: 40},
	}, nil
}

type mockVaultClient struct{}

func (m *mockVaultClient) StoreEntities(requestID string, entities []Entity) error {
	return nil
}

func (m *mockVaultClient) RetrieveEntities(requestID string) ([]Entity, error) {
	return []Entity{
		{Original: "john@example.com", Token: "[EMAIL_001]", Type: "EMAIL"},
		{Original: "123-45-6789", Token: "[SSN_001]", Type: "SSN"},
	}, nil
}

type mockLLMClient struct{}

func (m *mockLLMClient) SendRequest(text string) (string, error) {
	return "LLM response", nil
}

type Entity struct {
	Original string
	Token    string
	Type     string
	Position int
}
