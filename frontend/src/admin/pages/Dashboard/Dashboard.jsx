import React from "react";
import { Link } from "react-router-dom";
import Statistical from "../../components/Dashboard/Statistical/Statistical";
import Chart from "../../components/Dashboard/Chart/Chart";
import BreadcrumbComponent from "../../../components/common/Breadcrumb/BreadcrumbComponent";
const Dashboard = () => {
  return (
    <>
      {/* Breadcrumb */}
      <section className="breadcrumb-section">
        <BreadcrumbComponent />
      </section>
      <Statistical />
      <Chart />
    </>
  );
};

export default Dashboard;
