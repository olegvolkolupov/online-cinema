import { useState } from "react";

export const useFetching = (callback) => {
  let [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState("");

  const fetching = async (...args) => {
    try {
      setError("");
      setIsLoading(true);
      await callback(...args);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return [fetching, isLoading, error];
};
