package httpapi

import (
	"github.com/gofiber/fiber/v2"
	"github.com/kaganm/pointr-mock/internal/domain"
)

// Building handlers

// ListBuildings returns buildings, optionally filtered by site_id
func (h *Handlers) ListBuildings(c *fiber.Ctx) error {
	return c.JSON(h.Store.ListBuildings(c.Query("site_id")))
}

// CreateBuilding creates a new building
func (h *Handlers) CreateBuilding(c *fiber.Ctx) error {
	var body domain.Building
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	created, err := h.Store.CreateBuilding(body)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(created)
}

// GetBuilding returns a specific building by ID
func (h *Handlers) GetBuilding(c *fiber.Ctx) error {
	id := c.Params("id")
	if x, ok := h.Store.GetBuilding(id); ok {
		return c.JSON(x)
	}
	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "building not found"})
}

// DeleteBuilding deletes a building by ID
func (h *Handlers) DeleteBuilding(c *fiber.Ctx) error {
	id := c.Params("id")
	if ok := h.Store.DeleteBuilding(id); ok {
		return c.SendStatus(fiber.StatusNoContent)
	}
	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "building not found"})
}
