import React from "react";
import { Row, Col } from "react-bootstrap";
import "./Chart.scss";
import Line_chart from "./Line_chart";
import Pie_chart from "./Pie_chart";

const Chart = () => {
  return (
    <section className="chart-section py-2">
      <Row className="align-items-stretch">
        <Col xs={12} md={8}>
          <Line_chart />
        </Col>

        <Col xs={12} md={4}>
          <Pie_chart />
        </Col>
      </Row>
    </section>
  );
};

export default Chart;
