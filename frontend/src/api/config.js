const isLocalhost = window.location.hostname === "localhost";

const BASE_URL = isLocalhost
  ? "http://localhost:3000"
  : "https://instituteconnect.onrender.com";

export default BASE_URL;
