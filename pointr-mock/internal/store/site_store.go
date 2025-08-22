package store

import (
	"github.com/google/uuid"
	"github.com/kaganm/pointr-mock/internal/domain"
)

// Site operations

// CreateSite creates a new site in memory
func (m *MemoryStore) CreateSite(in domain.Site) domain.Site {
	m.mu.Lock()
	defer m.mu.Unlock()
	if in.ID == "" {
		in.ID = uuid.New().String()
	}
	m.sites[in.ID] = in
	return in
}

// GetSite retrieves a site by ID
func (m *MemoryStore) GetSite(id string) (domain.Site, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	x, ok := m.sites[id]
	return x, ok
}

// DeleteSite removes a site by ID
func (m *MemoryStore) DeleteSite(id string) bool {
	m.mu.Lock()
	defer m.mu.Unlock()
	if _, ok := m.sites[id]; !ok {
		return false
	}
	delete(m.sites, id)
	return true
}

// ListSites returns all sites
func (m *MemoryStore) ListSites() []domain.Site {
	m.mu.RLock()
	defer m.mu.RUnlock()
	out := make([]domain.Site, 0, len(m.sites))
	for _, v := range m.sites {
		out = append(out, v)
	}
	return out
}
