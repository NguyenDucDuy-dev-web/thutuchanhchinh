import React from "react";
import { Link } from "react-router-dom";
import Statistical from "../../components/Dashboard/Statistical/Statistical";
import Chart from "../../components/Dashboard/Chart/Chart";
const Dashboard = () => {
  return (
    <>
      {/* Breadcrumb */}
      <section className="breadcrumb-section">
        <div className="breadcrumb-box">
          <h4 className="title">Tổng quan</h4>
          <nav className="breadcrumb-sub-box">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item">Tổng quan</li>
            </ol>
          </nav>
        </div>
      </section>
      <Statistical/>
      <Chart/>
    </>
  );
};

export default Dashboard;
