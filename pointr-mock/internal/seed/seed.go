package seed

import (
	"github.com/kaganm/pointr-mock/internal/domain"
	"github.com/kaganm/pointr-mock/internal/store"
)

func Load(s store.Store) {
	// deterministic IDs
	sid := "site-hospital-1"
	b1 := "bldg-main-1"
	b2 := "bldg-outpatient-1"

	s.CreateSite(domain.Site{ID: sid, Name: "General Hospital Campus"})
	s.CreateBuilding(domain.Building{ID: b1, SiteID: sid, Name: "Main Hospital"})
	s.CreateBuilding(domain.Building{ID: b2, SiteID: sid, Name: "Outpatient Center"})
	s.CreateLevels([]domain.Level{
		{ID: "lvl-b1", BuildingID: b1, Name: "Basement B1", Index: -1},
		{ID: "lvl-g", BuildingID: b1, Name: "Ground", Index: 0},
		{ID: "lvl-l1", BuildingID: b1, Name: "L1", Index: 1},
		{ID: "lvl-g2", BuildingID: b2, Name: "Ground", Index: 0},
	})
}
