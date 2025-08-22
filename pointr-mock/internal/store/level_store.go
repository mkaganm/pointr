package store

import (
	"errors"

	"github.com/google/uuid"
	"github.com/kaganm/pointr-mock/internal/domain"
)

// Level operations

// CreateLevels creates new levels in memory (single or batch)
func (m *MemoryStore) CreateLevels(in []domain.Level) ([]domain.Level, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	// Validate all levels before creating any
	for i := range in {
		lv := &in[i]
		if lv.BuildingID == "" {
			return nil, errors.New("building_id is required")
		}
		if _, ok := m.buildings[lv.BuildingID]; !ok {
			return nil, errors.New("building not found")
		}
		if lv.ID == "" {
			lv.ID = uuid.New().String()
		}
	}

	// Store all levels
	for _, lv := range in {
		m.levels[lv.ID] = lv
	}
	return in, nil
}

// GetLevel retrieves a level by ID
func (m *MemoryStore) GetLevel(id string) (domain.Level, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	x, ok := m.levels[id]
	return x, ok
}

// ListLevels returns levels, optionally filtered by building_id
func (m *MemoryStore) ListLevels(buildingID string) []domain.Level {
	m.mu.RLock()
	defer m.mu.RUnlock()
	out := []domain.Level{}
	for _, v := range m.levels {
		if buildingID == "" || v.BuildingID == buildingID {
			out = append(out, v)
		}
	}
	return out
}
