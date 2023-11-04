import React, { Fragment, useEffect, useRef, useState } from "react";
import "./all-contracts.css";
import { getApiUrl } from "../../helpers";
import axios from "axios";
import authHeader from "../../services/auth-header";
import LoadingButton from "../loading-button/LoadingButton";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import Footer from "../footer/Footer";
import AsyncSelect from "react-select/async";
import { BiSolidTrashAlt } from "react-icons/bi";
import { RiEdit2Fill } from "react-icons/ri";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { AiOutlineDownload } from "react-icons/ai";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const AllContracts = (props) => {
  const navigate = useNavigate();
  const [tooglePagination, setTooglePagination] = useState(true);
  const [AllContracts, setAllContracts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [response, setResponse] = useState();
  const [allContractsUrl, setAllContractsUrl] = useState(
    getApiUrl("users/contracts/")
  );

  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedContractStatus, setSelectedContractStatus] = useState(null);
  const [optionValue, setOptionValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const user = localStorage.getItem("user");
  const userRole = localStorage.getItem("userRole");
  const decodedRole = atob(userRole);
  const [toogle, setToogle] = useState(true);
  const [endToogle, setEndToogle] = useState(true);
  const [contractFile, setContractFile] = useState(null);
  const [messageFile, setMessageFile] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const contractsFileInputRef = useRef(null);
  const messageFileInputRef = useRef(null);
  const receiptFileInputRef = useRef(null);
  const [toogleDelete, setToogleDelete] = useState(false);
  const [deletedId, setDeletedId] = useState();
  const [allCompaniesUrl, setAllCompaniesUrl] = useState(
    getApiUrl("contracts/companies/")
  );
  const [allContractsOptions, setAllContractsOptions] = useState(
    getApiUrl("contracts/names/")
  );
  const [allUsersOptions, setAllUsersOptions] = useState(
    getApiUrl("contracts/users/")
  );
  const [contractStatus, setContractStatus] = useState("");
  const [userName, setUserName] = useState("");

  const getAllContracts = () => {
    const handle401Error = () => {
      navigate("/login");
    };

    setLoadingData(true);
    axios
      .get(allContractsUrl, { headers: authHeader() })
      .then((response) => {
        setLoadingData(false);
        setResponse(response.data);
        setAllContracts(response.data.results);
      })
      .catch((error) => {
        setLoadingData(false);
        if (error.response && error.response.status === 401) {
          handle401Error();
        }
      });
  };

  useEffect(() => {
    if (user) {
      getAllContracts();
    }
  }, []);

  useEffect(() => {
    getAllContracts();
  }, [allContractsUrl]);

  useEffect(() => {
    if (response && response.next === null && response.previous === null) {
      setTooglePagination(false);
    } else {
      setTooglePagination(true);
    }
  }, [response]);

  function calculatePageCount(totalContracts, pageSize) {
    return Math.ceil(totalContracts / pageSize);
  }

  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  const handlePagination = (pageNumber) => {
    setLoadingData(true);
    setActivePage(pageNumber);

    // Use the previous value of allContractsUrl and append the new page parameter
    setAllContractsUrl((prevUrl) => {
      const baseUrl = prevUrl.split("?")[0];
      const queryParams = prevUrl.split("?")[1] || "";

      // Parse the existing query parameters into an object
      const params = new URLSearchParams(queryParams);

      // Update or set the 'page' parameter
      params.set("page", (pageNumber + 1).toString());

      // Combine the base URL and updated query parameters
      const updatedUrl = baseUrl + "?" + params.toString();
      return updatedUrl;
    });

    setLoadingData(false); // You may set this back to false when the data loading is complete
  };

  useEffect(() => {
    if (response) {
      // Calculate the number of pages based on the count of contracts
      const totalPages = calculatePageCount(response.count, pageSize);

      // const totalPages = calculatePageCount(response.count, pageSize);
      setTotalPages(totalPages); // You might need to set this in your state
    }
  }, [response]);

  const handleNext = () => {
    if (response.next) {
      setAllContractsUrl(response.next);
      setLoading(true);
      setActivePage(activePage + 1);
      setLoadingData(true);
    } else {
      // Set to the default URL or update 'page' to 1 if it exists
      setAllContractsUrl((prevUrl) => {
        if (prevUrl.includes("page=")) {
          // Update 'page' to 1
          return prevUrl.replace(/page=\d+/, "page=1");
        } else {
          // Add 'page' with the value 1
          return `${prevUrl}&page=1`;
        }
      });
      // setLoading(true);
      setActivePage(0);
      // setLoadingData(true);
    }
  };

  const handleprev = () => {
    if (response.previous) {
      setAllContractsUrl(response.previous);
      setLoading(true);
      setActivePage(activePage - 1);
      setLoadingData(true);
    }
  };
  const numbersLoop = () => {
    if (response.pages_count) {
      for (let i = 0; i <= response.num_pages - 1; i++) {}
    }
  };
  useEffect(() => {
    if (response) {
      numbersLoop();
    }
  }, [response]);

  const [activePage, setActivePage] = useState(0); // Start with page 1

  const handleFileChange = (e) => {
    const inputElement = e.target;
    const file = inputElement.files[0];

    if (inputElement.id === "contractsFileInput") {
      setContractFile(file);
    } else if (inputElement.id === "messageFileInput") {
      setMessageFile(file);
    } else if (inputElement.id === "receiptFileInput") {
      setReceiptFile(file);
    }
  };

  useEffect(() => {}, [contractFile]);

  useEffect(() => {}, [messageFile]);

  useEffect(() => {}, [receiptFile]);

  const [contractBodies, setContractBodies] = useState(
    Array(AllContracts?.length).fill(false)
  );

  const toggleContractBody = (index) => {
    const updatedContractBodies = [...contractBodies];
    updatedContractBodies[index] = !updatedContractBodies[index];
    setContractBodies(updatedContractBodies);
  };

  const [toogleDropDowns, setToogleDropDowns] = useState({});

  const handleDropDowns = (index) => () => {
    setToogleDropDowns((prevToogleDropDowns) => ({
      ...prevToogleDropDowns,
      [index]: !prevToogleDropDowns[index],
    }));
  };

  const handleDownloadClick = (url) => {
    const downloadFile = async () => {
      try {
        // Fetch the file using the URL
        const response = await fetch(url);

        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Failed to download the file");
        }

        // Get the filename from the URL or response headers
        let filename = "downloaded_file"; // Default filename
        const contentDisposition = response.headers.get("content-disposition");
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
            contentDisposition
          );
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, "");
          }
        }

        // Convert the response to a Blob
        const fileBlob = await response.blob();

        // Create a Blob URL for the file
        const blobUrl = window.URL.createObjectURL(fileBlob);

        // Create an anchor element for the download
        const a = document.createElement("a");
        a.href = blobUrl;

        // Set the download attribute with the extracted filename
        a.download = filename;

        a.style.display = "none";

        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    };

    downloadFile();
  };

  const deleteContract = (contractId) => {
    const contractIdUrl = getApiUrl(`users/contracts/${contractId}`);
    setLoadingBtn(true);
    axios
      .delete(contractIdUrl, { headers: authHeader() })
      .then((response) => {
        setToogleDelete(false);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "تم حذف العقد بنجاح",
          showConfirmButton: false,
          timer: 1500,
        });
        if (AllContracts.length === 1) {
          handleprev();
        } else {
          getAllContracts();
        }
        setLoadingBtn(false);
      })
      .catch((error) => {
        setLoadingBtn(false);
      });
  };

  function extractDate(dateString) {
    const dateTime = new Date(dateString);
    const dateOnly = dateTime.toISOString().split("T")[0];
    return dateOnly;
  }

  const handlesendStatus = (statusId) => {
    const contractStatusUrl = getApiUrl(
      `users/contracts/${statusId}/status/chamber/`
    );
    if (contractStatus) {
      setLoading(true);
      axios
        .post(
          contractStatusUrl,
          {
            status:
              contractStatus === "يحتاج توثيق الغرفة التجارية"
                ? "true"
                : "false",
          },
          { headers: authHeader() }
        )
        .then((response) => {
          setToogleDelete(false);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "تم الارسال",
            showConfirmButton: false,
            timer: 1500,
          });
          getAllContracts();
          setLoadingBtn(false);
        })
        .catch((error) => {
          setLoadingBtn(false);
        });
    } else {
      setLoading(false);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "يجب الاختيار اولا",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleUplodFiles = (uploadId, buttonId, index) => {
    const contractUploadUrl = getApiUrl(`users/contracts/${uploadId}/upload/`);

    if (
      (!contractFile || !messageFile || !receiptFile) &&
      decodedRole === "user"
    ) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "يجب ارسال الثلاث ملفات",
        showConfirmButton: false,
        timer: 1500,
      });
      const updatedContractStates = [...contractStates];
      updatedContractStates[index] = false;
      setContractStates(updatedContractStates);
      setLoadingBtn(false);
      return;
    } else if (!contractFile && decodedRole === "accountant") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "يجب ارسال الملف",
        showConfirmButton: false,
        timer: 1500,
      });
      const updatedContractStates = [...contractStates];
      updatedContractStates[index] = false;
      setContractStates(updatedContractStates);
      setLoadingBtn(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", contractFile);

    if (decodedRole === "user") {
      formData.append("message", messageFile);
      formData.append("receipt", receiptFile);
    }

    axios
      .post(contractUploadUrl, formData, {
        headers: {
          ...authHeader(),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setToogleDelete(false);
        const updatedContractStates = [...contractStates];
        updatedContractStates[index] = false;
        setContractStates(updatedContractStates);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "تم الارسال",
          showConfirmButton: false,
          timer: 1500,
        });
        getAllContracts();
        setContractFile(null);
        setReceiptFile(null);
        setMessageFile(null);
        document.getElementById(buttonId).disabled = false;
        setLoadingBtn(false);
      })
      .catch((error) => {
        const updatedContractStates = [...contractStates];
        updatedContractStates[index] = false;
        setContractStates(updatedContractStates);
        setLoadingBtn(false);
      });
  };

  const loadCompaniesNames = (inputValue, callback) => {
    axios
      .get(allCompaniesUrl, {
        headers: authHeader(),
        params: {
          search: inputValue,
        },
      })
      .then((response) => {
        const filteredOptions = response.data.map((item, index) => ({
          value: item,
          label: item,
          index: index,
        }));
        callback(filteredOptions);
      })
      .catch((error) => {
        callback([]);
      });
  };

  function updateCompanyQueryParam(url, newCompanyIndex) {
    const urlObject = new URL(url);
    const params = new URLSearchParams(urlObject.search);

    // Remove the 'page' query parameter if it exists
    params.delete("page");

    // Set the 'contract__company__name' parameter with the new value
    params.set("contract__company__name", newCompanyIndex);

    // Convert the URLSearchParams back to a string and update the URL
    urlObject.search = params.toString();

    return urlObject.toString();
  }

  const handleChangeName = (selectedOption) => {
    setSelectedName(selectedOption);
    const selectedOptionIndex = selectedOption.value;

    // Update the URL, removing 'page' and adding 'contract__company__name'
    let updatedUrl = updateCompanyQueryParam(
      allContractsUrl,
      selectedOptionIndex
    );

    // Check if 'page' parameter exists and set it to 1
    if (updatedUrl.includes("page=")) {
      updatedUrl = updatedUrl.replace(/page=\d+/, "page=1");
      setActivePage(0);
    } else {
      // If 'page' parameter doesn't exist, add it with the value 1
      updatedUrl = updateQueryParam(updatedUrl, "page", "1");
      setActivePage(0);
    }

    setAllContractsUrl(updatedUrl);
  };

  const loadContractsNames = (inputValue, callback) => {
    axios
      .get(allContractsOptions, {
        headers: authHeader(),
        params: {
          search: inputValue,
        },
      })
      .then((response) => {
        const filteredOptions = response.data.map((item, index) => ({
          value: item,
          label: item,
          index: index,
        }));
        callback(filteredOptions);
      })
      .catch((error) => {
        callback([]);
      });
  };

  function updateStatusQueryParam(url, newContractName) {
    const urlObject = new URL(url);
    const params = new URLSearchParams(urlObject.search);

    // Remove the 'page' query parameter if it exists
    params.delete("page");

    // Set the 'contract__name' parameter with the new value
    params.set("contract__name", newContractName);

    // Convert the URLSearchParams back to a string and update the URL
    urlObject.search = params.toString();

    return urlObject.toString();
  }

  const handleChangeContractType = (selectedOption) => {
    setSelectedContract(selectedOption);
    const selectedOptionName = selectedOption.value;

    // Update the URL, removing 'page' and adding 'contract__name'
    let updatedUrl = updateStatusQueryParam(
      allContractsUrl,
      selectedOptionName
    );

    // Check if 'page' parameter exists and set it to 1
    if (updatedUrl.includes("page=")) {
      updatedUrl = updatedUrl.replace(/page=\d+/, "page=1");
      setActivePage(0);
    } else {
      // If 'page' parameter doesn't exist, add it with the value 1
      updatedUrl = updateQueryParam(updatedUrl, "page", "1");
      setActivePage(0);
    }

    setAllContractsUrl(updatedUrl);
  };

  const ContractTypes = [
    { label: "عقد غير موثق", value: "عقد غير موثق", index: 0 },
    {
      label: "(انتظار)موثق من الشركة",
      value: "(انتظار)موثق من الشركة",
      index: 1,
    },
    {
      label: " موثق من الشركة (يحتاج توثيق الغرفة) ",
      value: " موثق من الشركة (يحتاج توثيق الغرفة)",
      index: 2,
    },
    {
      label: "موثق من الشركة (لا يحتاج توثيق الغرفة)",
      value: "موثق من الشركة (لا يحتاج توثيق الغرفة)",
      index: 3,
    },
    {
      label: " موثق من الغرفة التجارية",
      value: "موثق من الغرفة التجارية",
      index: 4,
    },
    {
      label: "موثق من العميل",
      value: "موثق من العميل",
      index: 5,
    },
  ];

  const loadContracts = (inputValue, callback) => {
    const filteredOptions = ContractTypes.filter((option) =>
      option.label.includes(inputValue)
    );
    callback(filteredOptions);
  };

  function updateContractNameQueryParam(url, newStatus) {
    const urlObject = new URL(url);
    const params = new URLSearchParams(urlObject.search);

    // Remove the 'page' query parameter if it exists
    params.delete("page");

    // Set the 'status' parameter with the new value
    params.set("status", newStatus);

    // Convert the URLSearchParams back to a string and update the URL
    urlObject.search = params.toString();

    return urlObject.toString();
  }

  const handleChangeContractStatus = (selectedOption) => {
    setSelectedContractStatus(selectedOption);

    // Update the URL, removing 'page' and adding 'status'
    const selectedOptionStatus = selectedOption.index;
    let updatedUrl = updateContractNameQueryParam(
      allContractsUrl,
      selectedOptionStatus
    );

    // Check if 'page' parameter exists and set it to 1
    if (updatedUrl.includes("page=")) {
      updatedUrl = updatedUrl.replace(/page=\d+/, "page=1");
      setActivePage(0);
    } else {
      // If 'page' parameter doesn't exist, add it with the value 1
      updatedUrl = updateQueryParam(updatedUrl, "page", "1");
      setActivePage(0);
    }

    setAllContractsUrl(updatedUrl);
  };

  function updateQueryParam(url, paramName, paramValue) {
    const urlObject = new URL(url);
    const params = new URLSearchParams(urlObject.search);

    // Remove the 'page' query parameter if it exists
    params.delete("page");

    // Set the specified parameter with the new value
    params.set(paramName, paramValue);

    // Convert the URLSearchParams back to a string and update the URL
    urlObject.search = params.toString();

    return urlObject.toString();
  }

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    setToogle(false);

    // Update the URL, removing 'page' and adding 'start_date'
    const updatedUrl = updateQueryParam(
      allContractsUrl,
      "created",
      newStartDate
    );
    setAllContractsUrl(updatedUrl);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    setEndToogle(false);

    // Update the URL, removing 'page' and adding 'end_date'
    const updatedUrl = updateQueryParam(
      allContractsUrl,
      "modified",
      newEndDate
    );
    setAllContractsUrl(updatedUrl);
    setActivePage(0);
  };

  const loadUserssNames = (inputValue, callback) => {
    axios
      .get(allUsersOptions, {
        headers: authHeader(),
        params: {
          search: inputValue,
        },
      })
      .then((response) => {
        const filteredOptions = response.data.map((item, index) => ({
          value: item,
          label: item,
          index: index,
        }));
        callback(filteredOptions);
      })
      .catch((error) => {
        callback([]);
      });
  };

  function updateQueryParam(url, paramName, paramValue) {
    const urlObject = new URL(url);
    const params = new URLSearchParams(urlObject.search);

    // Remove the 'page' parameter if it exists
    if (params.has("page")) {
      params.delete("page");
    }

    // Set the specified parameter with the new value
    params.set(paramName, paramValue);

    // Add a new 'page' parameter with the value 1
    params.set("page", "1");

    // Convert the URLSearchParams back to a string and update the URL
    urlObject.search = params.toString();

    return urlObject.toString();
  }

  const handleChangeUserName = (selectedOption) => {
    setUserName(selectedOption);
    const selectedOptionName = selectedOption.value;

    // Update the 'user__name' query parameter with the selectedOptionName and remove 'page'
    const updatedUrl = updateQueryParam(
      allContractsUrl,
      "user__name",
      selectedOptionName
    );
    setAllContractsUrl(updatedUrl);
    setActivePage(0);
  };

  const [contractStates, setContractStates] = useState([]);

  // Initialize the contractStates with the same length as AllContracts
  useEffect(() => {
    setContractStates(new Array(AllContracts.length).fill(false));
  }, [AllContracts]);

  const handleRadioClick = (value) => {
    // This function is called when the div is clicked, and it receives the selected value as an argument.
    // You can perform any custom actions here, if needed.
    setContractStatus(value); // Set the selected value in your state, for example
  };

  return (
    <Fragment>
      <div className="contract-filter container">
        <div className="filter-title">تصنيف من خلال</div>
        <div>
          <div className="contract-filter-divs">
            <div>
              <AsyncSelect
                placeholder="اختر اسم الشركة "
                cacheOptions
                defaultOptions
                loadOptions={loadCompaniesNames}
                onChange={handleChangeName}
                value={selectedName}
                noOptionsMessage={() => "لا خيارات"}
                className="custom-async-select"
              />
            </div>
            <div>
              <AsyncSelect
                placeholder="اختر اسم العقد "
                cacheOptions
                defaultOptions
                loadOptions={loadContractsNames}
                onChange={handleChangeContractType}
                value={selectedContract}
                noOptionsMessage={() => "لا خيارات"}
              />
            </div>
            <div>
              <AsyncSelect
                placeholder="الحالة "
                cacheOptions
                defaultOptions
                loadOptions={loadContracts}
                onChange={handleChangeContractStatus}
                value={selectedContractStatus}
                noOptionsMessage={() => "لا خيارات"}
              />
            </div>
          </div>
          <div
            className={
              decodedRole !== "user"
                ? "contract-filter-second-divs-3fr"
                : "contract-filter-second-divs"
            }
          >
            {decodedRole !== "user" && (
              <div>
                <AsyncSelect
                  placeholder="اختر اسم الموظف "
                  cacheOptions
                  defaultOptions
                  loadOptions={loadUserssNames}
                  onChange={handleChangeUserName}
                  value={userName}
                  noOptionsMessage={() => "لا خيارات"}
                />
              </div>
            )}
            <div>
              <input
                type="date"
                className="input-date"
                style={{ width: decodedRole !== "user" ? "100%" : "" }}
                placeholder="تاريخ الانشاء"
                onChange={(e) => {
                  handleStartDateChange(e);
                  setToogle(false);
                }}
                id={toogle ? "customDateInput" : ""}
              />
            </div>
            <div>
              <input
                type="date"
                className="input-date"
                style={{ width: decodedRole !== "user" ? "100%" : "" }}
                placeholder="تاريخ الانشاء"
                onChange={(e) => {
                  handleEndDateChange(e);
                  setEndToogle(false);
                }}
                id={endToogle ? "customDateEnd" : ""}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          AllContracts.length === 0
            ? "no-contracts container"
            : loadingData
            ? "no-contracts container"
            : "allContracts-parent container"
        }
      >
        {loadingData ? (
          <LoadingSpinner />
        ) : AllContracts.length === 0 ? (
          <div>
            <p>لا يوجد عقود</p>
          </div>
        ) : (
          AllContracts.map((contract, index) => (
            <div key={index}>
              <div className={contractBodies[index] ? "" : "contract-parent"}>
                <div
                  className={
                    contractBodies[index]
                      ? "title-box contract-title"
                      : " contract-title"
                  }
                >
                  <div className="contract-name">{contract.contract.name}</div>
                  <div className="contract-btns">
                    {decodedRole === "user" && contract.status === 0 && (
                      <button
                        className="btn-delete"
                        onClick={() => {
                          setDeletedId(contract.id);
                          setToogleDelete(true);
                        }}
                      >
                        <BiSolidTrashAlt />
                        حذف
                      </button>
                    )}
                    {((decodedRole === "accountant" &&
                      (contract.status === 0 || contract.status === 2)) ||
                      (decodedRole === "user" &&
                        (contract.status === 4))) && (
                      <button
                        className="btn-edit"
                        onClick={() => {
                          props.setFileUrl(contract.file);
                          props.setFileId(contract.id);
                          navigate(`/edit-contract/${contract.id}`);
                        }}
                      >
                        <RiEdit2Fill />
                        تعديل
                      </button>
                    )}
                  </div>

                  <div
                    className="arrow-up"
                    onClick={() => {
                      toggleContractBody(index);
                    }}
                  >
                    {!contractBodies[index] ? <SlArrowDown /> : <SlArrowUp />}
                  </div>
                </div>
                {toogleDelete && (
                  <div className="overlay overlay-delete">
                    <div className="popup popup-logout">
                      <h2>هل انت متأكد</h2>
                      <h5>من حذف هذا العقد</h5>

                      <div className="actions-btn">
                        <button
                          className="btn btn-yes"
                          onClick={() => {
                            deleteContract(deletedId);
                          }}
                        >
                          {loadingBtn ? <LoadingButton /> : "نعم"}
                        </button>
                        <button
                          className="btn btn-no"
                          onClick={() => setToogleDelete(false)}
                        >
                          لا
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {contractBodies[index] && (
                  <div className="contract-body">
                    <div className="contract-type-list">
                      <div
                        className="contract-type"
                        style={{
                          color:
                            contract.status === 0
                              ? "red"
                              : contract.status === 1
                              ? "rgba(250, 180, 0, 1)"
                              : contract.status === 2
                              ? "rgba(4, 0, 193, 1)"
                              : contract.status === 3
                              ? "rgba(75, 104, 52, 1)"
                              : contract.status === 4
                              ? "rgba(0, 0, 0, 1)"
                              : contract.status === 5
                              ? "rgba(68, 154, 0, 1)"
                              : "",
                        }}
                      >
                        {contract.status === 0
                          ? "عقد غير موثق"
                          : contract.status === 1
                          ? "موثق من الشركة ( انتظار )"
                          : contract.status === 2
                          ? "موثق من الشركة (يحتاج توثيق الغرقة )"
                          : contract.status === 3
                          ? "موثق من الشركة ( لا يحتاج توثيق الغرفة)"
                          : contract.status === 4
                          ? "موثق من الغرفة التجارية"
                          : contract.status === 5
                          ? "موثق من العميل"
                          : ""}
                      </div>
                      {decodedRole !== "manager" &&
                        decodedRole !== "accountant" &&
                        contract.status === 1 && (
                          <div className="drop-down-type-parent">
                            <button
                              className="btn-contract-type"
                              onClick={handleDropDowns(index)}
                            >
                              {" "}
                              اختر الحالة{" "}
                              {toogleDropDowns[index] ? (
                                <SlArrowUp />
                              ) : (
                                <SlArrowDown />
                              )}
                            </button>
                            {toogleDropDowns[index] && (
                              <div className="dropDown-body">
                                <form>
                                  <div
                                    className="form-sec"
                                    onClick={() =>
                                      handleRadioClick(
                                        "يحتاج توثيق الغرفة التجارية"
                                      )
                                    }
                                  >
                                    <label className="custom-radio">
                                      <input
                                        type="radio"
                                        name="type"
                                        value={contractStatus}
                                        onChange={(e) =>
                                          setContractStatus(e.target.value)
                                        }
                                      />
                                      يحتاج توثيق الغرفة التجارية
                                    </label>
                                  </div>
                                  <div
                                    className="form-sec"
                                    onClick={() => handleRadioClick("لا يحتاج")}
                                  >
                                    <label className="custom-radio">
                                      <input
                                        type="radio"
                                        name="type"
                                        value={contractStatus}
                                        onChange={(e) =>
                                          setContractStatus(e.target.value)
                                        }
                                      />
                                      لا يحتاج
                                    </label>
                                  </div>
                                </form>
                                <div className="drop-down-btns">
                                  <button
                                    className="btn-submit"
                                    onClick={() => {
                                      handlesendStatus(AllContracts[index].id);
                                    }}
                                  >
                                    {loadingBtn ? <LoadingButton /> : "اختيار"}
                                  </button>
                                  <button
                                    className="btn-cancle"
                                    onClick={handleDropDowns(index)}
                                  >
                                    الغاء
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                    <div className="contract-company">
                      شركة {contract.contract.company}
                    </div>
                    <div className="contract-employee">
                      الموظف : {contract.user.name}
                    </div>
                    <div className="contracts-upload">
                      {(decodedRole === "user" ||
                        decodedRole === "accountant") &&
                        contract.status !== 1 &&
                        contract.status !== 5 &&
                        !(decodedRole === "user" && contract.status === 2) &&
                        ((decodedRole === "user" && contract.status === 4) ||
                          (decodedRole === "user" && contract.status === 3) ||
                          (decodedRole === "accountant" &&
                            (contract.status === 0 ||
                              contract.status === 2))) && (
                          <div className="contract-upload">
                            <div
                              className="contract-upload-title"
                              // onClick={handleUploadClick(contractsFileInputRef)}
                            >
                              <input
                                type="file"
                                ref={contractsFileInputRef}
                                // style={{ display: "none" }}
                                id="contractsFileInput"
                                onChange={(e) =>
                                  handleFileChange(e, contract.id)
                                }
                              />
                              أرفع ملف العقد
                            </div>
                          </div>
                        )}
                      {decodedRole === "user" &&
                        (contract.status === 3 || contract.status === 4) && (
                          <div className="message-upload">
                            <div
                              className="contract-upload-title"
                              // onClick={handleUploadClick(messageFileInputRef)}
                            >
                              <input
                                type="file"
                                ref={messageFileInputRef}
                                // style={{ display: "none" }}
                                id="messageFileInput"
                                onChange={(e) =>
                                  handleFileChange(e, contract.id)
                                }
                              />
                              أرفع صورة الرسالة
                            </div>
                          </div>
                        )}
                      {decodedRole === "user" &&
                        (contract.status === 3 || contract.status === 4) && (
                          <div className="receipt-upload">
                            <div
                              className="contract-upload-title"
                              // onClick={handleUploadClick(receiptFileInputRef)}
                            >
                              <input
                                type="file"
                                ref={receiptFileInputRef}
                                // style={{ display: "none" }}
                                id="receiptFileInput"
                                onChange={(e) =>
                                  handleFileChange(e, contract.id)
                                }
                              />
                              أرفع صورة الرسيت
                            </div>
                          </div>
                        )}
                    </div>
                    {(decodedRole === "user" || decodedRole === "accountant") &&
                      contract.status !== 1 &&
                      contract.status !== 5 &&
                      !(decodedRole === "user" && contract.status === 2) &&
                      ((decodedRole === "user" && contract.status === 4) ||
                        (decodedRole === "user" && contract.status === 3) ||
                        (decodedRole === "accountant" &&
                          (contract.status === 0 ||
                            contract.status === 2))) && (
                        // Add other conditions here
                        <div className="btn-send-files-parent">
                          <button
                            id={`uploadButton_${contract.id}`} // Use a unique ID for each button
                            className="btn-send-files"
                            onClick={() => {
                              // Set loadingBtn for the clicked contract to true
                              const updatedContractStates = [...contractStates];
                              updatedContractStates[index] = true;
                              setContractStates(updatedContractStates);
                              handleUplodFiles(AllContracts[index].id, index);
                            }}
                          >
                            {contractStates[index] ? (
                              <LoadingButton />
                            ) : (
                              "ارسال الملفات"
                            )}
                          </button>
                        </div>
                      )}
                    <div className="contract-dates">
                      <div className="contract-start-date">
                        تاريخ الانشاء :
                        <span className="span-date">
                          {extractDate(contract.created)}
                        </span>
                      </div>
                      <div className="contract-end-date">
                        تاريخ اخر حالة :{" "}
                        <span className="span-date">
                          {" "}
                          {extractDate(contract.modified)}
                        </span>
                      </div>
                      {(decodedRole === "manager" ||
                        decodedRole === "accountant") &&
                      contract.status === 5 ? (
                        ""
                      ) : (
                        <button
                          className="btn-download"
                          onClick={() => handleDownloadClick(contract.file)}
                        >
                          {" "}
                          <AiOutlineDownload className="download-icon" />
                          تحميل العقد
                        </button>
                      )}
                    </div>

                    {(decodedRole === "manager" ||
                      decodedRole === "accountant") &&
                      contract.status === 5 && (
                        <div className="btns-downloads">
                          <button
                            className="btn-download"
                            onClick={() => handleDownloadClick(contract.file)}
                          >
                            {" "}
                            <AiOutlineDownload className="download-icon" />
                            تحميل العقد
                          </button>
                          <button
                            className="btn-download"
                            onClick={() =>
                              handleDownloadClick(contract.message)
                            }
                          >
                            {" "}
                            <AiOutlineDownload className="download-icon" />
                            تحميل الرسالة
                          </button>
                          <button
                            className="btn-download"
                            onClick={() =>
                              handleDownloadClick(contract.receipt)
                            }
                          >
                            {" "}
                            <AiOutlineDownload className="download-icon" />
                            تحميل الرسيت
                          </button>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {tooglePagination && (
        <div className="pagination-btns container">
          <button onClick={handleprev}>السابق</button>
          <div className="pagination-numbers">
            {totalPages
              ? Array.from({ length: totalPages }, (_, index) => (
                  <span
                    key={index}
                    onClick={() => handlePagination(index)}
                    className={index === activePage ? "active" : "no-active"}
                  >
                    {index + 1}
                  </span>
                ))
              : null}
          </div>
          <button onClick={handleNext}>التالى</button>
        </div>
      )}

      <div className="contract-footer">
        <Footer />
      </div>
    </Fragment>
  );
};

export default AllContracts;
