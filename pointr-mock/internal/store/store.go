package store

import "github.com/kaganm/pointr-mock/internal/domain"

// Store abstracts data ops (easy to swap Memory/Redis/PG later)
type Store interface {
	// sites
	CreateSite(domain.Site) domain.Site
	GetSite(id string) (domain.Site, bool)
	DeleteSite(id string) bool
	ListSites() []domain.Site

	// buildings
	CreateBuilding(domain.Building) (domain.Building, error)
	GetBuilding(id string) (domain.Building, bool)
	DeleteBuilding(id string) bool
	ListBuildings(siteID string) []domain.Building

	// levels
	CreateLevels([]domain.Level) ([]domain.Level, error)
	GetLevel(id string) (domain.Level, bool)
	ListLevels(buildingID string) []domain.Level
}
