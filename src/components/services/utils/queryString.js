import queryString from "query-string";

export const getParsed = (str) => {
  return queryString.parse(str);
};

export const getStringified = (obj) => {
  return queryString.stringify(obj);
};
