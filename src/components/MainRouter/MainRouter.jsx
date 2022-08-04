import React from "react";
import { Redirect, Route, Switch } from "react-router";

import routes from "../services/routes";

import Home from "../views/Home";
import Movies from "../views/Movies";
import MovieDetail from "../views/MovieDetail";
import Library from "../views/Library/Library";

export default function MainRouter() {
  return (
    <Switch>
      <Route path={routes.home} exact component={Home} />
      <Route path={routes.library} exact component={Library} />
      <Route path={routes.movies} exact component={Movies} />
      <Route path={routes.movieDetails} component={MovieDetail} />
      <Redirect to={routes.home} />
    </Switch>
  );
}
