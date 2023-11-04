import React from "react";
import { Outlet } from "react-router";
import Navbar from "../../components/navbar/Navbar";
import './contract.css'
import Footer from "../../components/footer/Footer";

const Contract = () => {
  return (
    <div className="contractPage">
      <Navbar />
      <Outlet />
      
    </div>
  );
};

export default Contract;
