import React from "react";
import { RotatingLines } from "react-loader-spinner";

const LoadingButton = () => {
  return (
    <div>
      <RotatingLines
        strokeColor="black"
        strokeWidth="5"
        animationDuration="0.75"
        width="31"
        visible={true}
      />
    </div>
  );
};

export default LoadingButton;