# Playwright Dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-focal

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install browsers
RUN npx playwright install chromium firefox --with-deps

# Copy source code (after dependencies for better caching)
COPY . .

# Create directory for test results
RUN mkdir -p test-results playwright-report

# Default command to run tests
CMD ["npx", "playwright", "test"]
