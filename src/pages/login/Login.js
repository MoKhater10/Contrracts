import React from "react";
import "./login.css";
import { useState } from "react";
import { useNavigate } from "react-router";
import authService from "../../services/auth-services";
import LoadingButton from "../../components/loading-button/LoadingButton";
import logo from "../../asset/images/logo.webp";
import loginBack from "../../asset/images/login-back.webp";
import vector1 from "../../asset/images/vector1.webp";
import vector2 from "../../asset/images/vector2.webp";

const Login = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userPass, setUserPass] = useState("");
  const [userEr, setUserEr] = useState("");
  const [passEr, setPassEr] = useState("");
  const [notExist, setNotExist] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [userToogelhint, setUserToogelhint] = useState(false);
  const [checkUser, setcheckUser] = useState("");
  const [focusUser, setfocusUser] = useState(false);
  const [passToogelhint, setpassToogelhint] = useState(false);
  const [checkpass, setcheckpass] = useState("");
  const [focuspass, setfocuspass] = useState(false);

  const validateUser = (value) => {
    if (value.length !== 0) {
      setUserName(value);
      setUserEr("");
    } else {
      setUserEr("من فضلك ادخل اسم المستخدم ");
    }
  };
  const validatPass = (value) => {
    if (value.length !== 0) {
      setUserPass(value);
      setPassEr("");
    } else {
      setPassEr("من فضلك ادخل كلمه السر ");
    }
  };

  const login = async (e) => {
    e.preventDefault();
    if (!userName) {
      setUserEr("من فضلك ادخل اسم المستخدم ");
    }
    if (!userPass) {
      setPassEr("من فضلك ادخل كلمه السر ");
    }
    if (userName && userPass) {
      // send token use axios

      try {
        setLoadingLogin(true);
        await authService.userLogin(userName, userPass).then(
          () => {
            navigate(`/contract/all-contracts`);
          },
          (error) => {
            setLoadingLogin(false);
            if (error.response.status === 401) {
              setNotExist(true);
            }
          }
        );
      } catch (err) {}
    }
  };
  return (
    <div className="login">
      <div className=" login-parent   d-flex justify-content-center align-items-center">
        <img src={vector1} alt="" className="vector1" />
        <img src={vector2} alt="" className="vector2" />
        <div className="login-logo">
          <img src={logo} alt="Logo" className="login-logo-img" />
        </div>
        <div className="form d-flex justify-content-center align-items-center flex-column gap-3">
          {notExist && (
            <div className="alert alert-danger hintMsg" role="alert">
              اسم المستخدم او كلمة السر غير صحيحة
            </div>
          )}
          <form onSubmit={login}>
            <div className="form-sec">
              <label className="label">الاسم</label>
              <input
                className={userEr ? "error" : ""}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                type="text"
                name="name"
                onFocus={(e) => {
                  validateUser(e.target.value);
                }}
              />
            </div>
            <label className="hint">{userEr ? userEr : ""}</label>
            <div className="form-sec">
              <label className="label">كلمة السر</label>
              <input
                className={passEr ? "error" : ""}
                onChange={(e) => {
                  setUserPass(e.target.value);
                }}
                type="password"
                name="pass"
                onFocus={(e) => {
                  validatPass(e.target.value);
                }}
              />
            </div>
            <label className="hint">{passEr ? passEr : ""}</label>

            <button type="submit">
              {loadingLogin ? <LoadingButton /> : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </div>
      <div className="contract-img">
        <img src={loginBack} alt="" className="con-img" />
      </div>
    </div>
  );
};

export default Login;
