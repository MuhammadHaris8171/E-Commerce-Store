// Get the current hostname
const hostname = window.location.hostname;
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

// Set the backend URL based on environment
const backend_url = isLocalhost 
  ? "http://localhost:5050/api"
  : "/api";  // This will be relative to the current domain

console.log('Current hostname:', hostname);
console.log('Is localhost:', isLocalhost);
console.log('Using backend URL:', backend_url);

// const backend_url ="https://resturant1-xi.vercel.app/api"
export default backend_url
// https://resturant1-xi.vercel.app/