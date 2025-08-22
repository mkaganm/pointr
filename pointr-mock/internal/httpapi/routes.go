package httpapi

import "github.com/gofiber/fiber/v2"

func Register(app *fiber.App, h *Handlers) {
	// root & health
	app.Get("/", h.Root)
	app.Get("/health", h.Health)

	// convenience lists (bonus)
	app.Get("/sites", h.ListSites)
	app.Get("/buildings", h.ListBuildings)
	app.Get("/levels", h.ListLevels)

	// required by case
	app.Post("/sites", h.CreateSite)
	app.Get("/sites/:id", h.GetSite)
	app.Delete("/sites/:id", h.DeleteSite)

	app.Post("/buildings", h.CreateBuilding)
	app.Get("/buildings/:id", h.GetBuilding)
	app.Delete("/buildings/:id", h.DeleteBuilding)

	app.Post("/levels", h.CreateLevels)
	app.Get("/levels/:id", h.GetLevel)
}
