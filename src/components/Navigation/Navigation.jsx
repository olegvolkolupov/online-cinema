import React from "react";
import { NavLink } from "react-router-dom";

import routes from "../services/routes"

import styles from "./Navigation.module.css";

export default function Navigation() {
  return (
    <div className={styles.container}>
      <h2 className={styles.logo}>OnlineCinema</h2>
      <div className={styles.links}>
        <NavLink
          to={routes.home}
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
          exact
        >
          Home
        </NavLink>
        <NavLink
          to={routes.library}
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          My library
        </NavLink>
      </div>
    </div>
  );
}
