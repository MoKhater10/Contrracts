import React, { Fragment, useEffect, useRef, useState } from "react";
import "./contract-form.css";
import AsyncSelect from "react-select/async";
import { getApiUrl } from "../../helpers";
import axios from "axios";
import authHeader from "../../services/auth-header";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router";

const ContractForm = () => {
  const [loading, setLoading] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);
  const [dropDownUrl, setDropDown] = useState(getApiUrl("contracts/"));
  const [options, setOptions] = useState("");
  const [defaultOption, setDefaultOption] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [formFields, setFormFields] = useState("");
  const [optionValue, setOptionValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState();
  const [pdfUrl, setPdfUrl] = useState();

  const [apiUploadUrl, setApiUploadUrl] = useState(
    getApiUrl("users/contracts/")
  );
  const [contractID, setContractID] = useState();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const userToken = localStorage.getItem("user");
  let iframeData;

  const checkUserToken = () => {
    const userToken = localStorage.getItem("user");
    if (!userToken || userToken === "undefined") {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    checkUserToken();
  }, [localStorage.getItem("user")]);

  const getAllOptions = () => {
    const handle401Error = () => {
      navigate("/login");
    };
    axios
      .get(dropDownUrl, {
        headers: authHeader(),
      })
      .then((response) => {
        setData(response.data);
        setPdfUrl(response.data[0].file);
        setContractID(response.data[0].id);
        const optionsFromAPI = response.data.map((item) => ({
          value: item.name,
          label: item.name,
        }));

        setOptions(optionsFromAPI);

        if (optionsFromAPI.length > 0) {
          const firstOption = {
            value: optionsFromAPI[0].value,
            label: optionsFromAPI[0].label,
          };
          setDefaultOption(firstOption);
          setSelectedOption(firstOption);
          setOptionValue(firstOption.value);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          handle401Error();
        }
      });
  };

  useEffect(() => {
    getAllOptions();
    // Set loading to false after a 2-second delay
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Clean up the timer to prevent any potential memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  const sendDataToSvelte = (url, contractID, apiUploadUrl) => {
    const iframe = document.querySelector("iframe"); // Select the iframe element

    if (iframe) {
      // Create an object with userToken and contractUrl
      iframeData = {
        userToken: userToken,
        contractUrl: url,
        contractId: contractID,
        apiUploadUrl: apiUploadUrl,
        btnTitle: "إنشاء",
        btnTitleLoading: "جاري الإنشاء"
      };

      // Send the data to the Svelte iframe
      iframe.addEventListener("load", () => {
        iframe.contentWindow.postMessage(
          iframeData,
          "https://edit.contrracts.com"
        );
      });
    }
  };

  useEffect(() => {
    // Call sendDataToSvelte only when pdfUrl is defined
    sendDataToSvelte(pdfUrl, contractID, apiUploadUrl);
  }, [pdfUrl, loading]);

  const [iframeKey, setIframeKey] = useState(0);
  const refreshIframe = () => {
    // Incrementing the key value will create a new instance of the iframe element
    setIframeKey((prevKey) => prevKey + 1);
  };

  const handleSelectChange = (selectedOption) => {
    refreshIframe();
    setLoading(true);

    if (selectedOption) {
      const selectedValue = selectedOption.value;
      const selectedObject = data.find((item) => item.name === selectedValue);

      if (selectedObject) {
        const selectedUrl = selectedObject.file;
        setContractID(selectedObject.id);
        sendDataToSvelte(selectedUrl, contractID);
        setLoadingForm(true);
        setPdfUrl(selectedUrl);
      }
      setOptionValue(selectedValue);
      setSelectedOption(selectedOption);
      setLoadingForm(true);
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  };

  useEffect(() => {
    setLoadingForm(true);
  }, []);

  //   if (user && optionValue) {
  //     axios
  //       .post(
  //         formUrl,
  //         {
  //           blueprint_name: optionValue,
  //         },
  //         {
  //           headers: authHeader(),
  //         }
  //       )
  //       .then((response) => {
  //         setLoadingForm(false);
  //         setFormFields(response.data.fields);
  //       });
  //   }
  // }, [optionValue, formUrl]);

  useEffect(() => {
    inputRefs.current = formFields && formFields.map(() => React.createRef());
  }, [formFields]);

  const loadOptions = (inputValue, callback) => {
    axios
      .get(dropDownUrl, {
        headers: authHeader(),
        params: {
          search: inputValue,
        },
      })
      .then((response) => {
        const filteredOptions = response.data
          .filter((item) =>
            item.name.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((item) => ({
            value: item.name,
            label: item.name,
          }));
        callback(filteredOptions);
      })
      .catch((error) => {
        callback([]);
      });
  };

  return (
    <Fragment>
      <div>
        <div className="contract-type container">
          <div className="dropDown-parent">
            <div className="dropDown-title">اختر نوع العقد</div>
            <div>
              <AsyncSelect
                placeholder="اختر العقد"
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                onChange={handleSelectChange}
                value={selectedOption}
                noOptionsMessage={() => "لا خيارات"}
              />
            </div>
          </div>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <iframe
            key={iframeKey}
            src="https://edit.contrracts.com/"
            id="iframe-allcontracts"
            style={{ width: "70vw", height: "1000px" }}
          ></iframe>
        )}
        <Footer />
      </div>
    </Fragment>
  );
};

export default ContractForm;
