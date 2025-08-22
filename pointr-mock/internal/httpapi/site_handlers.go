package httpapi

import (
	"github.com/gofiber/fiber/v2"
	"github.com/kaganm/pointr-mock/internal/domain"
)

// Site handlers

// ListSites returns all sites
func (h *Handlers) ListSites(c *fiber.Ctx) error {
	return c.JSON(h.Store.ListSites())
}

// CreateSite creates a new site
func (h *Handlers) CreateSite(c *fiber.Ctx) error {
	var body domain.Site
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(h.Store.CreateSite(body))
}

// GetSite returns a specific site by ID
func (h *Handlers) GetSite(c *fiber.Ctx) error {
	id := c.Params("id")
	if x, ok := h.Store.GetSite(id); ok {
		return c.JSON(x)
	}
	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "site not found"})
}

// DeleteSite deletes a site by ID
func (h *Handlers) DeleteSite(c *fiber.Ctx) error {
	id := c.Params("id")
	if ok := h.Store.DeleteSite(id); ok {
		return c.SendStatus(fiber.StatusNoContent)
	}
	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "site not found"})
}
