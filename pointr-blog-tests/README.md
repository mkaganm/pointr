# Pointr Blog Test Automation Project

A simple web automation project that tests the [Pointr Blog](https://www.pointr.tech/blog) using Playwright framework.

## What This Project Does

This project automatically tests the Pointr blog website by:
- Opening the blog page
- Getting all blog post titles
- Opening individual blog posts
- Analyzing the text content to find the most common words
- Saving the results to text files

## Project Structure

```
pointr-blog-tests/
├── tests/
│   ├── pages/              # Page Object Model classes
│   │   ├── HomePage.ts     # Methods for blog listing page
│   │   └── BlogPage.ts     # Methods for individual blog posts
│   └── specs/              # Test files
│       ├── home.spec.ts    # Tests for blog listing page
│       └── blog-detail.spec.ts  # Tests for individual blog posts
├── playwright.config.ts    # Playwright configuration
├── package.json           # Project dependencies and scripts
├── docker-compose.yml     # Docker configuration
└── README.md             # This file
```

## How It Works

1. **HomePage.ts**: Contains methods to navigate to the blog and get blog post titles and links
2. **BlogPage.ts**: Contains methods to open individual blog posts and extract text content
3. **home.spec.ts**: Tests that get all blog post titles from the main page
4. **blog-detail.spec.ts**: Tests that open the first 3 blog posts and analyze their text content

## Setup and Running

### Install Dependencies
```bash
npm install
npm run install-browsers
```

### Run Tests
```bash
# Run all tests
npm test

# Run tests with browser visible
npm run test:headed

# Run tests in UI mode
npm run test:ui
```

### View Results
```bash
# Open test report
npm run report
```

## Output Files

The project generates:
- `top_words_chromium.txt`: Most common words from blog posts (Chrome browser)
- `top_words_firefox.txt`: Most common words from blog posts (Firefox browser)
- `playwright-report/`: HTML test reports
- `test-results/`: Screenshots and videos from test runs

## Technologies Used

- **Playwright**: Web automation framework
- **TypeScript**: Programming language
- **Page Object Model**: Design pattern for test organization
- **Docker**: Containerization support

## Test Features

- ✅ Navigate to blog page
- ✅ Extract blog post titles
- ✅ Open individual blog posts
- ✅ Analyze text content
- ✅ Generate word frequency reports
- ✅ Cross-browser testing (Chrome & Firefox)
