import React from "react";
import { SpinnerDiamond } from "spinners-react";

export default function Loader() {
  return (
    <SpinnerDiamond
      size={50}
      thickness={156}
      speed={100}
      color="rgba(58, 57, 172, 1)"
      secondaryColor="rgba(0, 0, 0, 0.44)"
    />
  );
}
