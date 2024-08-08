import axios from "axios";
const baseUrl = 'http://localhost:8080'

export const getApi = async (url, token) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["token"] = `${token}`;
  }
  const response = await axios.get(
    baseUrl + "/api" + url,
    { headers }
  );
  return response.data;
};

export const postApi = async (url, data, token) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["token"] = `${token}`;
  }
  const response = await axios.post(
    baseUrl + "/api" + url,
    data,
    { headers }
  );
  return response.data;
};