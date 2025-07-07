import React from "react";
import Header from "../components/common/Header/Header";
import Footer from "../components/common/Footer/Footer";
import "./UserLayout.scss";
import { Outlet } from "react-router-dom";
const UserLayout = () => {
  return (
    <>
      <div className="user-layout">
        {/* 2 hình vuông trang trí */}
        <div className="decorative-squares">
          <div className="square-large"></div>
          <div className="square-small"></div>
        </div>

        <Header />

        <main>
          <Outlet />
        </main>

        {/* <Footer /> */}
      </div>
    </>
  );
};

export default UserLayout;
