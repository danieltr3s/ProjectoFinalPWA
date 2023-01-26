const API_URL = process.env.NODE_ENV === "development" ? "http://192.168.1.192:8081" : ("https://" + window.location.host);
export default API_URL;
