import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./footer.css";
import azzrkLogo from "../../asset/images/azzrk.webp";
import logo from "../../asset/images/footer-logo.webp";

const Footer = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const decodedRole = atob(userRole);
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer-logo">
            <img
              src={logo}
              alt=""
              className="logo-azzrk"
              onClick={() => {
                if(userRole === "user"){
                  navigate("/contract/contract-form");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }else{
                  navigate("/contract/all-contracts");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            />
          </div>
          <div className="footer-info">
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
