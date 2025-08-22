# syntax=docker/dockerfile:1
FROM golang:1.25-alpine AS build
WORKDIR /src
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/mock-api ./cmd/server

FROM gcr.io/distroless/base-debian12
WORKDIR /app
COPY --from=build /out/mock-api /app/mock-api
ENV PORT=8081
EXPOSE 8081
ENTRYPOINT ["/app/mock-api"]
