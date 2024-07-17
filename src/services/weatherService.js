import axios from "axios";

const API_KEY = "2f0a0e6bf88447a59df150409241707";
const BASE_URL = "http://api.weatherapi.com/v1";

export const getWeather = async (location) => {
  try {
    const response = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: API_KEY,
        q: location,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
