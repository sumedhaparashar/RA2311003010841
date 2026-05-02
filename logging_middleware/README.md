# Logging Middleware

Reusable logging package for Affordmed campus hiring evaluation.

## Usage

```javascript
import { register, Logger } from './logging_middleware/logger.js';

// First, register with test server
await register({
  email: "your@college.edu",
  name: "Your Name",
  mobileNo: "9999999999",
  githubUsername: "githubusername",
  rollNo: "RA2311003010841",
  accessCode: "your_access_code"
});

// Then use logger anywhere
await Logger.info("frontend", "page", "Page loaded successfully");
await Logger.error("frontend", "api", "Failed to fetch data");
