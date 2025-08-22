package store

import (
	"sync"

	"github.com/kaganm/pointr-mock/internal/domain"
)

// MemoryStore implements Store interface with in-memory storage
type MemoryStore struct {
	sites     map[string]domain.Site
	buildings map[string]domain.Building
	levels    map[string]domain.Level
	mu        sync.RWMutex
}

// NewMemoryStore creates a new memory store instance
func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		sites:     map[string]domain.Site{},
		buildings: map[string]domain.Building{},
		levels:    map[string]domain.Level{},
	}
}
