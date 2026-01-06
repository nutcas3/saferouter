package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/saferoute/proxy/internal/models"
	"github.com/saferoute/proxy/internal/services"
)

type ProxyHandler struct {
	nerClient   services.NERService
	vaultClient services.VaultService
	llmClient   services.LLMService
}

func NewProxyHandler(ner services.NERService, vault services.VaultService, llm services.LLMService) *ProxyHandler {
	return &ProxyHandler{
		nerClient:   ner,
		vaultClient: vault,
		llmClient:   llm,
	}
}

func (h *ProxyHandler) HandleChatCompletion(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()
	requestID := r.Context().Value("request_id").(string)

	log.Printf("[%s] Received chat completion request", requestID)

	var req models.ChatCompletionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	originalText := extractTextFromMessages(req.Messages)

	log.Printf("[%s] Calling NER service...", requestID)
	nerStart := time.Now()
	entities, err := h.nerClient.DetectEntities(r.Context(), originalText)
	if err != nil {
		log.Printf("[%s] NER failed: %v", requestID, err)
		respondError(w, "NER service unavailable", http.StatusServiceUnavailable)
		return
	}
	nerLatency := time.Since(nerStart)
	log.Printf("[%s] NER detected %d entities in %v", requestID, len(entities), nerLatency)

	log.Printf("[%s] Storing entities in vault...", requestID)
	vaultStart := time.Now()
	if err := h.vaultClient.StoreEntities(r.Context(), requestID, entities); err != nil {
		log.Printf("[%s] Vault store failed: %v", requestID, err)
		respondError(w, "Vault service unavailable", http.StatusServiceUnavailable)
		return
	}
	vaultStoreLatency := time.Since(vaultStart)
	log.Printf("[%s] Entities stored in %v", requestID, vaultStoreLatency)

	tokenizedReq := h.tokenizeRequest(req, entities)
	log.Printf("[%s] Request tokenized, forwarding to LLM...", requestID)

	llmStart := time.Now()
	llmResp, err := h.llmClient.ChatCompletion(r.Context(), tokenizedReq)
	if err != nil {
		log.Printf("[%s] LLM failed: %v", requestID, err)
		respondError(w, "LLM service unavailable", http.StatusServiceUnavailable)
		return
	}
	llmLatency := time.Since(llmStart)
	log.Printf("[%s] LLM response received in %v", requestID, llmLatency)

	log.Printf("[%s] Retrieving entities from vault...", requestID)
	vaultGetStart := time.Now()
	retrievedEntities, err := h.vaultClient.GetEntities(r.Context(), requestID)
	if err != nil {
		log.Printf("[%s] Vault retrieve failed: %v", requestID, err)
		respondError(w, "Vault retrieve failed", http.StatusInternalServerError)
		return
	}
	vaultGetLatency := time.Since(vaultGetStart)
	log.Printf("[%s] Entities retrieved in %v", requestID, vaultGetLatency)

	restoredResp := h.restoreResponse(llmResp, retrievedEntities)

	totalLatency := time.Since(startTime)
	log.Printf("[%s] Request completed in %v (NER: %v, Vault: %v/%v, LLM: %v)",
		requestID, totalLatency, nerLatency, vaultStoreLatency, vaultGetLatency, llmLatency)

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Request-ID", requestID)
	w.Header().Set("X-Latency-Ms", fmt.Sprintf("%.2f", totalLatency.Seconds()*1000))
	json.NewEncoder(w).Encode(restoredResp)
}

func (h *ProxyHandler) HandleAnonymize(w http.ResponseWriter, r *http.Request) {
	requestID := r.Context().Value("request_id").(string)

	var req struct {
		Text string `json:"text"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	entities, err := h.nerClient.DetectEntities(r.Context(), req.Text)
	if err != nil {
		respondError(w, "NER service unavailable", http.StatusServiceUnavailable)
		return
	}

	if err := h.vaultClient.StoreEntities(r.Context(), requestID, entities); err != nil {
		respondError(w, "Vault service unavailable", http.StatusServiceUnavailable)
		return
	}

	anonymizedText := req.Text
	for _, entity := range entities {
		anonymizedText = strings.ReplaceAll(anonymizedText, entity.Original, entity.Token)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"request_id":      requestID,
		"anonymized_text": anonymizedText,
		"entities_count":  len(entities),
	})
}

func (h *ProxyHandler) HandleRestore(w http.ResponseWriter, r *http.Request) {
	var req struct {
		RequestID string `json:"request_id"`
		Text      string `json:"text"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	entities, err := h.vaultClient.GetEntities(r.Context(), req.RequestID)
	if err != nil {
		respondError(w, "Vault retrieve failed", http.StatusInternalServerError)
		return
	}

	restoredText := req.Text
	for _, entity := range entities {
		restoredText = strings.ReplaceAll(restoredText, entity.Token, entity.Original)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"restored_text": restoredText,
	})
}

func (h *ProxyHandler) tokenizeRequest(req models.ChatCompletionRequest, entities []models.Entity) models.ChatCompletionRequest {
	tokenized := req
	for i := range tokenized.Messages {
		content := tokenized.Messages[i].Content
		for _, entity := range entities {
			content = strings.ReplaceAll(content, entity.Original, entity.Token)
		}
		tokenized.Messages[i].Content = content
	}
	return tokenized
}

func (h *ProxyHandler) restoreResponse(resp models.ChatCompletionResponse, entities []models.Entity) models.ChatCompletionResponse {
	restored := resp
	for i := range restored.Choices {
		content := restored.Choices[i].Message.Content
		for _, entity := range entities {
			content = strings.ReplaceAll(content, entity.Token, entity.Original)
		}
		restored.Choices[i].Message.Content = content
	}
	return restored
}

func extractTextFromMessages(messages []models.Message) string {
	var text string
	for _, msg := range messages {
		text += msg.Content + "\n"
	}
	return text
}

func respondError(w http.ResponseWriter, message string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}
