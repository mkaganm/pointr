package store

import (
	"errors"

	"github.com/google/uuid"
	"github.com/kaganm/pointr-mock/internal/domain"
)

// Building operations

// CreateBuilding creates a new building in memory
func (m *MemoryStore) CreateBuilding(in domain.Building) (domain.Building, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if in.SiteID == "" {
		return domain.Building{}, errors.New("site_id is required")
	}
	if _, ok := m.sites[in.SiteID]; !ok {
		return domain.Building{}, errors.New("site not found")
	}
	if in.ID == "" {
		in.ID = uuid.New().String()
	}
	m.buildings[in.ID] = in
	return in, nil
}

// GetBuilding retrieves a building by ID
func (m *MemoryStore) GetBuilding(id string) (domain.Building, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	x, ok := m.buildings[id]
	return x, ok
}

// DeleteBuilding removes a building by ID
func (m *MemoryStore) DeleteBuilding(id string) bool {
	m.mu.Lock()
	defer m.mu.Unlock()
	if _, ok := m.buildings[id]; !ok {
		return false
	}
	delete(m.buildings, id)
	return true
}

// ListBuildings returns buildings, optionally filtered by site_id
func (m *MemoryStore) ListBuildings(siteID string) []domain.Building {
	m.mu.RLock()
	defer m.mu.RUnlock()
	out := []domain.Building{}
	for _, v := range m.buildings {
		if siteID == "" || v.SiteID == siteID {
			out = append(out, v)
		}
	}
	return out
}
