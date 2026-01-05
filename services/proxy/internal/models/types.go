package models

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatCompletionRequest struct {
	Model       string    `json:"model"`
	Messages    []Message `json:"messages"`
	Temperature float64   `json:"temperature,omitempty"`
	MaxTokens   int       `json:"max_tokens,omitempty"`
}

type ChatCompletionResponse struct {
	ID      string   `json:"id"`
	Object  string   `json:"object"`
	Created int64    `json:"created"`
	Model   string   `json:"model"`
	Choices []Choice `json:"choices"`
	Usage   Usage    `json:"usage"`
}

type Choice struct {
	Index        int     `json:"index"`
	Message      Message `json:"message"`
	FinishReason string  `json:"finish_reason"`
}

type Usage struct {
	PromptTokens     int `json:"prompt_tokens"`
	CompletionTokens int `json:"completion_tokens"`
	TotalTokens      int `json:"total_tokens"`
}

type Entity struct {
	Original   string  `json:"original"`
	Token      string  `json:"token"`
	Type       string  `json:"type"`
	Position   int     `json:"position"`
	Confidence float64 `json:"confidence"`
}

type NERRequest struct {
	Text   string `json:"text"`
	Domain string `json:"domain,omitempty"`
}

type NERResponse struct {
	Entities []Entity `json:"entities"`
	Count    int      `json:"count"`
	Domain   string   `json:"domain"`
}

type VaultStoreRequest struct {
	RequestID string   `json:"request_id"`
	Entities  []Entity `json:"entities"`
}

type VaultStoreResponse struct {
	Success   bool   `json:"success"`
	RequestID string `json:"request_id"`
	ExpiresAt int64  `json:"expires_at"`
}

type VaultRetrieveResponse struct {
	Entities []Entity `json:"entities"`
}
