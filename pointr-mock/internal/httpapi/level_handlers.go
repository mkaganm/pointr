package httpapi

import (
	"github.com/gofiber/fiber/v2"
	"github.com/kaganm/pointr-mock/internal/domain"
)

// Level handlers

// ListLevels returns levels, optionally filtered by building_id
func (h *Handlers) ListLevels(c *fiber.Ctx) error {
	return c.JSON(h.Store.ListLevels(c.Query("building_id")))
}

// CreateLevels creates new levels (single or batch)
func (h *Handlers) CreateLevels(c *fiber.Ctx) error {
	// Try to parse as single level first
	var single domain.Level
	if err := c.BodyParser(&single); err == nil && (single.BuildingID != "" || single.Name != "") {
		created, err := h.Store.CreateLevels([]domain.Level{single})
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(fiber.StatusCreated).JSON(created[0])
	}

	// Try to parse as batch
	var batch struct {
		Items []domain.Level `json:"items"`
	}
	if err := c.BodyParser(&batch); err != nil || len(batch.Items) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "provide a Level object or {items: [...]}"})
	}
	created, err := h.Store.CreateLevels(batch.Items)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"items": created})
}

// GetLevel returns a specific level by ID
func (h *Handlers) GetLevel(c *fiber.Ctx) error {
	id := c.Params("id")
	if x, ok := h.Store.GetLevel(id); ok {
		return c.JSON(x)
	}
	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "level not found"})
}
