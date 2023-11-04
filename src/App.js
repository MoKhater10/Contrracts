import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import Login from "./pages/login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Contract from "./pages/contract/Contract";
import "react-dropdown/style.css";
import "./asset/css/App.css";
import AllContracts from "./components/all-contracts/AllContracts";
import ContractForm from "./components/contract-form/ContractForm";
import { useEffect, useState } from "react";
import EditContract from "./pages/editContract/EditContract";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fileUrl, setFileUrl] = useState();
  const [fileId, setFileId] = useState();
  const userRole = localStorage.getItem("userRole");
  const decodedRole = atob(userRole);
  const checkUserToken = () => {
    const userToken = localStorage.getItem("user");
    if (!userToken || userToken === "undefined") {
      setIsLoggedIn(false);
      if (
        location.pathname.includes("/contract/contract-form") ||
        location.pathname.includes("/contract") ||
        location.pathname.includes("/contract/all-contracts")
      ) {
        navigate("/");
      }
    } else {
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    checkUserToken();
  }, [localStorage.getItem("user")]);

  const loggedInGuard = (element) => {
    // If user is logged in, redirect to home page
    if (isLoggedIn) {
      return <Navigate to="/contract/all-contracts" replace={true} />;
    }
    // If not logged in, allow access to the provided element
    return element;
  };

  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<Login />} />
        <Route element={loggedInGuard(<Login />)} path="/" />
        <Route element={<Contract />} path="/contract">

          {decodedRole === 'user' && <Route element={<ContractForm />} path="contract-form" />}
          <Route element={<AllContracts setFileUrl={setFileUrl} setFileId={setFileId} />} path="all-contracts" />
        </Route>
        <Route element={<EditContract fileUrl={fileUrl} fileId={fileId} />} path="/edit-contract/:contractId" />
      </Routes>
    </div>
  );
}

export default App;
