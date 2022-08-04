import React, { useEffect } from "react";

import movieService from "./services/API/movieService";
import localStorageItems from "./services/utils/localStorageItems";

import Layout from "./Layout";
import MainRouter from "./MainRouter";

export default function App() {
  useEffect(async () => {
    document.title = "Online cinema";
    // secure_base_url = string -> "http://image.tmdb.org/t/p/"
    // poster_sizes = array of strings: w92, w154, w185, w342, w500. w780, original
    const images = await movieService.getAPIConfiguration();
    localStorage.setItem("API_Config", JSON.stringify(images));

    if (!localStorage.getItem(localStorageItems.WATCHED)) {
      setItemToLocalStorage(localStorageItems.WATCHED);
    }

    if (!localStorage.getItem(localStorageItems.QUEUE)) {
      setItemToLocalStorage(localStorageItems.QUEUE);
    }
  }, []);

  let setItemToLocalStorage = (itemName) => {
    let item = [];
    localStorage.setItem(itemName, JSON.stringify(item));
  };

  return (
    <Layout>
      <MainRouter />
    </Layout>
  );
}
