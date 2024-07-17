<template>
  <div class="weather">
    <div v-if="weather">
      <h2>{{ weather.location.name }}</h2>
      <p>{{ weather.current.temp_c }} °C</p>
      <p>{{ weather.current.condition.text }}</p>
      <img
        style="width: 100px"
        :src="weather.current.condition.icon"
        :alt="weather.current.condition.text"
      />
    </div>
  </div>
</template>

<script>
import { getWeather } from "@/services/weatherService";

export default {
  data() {
    return {
      location: "",
      weather: null,
      lat: null,
      lon: null,
    };
  },
  methods: {
    async fetchWeather() {
      let query = this.location;
      if (!query && this.lat && this.lon) {
        query = `${this.lat},${this.lon}`;
      }
      if (query) {
        try {
          this.weather = await getWeather(query);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.setPosition,
          this.showError
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    },
    setPosition(position) {
      this.lat = position.coords.latitude;
      this.lon = position.coords.longitude;
      this.fetchWeather();
    },
    showError(error) {
      let errorMessage = "";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "User denied the request for Geolocation.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "The request to get user location timed out.";
          break;
        case error.UNKNOWN_ERROR:
          errorMessage = "An unknown error occurred.";
          break;
      }
      alert(errorMessage);
    },
  },
  mounted() {
    this.getLocation();
  },
};
</script>

<style scoped>
.weather {
  text-align: center;
}
</style>
