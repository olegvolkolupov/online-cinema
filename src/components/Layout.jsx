import React from "react";
import Navigation from "./Navigation";

const styles = {
  maxWidth: 1170,
  marginLeft: "auto",
  marginRight: "auto",
  paddingRight: 12,
  paddingLeft: 12,
};

const Layout = ({ children }) => (
  <div style={styles}>
    <header>
      <Navigation />
    </header>
    <main>{children}</main>
  </div>
);

export default Layout;
