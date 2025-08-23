package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"github.com/kaganm/pointr-mock/internal/httpapi"
	"github.com/kaganm/pointr-mock/internal/seed"
	"github.com/kaganm/pointr-mock/internal/store"
)

func main() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "*",
		AllowHeaders:     "*",
		AllowCredentials: false,
		ExposeHeaders:    "*",
	}))

	// store & seed
	mem := store.NewMemoryStore()
	seed.Load(mem)

	// routes
	h := httpapi.NewHandlers(mem)
	httpapi.Register(app, h)

	// boot
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}
	log.Printf("listening on :%s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatal(err)
	}
}
