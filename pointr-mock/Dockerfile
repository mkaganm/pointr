# syntax=docker/dockerfile:1
FROM golang:1.25-alpine AS build
RUN apk add --no-cache ca-certificates git
WORKDIR /src
ENV GOPROXY=https://proxy.golang.org,direct
ENV GOSUMDB=sum.golang.org
COPY go.mod go.sum ./
RUN /bin/sh -c 'for i in 1 2 3; do go mod download && exit 0 || sleep 5; done; exit 1'
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/mock-api ./cmd/server

FROM gcr.io/distroless/static-debian12
WORKDIR /app
COPY --from=build /out/mock-api /app/mock-api
ENV PORT=8081
EXPOSE 8081
USER 65532:65532
ENTRYPOINT ["/app/mock-api"]
