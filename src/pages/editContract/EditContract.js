import React, { Fragment, useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { getApiUrl } from "../../helpers";
import { useParams } from "react-router";

const EditContract = (props) => {
  const [pdfUrl, setPdfUrl] = useState(props.fileUrl);
  const [pdfId, setPdfId] = useState(props.fileId);
  const { contractId } = useParams();
  const [apiUploadUrl, setApiUploadUrl] = useState(
    getApiUrl(`users/contracts/${contractId}/upload/`)
  );
  let iframeData;
  const userToken = localStorage.getItem("user");
  const userRole = localStorage.getItem("userRole");

  const sendDataToSvelte = (url, id, apiUploadUrl) => {
    const iframe = document.querySelector("iframe"); // Select the iframe element

    // Create an object with userToken and contractUrl
    iframeData = {
      userToken: userToken,
      contractUrl: url,
      userRole: userRole,
      contractId: id,
      apiUploadUrl: apiUploadUrl,
      btnTitle: "تقديم",
      btnTitleLoading: "جاري التقديم"
    };

    // Send the data to the Svelte iframe
    iframe.addEventListener("load", () => {
      iframe.contentWindow.postMessage(
        iframeData,
        "https://edit.contrracts.com"
      );
    });
  };

  useEffect(() => {
    sendDataToSvelte(pdfUrl, pdfId, apiUploadUrl);
  }, []);

  return (
    <Fragment>
      <Navbar />
      <div style={{ height: "85vh", margin: "2rem 0" }}>
        <iframe
          src="https://edit.contrracts.com/"
          width="800"
          height="100%"
        ></iframe>
      </div>
      <Footer />
    </Fragment>
  );
};

export default EditContract;
