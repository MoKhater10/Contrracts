import "./logout.css";
import warringIcon from "../../asset/images/warning-icon.webp";
import axios from "axios";
import authHeader from "../../services/auth-header";
import { getApiUrl } from "../../helpers";

const Logout = (props) => {
  const API_URL_LOGOUT = getApiUrl("users/logout/");
  const logoutFunc = async () => {
    await localStorage.removeItem("user");
    await localStorage.removeItem("userRole");
    window.location.href = "/";
    axios
    .get( API_URL_LOGOUT, { headers: authHeader()})
    .then((response) => {

    })
    .catch((error) => {

     
    });
  };

  return (
    <div className="overlay">
      <div className="popup popup-logout">
        <div className="warning-icon">
          <img src={warringIcon} alt="icon" />
        </div>

        <h2>هل انت متأكد</h2>
        <h5>من تسجيل الخروج</h5>

        <div className="actions-btn">
          <button
            className="btn btn-yes"
            onClick={() => {
              logoutFunc();
            }}
          >
            نعم
          </button>
          <button className="btn btn-no" onClick={() => props.setLogout(false)}>
            لا
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
