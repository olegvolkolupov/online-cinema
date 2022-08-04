import React, { useState } from "react";

import styles from "./Search.module.css";

export default function Search({ onHandleSearch }) {
  let [searchText, setSearchText] = useState("");

  let handleChange = (event) => {
    setSearchText(event.target.value);
  };

  let handleSearch = (event) => {
    event.preventDefault();
    if (searchText) {
      onHandleSearch(searchText);
      setSearchText("");
    }
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSearch}>
      <input
        className={styles.searchInput}
        type="text"
        name="query"
        autoComplete="off"
        placeholder="Search for a movie..."
        value={searchText}
        onChange={handleChange}
      />
      <button className={styles.searchButton} type="submit">
        Search
      </button>
    </form>
  );
}
