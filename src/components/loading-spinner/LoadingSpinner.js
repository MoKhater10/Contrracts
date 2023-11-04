import React from "react";
import { BeatLoader } from "react-spinners";
import "./loading-spinner.css";


const LoadingSpinner = () => {
  return (
    <div className="preloadContainer">
      <div className="preload">
        <BeatLoader
          height="80"
          width="80"
          radius="9"
          color="rgba(92, 75, 153, 1)"
          aria-label="three-dots-loading"
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;