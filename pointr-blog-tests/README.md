# Pointr Blog Test Automation Project

This project is designed to test the [Pointr Blog](https://www.pointr.tech/blog) page using Playwright and Allure reporting system.

## 🚀 Features

- **Playwright**: Modern web automation framework
- **Allure Reporting**: Detailed test reporting system
- **Page Object Model**: Maintainable test structure
- **Multi-browser Support**: Chrome and Firefox support
- **TypeScript**: Type safety
- **Parallel Execution**: Parallel test execution

## 📋 Tested Features

Basic features tested on the Pointr Blog page:

- ✅ Page opening and loading
- ✅ Page title verification
- ✅ Blog title visibility
- ✅ Page content verification
- ✅ Screenshot capture

## 🛠️ Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Install Playwright browsers:**
```bash
npm run install-browsers
```

3. **Create environment file:**
```bash
cp env.example .env
```

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run in headed mode (browser visible)
npm run test:headed

# Run in UI mode
npm run test:ui

# Run in debug mode
npm run test:debug
```

### Test Categories

```bash
# Only smoke tests
npm run test:smoke

# Only regression tests
npm run test:regression
```

## 📊 Reporting

### Allure Reports

```bash
# Generate report
npm run report

# Open report
npm run report:open

# Serve report
npm run report:serve
```

## 📁 Project Structure

```
├── tests/
│   └── specs/           # Test files
│       └── home.spec.ts # Pointr Blog tests
├── allure-results/      # Allure results
├── test-results/        # Playwright results
├── screenshots/         # Screenshots
├── videos/             # Video recordings
├── playwright.config.ts # Playwright configuration
├── package.json
└── README.md
```

## 🔧 Configuration

### Base URL
The project is configured for the [Pointr Blog](https://www.pointr.tech/blog) page.

### Browsers
- Chrome
- Firefox

## 🏷️ Test Tags

- `@smoke`: Basic functionality tests
- `@regression`: Detailed tests

## 🐳 Docker Support

```bash
# Run tests with Docker
docker-compose up
```

## 📝 Next Steps

1. **Expand test scenarios**
2. **Test more page elements**
3. **Add API tests**
4. **Add performance tests**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests
4. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
