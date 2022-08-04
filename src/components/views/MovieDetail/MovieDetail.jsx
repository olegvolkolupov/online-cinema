import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import movieService from "../../services/API/movieService";
import { useFetching } from "../../services/hooks/useFetching";
import localStorageItems from "../../services/utils/localStorageItems";
import Loader from "../../UI/Loader";

import styles from "./MovieDetail.module.css";

let contries = "";
let genres = "";

const WATCHED_LABEL = {
  ADD: "Add to Watched",
  REMOVE: "Remove from Watched",
};

const QUEUE_LABEL = {
  ADD: "Add to Queue",
  REMOVE: "Remove from Queue",
};

export default function MovieDetail(props) {
  let [urlToImage, setUrlToImage] = useState("http://image.tmdb.org/t/p/w500");
  let [movie, setMovie] = useState({});
  let [watchedBtnLabel, setWatchedBtnLabel] = useState("");
  let [queueBtnLabel, setQueueBtnLabel] = useState("");
  const [fetchMovieDetails, isMovieLoading, movieError] = useFetching(
    async (movieId) => {
      const movieData = await movieService.getMovieDetails(movieId);
      setMovie(movieData);
      contries = movieData.production_countries
        .map(({ name }) => name)
        .join(", ");
      genres = movieData.genres.map(({ name }) => name).join(", ");
    }
  );

  useEffect(async () => {
    const { movieID } = props.match.params;
    // secure_base_url = string -> "http://image.tmdb.org/t/p/"
    // poster_sizes = array of strings: w92, w154, w185, w342, w500. w780, original
    // const images = await movieService.getAPIConfiguration();
    // images
    //   ? (urlToImage = images.secure_base_url + images.poster_sizes[4])
    //   : (urlToImage = "http://image.tmdb.org/t/p/w500");
    const APIConfig = localStorage.getItem("API_Config");
    if (APIConfig) {
      const imagesConfig = JSON.parse(APIConfig);
      setUrlToImage(
        imagesConfig.secure_base_url + imagesConfig.poster_sizes[4]
      );
    }

    fetchMovieDetails(movieID);

    let watched = JSON.parse(localStorage.getItem(localStorageItems.WATCHED));
    watched.some(({ id }) => +movieID === id)
      ? setWatchedBtnLabel(WATCHED_LABEL.REMOVE)
      : setWatchedBtnLabel(WATCHED_LABEL.ADD);

    let queue = JSON.parse(localStorage.getItem(localStorageItems.QUEUE));
    queue.some(({ id }) => +movieID === id)
      ? setQueueBtnLabel(QUEUE_LABEL.REMOVE)
      : setQueueBtnLabel(QUEUE_LABEL.ADD);
  }, []);

  const onGoBack = () => {
    if (props.location.state && props.location.state.cameFrom) {
      props.history.push(props.location.state.cameFrom);
    }
  };

  const handleWatched = () => {
    if (watchedBtnLabel === WATCHED_LABEL.ADD) {
      setWatchedBtnLabel(WATCHED_LABEL.REMOVE);
      addMovieToLocalStorage(localStorageItems.WATCHED);
    } else {
      setWatchedBtnLabel(WATCHED_LABEL.ADD);
      removeMovieFromLocalStorage(localStorageItems.WATCHED);
    }
  };

  const handleQueue = () => {
    if (queueBtnLabel === QUEUE_LABEL.ADD) {
      setQueueBtnLabel(QUEUE_LABEL.REMOVE);
      addMovieToLocalStorage(localStorageItems.QUEUE);
    } else {
      setQueueBtnLabel(QUEUE_LABEL.ADD);
      removeMovieFromLocalStorage(localStorageItems.QUEUE);
    }
  };

  const addMovieToLocalStorage = (storageKey) => {
    let item = JSON.parse(localStorage.getItem(storageKey));
    // add
    item.push(movie);
    localStorage.setItem(storageKey, JSON.stringify(item));
  };

  const removeMovieFromLocalStorage = (storageKey) => {
    let item = JSON.parse(localStorage.getItem(storageKey));
    item = item.filter(({ id }) => id !== movie.id);
    localStorage.setItem(storageKey, JSON.stringify(item));
  };

  return (
    <div>
      <button type="button" className={styles.backBtn} onClick={onGoBack}>
        Back
      </button>
      {movieError && (
        <div className={styles.error}>
          <h2>
            Oops, there's been some mistake:{" "}
            <span className={styles.errorText}>{movieError}</span>
          </h2>
        </div>
      )}
      {isMovieLoading ? (
        <div className={styles.spinner}>
          <Loader />
        </div>
      ) : (
        movie !== null && (
          <div className={styles.container}>
            <div className={styles.description}>
              <h1 className={styles.title}>{movie.original_title}</h1>
              <p>
                <span>{movie.release_date} * </span>
                {genres !== "" && <span>{genres} * </span>}
                <span>{movie.runtime}m</span>
              </p>
              <p>{contries}</p>
              <h3>Overview</h3>
              <p>{movie.overview}</p>
              <p>
                <a href={movie.homepage} target="_blank" rel="noreferrer">
                  go to the homepage of this movie
                </a>
              </p>
              <div className={styles.addButtonsContainer}>
                <button
                  type="button"
                  className={styles.firstBtn}
                  onClick={handleWatched}
                >
                  {watchedBtnLabel}
                </button>
                <button type="button" onClick={handleQueue}>
                  {queueBtnLabel}
                </button>
              </div>
            </div>
            <div className={styles.side}>
              <img
                className={styles.image}
                src={urlToImage + movie.poster_path}
                alt="poster"
              />
            </div>
          </div>
        )
      )}
    </div>
  );
}
