package services

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/saferoute/proxy/internal/models"
)

type LLMClient struct {
	baseURL    string
	apiKey     string
	httpClient *http.Client
}

func NewLLMClient(baseURL, apiKey string) *LLMClient {
	return &LLMClient{
		baseURL: baseURL,
		apiKey:  apiKey,
		httpClient: &http.Client{
			Timeout: 60 * time.Second,
		},
	}
}

func (c *LLMClient) ChatCompletion(ctx context.Context, req models.ChatCompletionRequest) (models.ChatCompletionResponse, error) {
	jsonData, err := json.Marshal(req)
	if err != nil {
		return models.ChatCompletionResponse{}, fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(ctx, "POST", c.baseURL+"/v1/messages", bytes.NewBuffer(jsonData))
	if err != nil {
		return models.ChatCompletionResponse{}, fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("x-api-key", c.apiKey)
	httpReq.Header.Set("anthropic-version", "2023-06-01")

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return models.ChatCompletionResponse{}, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return models.ChatCompletionResponse{}, fmt.Errorf("LLM provider returned status %d", resp.StatusCode)
	}

	var llmResp models.ChatCompletionResponse
	if err := json.NewDecoder(resp.Body).Decode(&llmResp); err != nil {
		return models.ChatCompletionResponse{}, fmt.Errorf("failed to decode response: %w", err)
	}

	return llmResp, nil
}
