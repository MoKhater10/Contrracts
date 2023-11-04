import React, { useState } from "react";
import "./navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import Logout from "../logout/Logout";
import logo from "../../asset/images/logo.webp";

const Navbar = () => {
  const navigate = useNavigate();
  const [logout, setLogout] = useState(false);
  const userRole = localStorage.getItem("userRole");
  const decodedRole = atob(userRole);
  return (
    <nav className="navbar">
      <div className="nav-head">
        <div
          className="logo"
          onClick={() => {
            if (userRole === "user") {
              navigate("/contract/contract-form");
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/contract/all-contracts");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <img src={logo} alt="Logo" />
        </div>
      </div>
      <div className="ul-div">
        <ul>
          {decodedRole === "user" && (
            <NavLink to="/contract/contract-form">
              <li>إنشاء عقد </li>
            </NavLink>
          )}
          <NavLink to="/contract/all-contracts">
            <li>العقودات</li>
          </NavLink>
        </ul>
      </div>
      <div
        className="logout"
        onClick={() => {
          setLogout(true);
        }}
      >
        <span className="logout-text">تسجيل الخروج</span>
      </div>
      {logout && <Logout setLogout={setLogout} />}
    </nav>
  );
};

export default Navbar;
