import React from "react";
import Chart from "react-apexcharts";

const Pie_chart = () => {
  const pieOptions = {
    chart: { type: "pie", fontFamily: "Arial, sans-serif" },
    labels: ["Đã xử lý", "Chưa xử lý"],
    colors: ["#4caf50", "#f44336"],
    title: {
      text: "Tình trạng xử lý yêu cầu",
      align: "center",
      style: { fontSize: "18px", fontWeight: "bold" },
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: "14px", fontWeight: "bold" },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} yêu cầu`,
      },
    },
    legend: {
      position: "bottom",
      fontSize: "14px",
    },
  };

  const pieSeries = [50, 20];
  return (
    <div className="pie-chart-box w-100">
      <Chart
        options={pieOptions}
        series={pieSeries}
        type="pie"
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default Pie_chart;
