import React, { useState, useEffect } from "react";

import { getParsed } from "../../services/utils/queryString";
import movieService from "../../services/API/movieService";
import { useFetching } from "../../services/hooks/useFetching";
import { usePagination } from "../../services/hooks/usePagination";

import Pagination from "../../UI/Pagination";
import Loader from "../../UI/Loader";

import styles from "./Movies.module.css";
import { Link } from "react-router-dom";

export default function Movies(props) {
  let [urlToImage, setUrlToImage] = useState("http://image.tmdb.org/t/p/w154");
  let [movies, setMovies] = useState([]);
  let [page, setPage] = useState(1);
  let [totalPages, setTotalPages] = useState(0);
  let [totalResults, setTotalResults] = useState(0);
  let [query, setQuery] = useState("");
  const [fetchMoviesByQuery, isMoviesLoading, movieError] = useFetching(
    async (query, page) => {
      const moviesData = await movieService.getMoviesByQuery(query, page);
      setTotalPages(moviesData.total_pages);
      setTotalResults(moviesData.total_results);
      setMovies(moviesData.results);
    }
  );
  let pagesArray = usePagination(totalPages);

  useEffect(async () => {
    const { query } = getParsed(props.location.search);
    setQuery(query);
    // secure_base_url = string -> "http://image.tmdb.org/t/p/"
    // poster_sizes = array of strings: w92, w154, w185, w342, w500. w780, original
    // const images = await movieService.getAPIConfiguration();
    // images
    //   ? setUrlToImage(images.secure_base_url + images.poster_sizes[1])
    //   : setUrlToImage("http://image.tmdb.org/t/p/w154");
    const APIConfig = localStorage.getItem("API_Config");
    if (APIConfig) {
      const imagesConfig = JSON.parse(APIConfig);
      setUrlToImage(
        imagesConfig.secure_base_url + imagesConfig.poster_sizes[1]
      );
    }

    fetchMoviesByQuery(query, 1);
  }, []);

  const changePage = (page) => {
    setPage(page);
    fetchMoviesByQuery(query, page);
  };

  let handlePageClick = (event) => {
    changePage(event.selected + 1);
  };

  return (
    <div className={styles.container}>
      {movieError && (
        <div className={styles.error}>
          <h2>
            Oops, there's been some mistake:{" "}
            <span className={styles.errorText}>{movieError}</span>
          </h2>
        </div>
      )}
      {isMoviesLoading ? (
        <div className={styles.spinner}>
          <Loader />
        </div>
      ) : (
        movies && (
          <div className={styles.moviesList}>
            <div className={styles.totalResults}>
              <p className={styles.totalResultsText}>
                <span className={styles.boldText}>{totalResults}</span> results were found for your query:
              </p>
            </div>
            <ul className={styles.movies}>
              {movies.map((movie) => (
                <li key={movie.id} className={styles.listItem}>
                  <Link
                    to={{
                      pathname: `${props.match.url}/${movie.id}`,
                      state: { cameFrom: props.location },
                    }}
                    className={styles.link}
                  >
                    <div className={styles.oneMovieContainer}>
                      <div className={styles.side}>
                        <img
                          className={styles.oneMovieImage}
                          src={urlToImage + movie.poster_path}
                          alt={movie.original_title + " poster"}
                        />
                      </div>
                      <div className={styles.oneMovieDescription}>
                        <h1 className={styles.oneMovieTitle}>
                          {movie.original_title}
                        </h1>
                        <p className={styles.date}>{movie.release_date}</p>
                        <h3>Overview</h3>
                        <p>{movie.overview}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
      {pagesArray.length > 1 && (
        <div className={styles.pagination}>
          <Pagination pageCount={totalPages} onPageChange={handlePageClick} />
        </div>
      )}
    </div>
  );
}
