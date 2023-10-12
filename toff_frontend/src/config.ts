// Determine if the app is in development or production mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Define API base URLs for development and production
const developmentAPI = 'http://localhost:3030';
const productionAPI = 'https://toff.brokoly.de';

// Set the API base URL based on the environment
const API_BASE_URL = isDevelopment ? developmentAPI : productionAPI;

export { API_BASE_URL };