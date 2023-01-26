const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:8081" : ("http://" + window.location.host);
export default API_URL;
