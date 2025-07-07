import React from "react";
import Chart from "react-apexcharts";

const Line_chart = () => {
  const lineOptions = {
    chart: {
      type: "line",
      zoom: { enabled: false },
      fontFamily: "Inter, sans-serif",
    },
    title: {
      text: "Số lượng đơn yêu cầu theo tháng",
      align: "center",
    },
    xaxis: {
      categories: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      title: {
        text: "Tháng",
      },
    },
    yaxis: {
      title: {
        text: "Số lượng đơn",
      },
    },
    stroke: {
      curve: "smooth",
    },
    dataLabels: {
      enabled: true,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} đơn`,
      },
    },
    colors: ["#1e88e5"],
  };

  const lineSeries = [
    {
      name: "Đơn yêu cầu",
      data: [120, 150, 100, 170, 200, 180, 220, 240, 210, 230, 190, 250],
    },
  ];
  return (
    <div className="line-chart-box w-100">
      <Chart
        options={lineOptions}
        series={lineSeries}
        type="line"
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default Line_chart;
