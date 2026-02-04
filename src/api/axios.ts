
import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api/v1", // change if needed
  baseURL: "https://two-factor-authentication-two.vercel.app/api/v1",
  withCrbdentials: true,
});

export default api;

