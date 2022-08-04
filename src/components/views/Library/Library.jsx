import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import localStorageItems from "../../services/utils/localStorageItems";

import styles from "./Library.module.css";

export default function Library(props) {
  let [movies, setMovies] = useState([]);
  let [watchBtnStyle, setWatchBtnStyle] = useState("");
  let [queueBtnStyle, setQueueBtnStyle] = useState("");
  let [urlToImage, setUrlToImage] = useState("http://image.tmdb.org/t/p/w154");

  useEffect(() => {
    const APIConfig = localStorage.getItem("API_Config");
    if (APIConfig) {
      const imagesConfig = JSON.parse(APIConfig);
      setUrlToImage(
        imagesConfig.secure_base_url + imagesConfig.poster_sizes[1]
      );
    }

    showWatched();
  }, []);

  let getMoviesFromLocalStorage = (itemKey) => {
    const item = localStorage.getItem(itemKey);
    if (item) {
      setMovies(JSON.parse(item));
    }
  };

  let showWatched = () => {
    setWatchBtnStyle(`${styles.buttonStyle} ${styles.active}`);
    setQueueBtnStyle(`${styles.buttonStyle} ${styles.notActive}`);
    getMoviesFromLocalStorage(localStorageItems.WATCHED);
  };

  let showQueue = () => {
    setWatchBtnStyle(`${styles.buttonStyle} ${styles.notActive}`);
    setQueueBtnStyle(`${styles.buttonStyle} ${styles.active}`);
    getMoviesFromLocalStorage(localStorageItems.QUEUE);
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonsContainer}>
        <button className={watchBtnStyle} type="button" onClick={showWatched}>
          Watched
        </button>
        <button className={queueBtnStyle} type="button" onClick={showQueue}>
          Queue
        </button>
      </div>
      <div className={styles.moviesList}>
        <div className={styles.totalResults}>
          <p className={styles.totalResultsText}>
            {movies.length === 0 && (
              <span>There are no movies in this list.</span>
            )}
            {movies.length === 1 && <span>There is 1 movie in this list.</span>}
            {movies.length > 1 && <span>There're {movies.length} items.</span>}
          </p>
        </div>
        <ul className={styles.movies}>
          {movies.map((movie) => (
            <li key={movie.id} className={styles.listItem}>
              <Link
                to={{
                  pathname: `/movies/${movie.id}`,
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
    </div>
  );
}
