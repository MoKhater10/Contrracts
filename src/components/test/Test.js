import React, { Fragment, useEffect, useState } from "react";

const Test = () => {
  const user = localStorage.getItem("user");
  const data = 'https://eu2.contabostorage.com/fe879ba30cfe45cdb8804b2950e9808c:contracts/test/file.pdf' 
  // Inside your React component
  const sendDataToSvelte = () => {
    const iframe = document.querySelector("iframe"); // Select the iframe element

    // Send the data to the Svelte iframe
    iframe.addEventListener('load', () => {
      iframe.contentWindow.postMessage(user, 'https://edit.contrracts.com');
      iframe.contentWindow.postMessage(data, 'https://edit.contrracts.com');
    });
  };
  useEffect(() => {
    sendDataToSvelte();
  }, []);
  return (
    <Fragment>
      <iframe
        src="https://edit.contrracts.com/"
        width="800"
        height="600"
        id="iframe"
      ></iframe>
    </Fragment>
  );
};

export default Test;
