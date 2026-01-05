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

type VaultClient struct {
	baseURL    string
	httpClient *http.Client
}

func NewVaultClient(baseURL string) *VaultClient {
	return &VaultClient{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (c *VaultClient) StoreEntities(ctx context.Context, requestID string, entities []models.Entity) error {
	reqBody := models.VaultStoreRequest{
		RequestID: requestID,
		Entities:  entities,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", c.baseURL+"/store", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("vault service returned status %d", resp.StatusCode)
	}

	return nil
}

func (c *VaultClient) GetEntities(ctx context.Context, requestID string) ([]models.Entity, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", c.baseURL+"/retrieve/"+requestID, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("vault service returned status %d", resp.StatusCode)
	}

	var vaultResp models.VaultRetrieveResponse
	if err := json.NewDecoder(resp.Body).Decode(&vaultResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return vaultResp.Entities, nil
}
