

import axios from 'axios';

let accessToken = null;

// Configuration
const LOG_API_URL = 'http://20.207.122.201/evaluation-service/logs';
const REGISTER_API_URL = 'http://20.207.122.201/evaluation-service/register';

// Valid values (must be lowercase only)
const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_PACKAGES = {
  frontend: ['api', 'component', 'hook', 'page', 'state', 'style', 'auth', 'config', 'middleware'],
  backend: ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service', 'auth', 'config', 'middleware']
};

/**
 * Register with test server to get access token
 * Call this FIRST before any logging
 */
export async function register(registrationData) {
  try {
    const response = await axios.post(REGISTER_API_URL, {
      email: registrationData.email,
      name: registrationData.name,
      mobileNo: registrationData.mobileNo,
      githubUsername: registrationData.githubUsername,
      rollNo: registrationData.rollNo,
      accessCode: registrationData.accessCode
    });
    
    if (response.data.access_token) {
      accessToken = response.data.access_token;
      console.log('✅ Logging middleware registered successfully');
      return true;
    }
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Main Log function - sends log to test server
 * @param {string} stack - 'backend' or 'frontend'
 * @param {string} level - 'debug', 'info', 'warn', 'error', 'fatal'
 * @param {string} packageName - package name (api, component, page, etc.)
 * @param {string} message - descriptive log message
 */
export async function Log(stack, level, packageName, message) {
  // Validate parameters
  if (!VALID_STACKS.includes(stack)) {
    console.error(`Invalid stack: ${stack}`);
    return;
  }
  
  if (!VALID_LEVELS.includes(level)) {
    console.error(`Invalid level: ${level}`);
    return;
  }
  
  // Check if package is valid for this stack
  const validPackages = VALID_PACKAGES[stack];
  if (!validPackages.includes(packageName)) {
    console.error(`Invalid package: ${packageName} for ${stack}`);
    return;
  }
  
  // Check if we have token
  if (!accessToken) {
    console.warn('⚠️ Not registered. Call register() first');
    return;
  }
  
  try {
    const response = await axios.post(LOG_API_URL, {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: packageName.toLowerCase(),
      message: message.trim()
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200) {
      // Success - silent (no console output in production)
      return { success: true, logID: response.data.logID };
    }
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Log failed:', error.message);
    }
  }
}

// Convenience methods
export const Logger = {
  debug: (stack, packageName, message) => Log(stack, 'debug', packageName, message),
  info: (stack, packageName, message) => Log(stack, 'info', packageName, message),
  warn: (stack, packageName, message) => Log(stack, 'warn', packageName, message),
  error: (stack, packageName, message) => Log(stack, 'error', packageName, message),
  fatal: (stack, packageName, message) => Log(stack, 'fatal', packageName, message)
};
