import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import movieService from "../../services/API/movieService";
import { useFetching } from "../../services/hooks/useFetching";
import { usePagination } from "../../services/hooks/usePagination";

import Search from "../../Search";
import Pagination from "../../UI/Pagination";
import Loader from "../../UI/Loader";

import styles from "./Home.module.css";

export default function Home(props) {
  let [urlToImage, setUrlToImage] = useState("http://image.tmdb.org/t/p/w185");
  let [movies, setMovies] = useState([]);
  let [page, setPage] = useState(1);
  let [totalPages, setTotalPages] = useState(0);
  const [fetchTrendingMovies, isMoviesLoading, movieError] = useFetching(
    async (page) => {
      const trendingMoviesData = await movieService.getTrending(page);
      setTotalPages(trendingMoviesData.total_pages);
      setMovies(trendingMoviesData.results);
    }
  );
  let pagesArray = usePagination(totalPages);

  useEffect(() => {
    // secure_base_url = string -> "http://image.tmdb.org/t/p/"
    // poster_sizes = array of strings: w92, w154, w185, w342, w500. w780, original
    // const images = await movieService.getAPIConfiguration();
    // images
    //   ? setUrlToImage(images.secure_base_url + images.poster_sizes[2])
    //   : setUrlToImage("http://image.tmdb.org/t/p/w185");
    const APIConfig = localStorage.getItem("API_Config");
    if (APIConfig) {
      const imagesConfig = JSON.parse(APIConfig);
      setUrlToImage(
        imagesConfig.secure_base_url + imagesConfig.poster_sizes[2]
      );
    }
    fetchTrendingMovies(page);
  }, []);

  let handleSearch = (searchWord) => {
    props.history.push({
      pathname: "/movies",
      search: `query=${searchWord}`,
    });
  };

  const changePage = (page) => {
    setPage(page);
    fetchTrendingMovies(page);
  };

  let handlePageClick = (event) => {
    changePage(event.selected + 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <Search onHandleSearch={handleSearch} />
      </div>
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
          <ul className={styles.movies}>
            {movies.map(({ id, original_title, release_date, poster_path }) => (
              <li key={id} className={styles.listItem}>
                <Link
                  to={{
                    pathname: `${props.match.url}movies/${id}`,
                    state: { cameFrom: props.location },
                  }}
                  className={styles.link}
                >
                  <img
                    className={styles.poster}
                    src={urlToImage + poster_path}
                    alt={original_title + " poster"}
                  />
                  <h5 className={styles.title}>{original_title}</h5>
                  <p className={styles.date}>{release_date}</p>
                </Link>
              </li>
            ))}
          </ul>
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
