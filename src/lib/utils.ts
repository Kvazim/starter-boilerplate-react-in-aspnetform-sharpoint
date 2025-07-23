export const getBaseUrl = () => window.location.origin.includes('localhost') ? 'http://localhost:8080' : window.location.origin;
