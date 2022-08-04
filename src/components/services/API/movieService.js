import axios from "axios";

const API_KEY = "32f232b8967525b34e6bb812290b4e65";

export default class movieService {
  static async getTrending(page = 1) {
    const response = await axios.get(
      "https://api.themoviedb.org/3/trending/movie/day",
      {
        params: {
          api_key: API_KEY,
          page: page,
        },
      }
    );
    return response.data;
  }

  static async getMoviesByQuery(searchQuery = "popular", page = 1) {
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: API_KEY,
          query: searchQuery,
          page: page,
          include_adult: false,
          language: "en-US",
        },
      }
    );
    return response.data;
  }

  static async getAPIConfiguration() {
    const response = await axios.get(
      "https://api.themoviedb.org/3/configuration",
      {
        params: {
          api_key: API_KEY,
        },
      }
    );
    return response.data.images;
  }

  static async getMovieDetails(movieID) {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieID}`,
      {
        params: {
          api_key: API_KEY,
          language: "en-US",
        },
      }
    );
    return response.data;
  }
}
