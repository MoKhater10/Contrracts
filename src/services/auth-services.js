import axios from "axios";
import { getApiUrl } from "../helpers";
import authHeader from "./auth-header";

const API_URL_LOGIN = getApiUrl("users/login/");

// login for user
const userLogin = (username, password) => {
  return axios
    .post(API_URL_LOGIN, {
      username,
      password,
    })
    .then((response) => {
      if (response.data.access) {
        const encodedUserRole = btoa(response.data.user_role);
        localStorage.setItem("user", JSON.stringify(response.data.access));
        localStorage.setItem("userRole", encodedUserRole);
      }
      return response.data;
    });
};

// get all Contracts
const AllContracts = (API_URL_CONTRACTS) => {
  return axios
    .get(API_URL_CONTRACTS, {
      headers: authHeader(),
    })
    .then((response) => {
    });
};


const authService = {
  userLogin,
  AllContracts,
};

export default authService;
