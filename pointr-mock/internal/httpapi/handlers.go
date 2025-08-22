package httpapi

import (
	"github.com/gofiber/fiber/v2"
	"github.com/kaganm/pointr-mock/internal/store"
)

type Handlers struct{ Store store.Store }

func NewHandlers(s store.Store) *Handlers { return &Handlers{Store: s} }

// Root endpoint - API overview
func (h *Handlers) Root(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "Pointr Mock API (Fiber)",
		"counts": fiber.Map{
			"sites":     len(h.Store.ListSites()),
			"buildings": len(h.Store.ListBuildings("")),
			"levels":    len(h.Store.ListLevels("")),
		},
	})
}

// Health check endpoint
func (h *Handlers) Health(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"status": "ok"})
}
