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

type NERClient struct {
	baseURL    string
	httpClient *http.Client
}

func NewNERClient(baseURL string) *NERClient {
	return &NERClient{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (c *NERClient) DetectEntities(ctx context.Context, text string) ([]models.Entity, error) {
	reqBody := models.NERRequest{
		Text:   text,
		Domain: "general",
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", c.baseURL+"/detect", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("NER service returned status %d", resp.StatusCode)
	}

	var nerResp models.NERResponse
	if err := json.NewDecoder(resp.Body).Decode(&nerResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return nerResp.Entities, nil
}
