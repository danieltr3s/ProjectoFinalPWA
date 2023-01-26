const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:80" : ("https://" + window.location.host);
export default API_URL;
