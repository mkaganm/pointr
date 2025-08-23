package domain

type Site struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Location string `json:"location"`
}

type Building struct {
	ID     string `json:"id"`
	SiteID string `json:"site_id"`
	Name   string `json:"name"`
}

type Level struct {
	ID         string `json:"id"`
	BuildingID string `json:"building_id"`
	Name       string `json:"name"`
	Index      int    `json:"index"`
}
