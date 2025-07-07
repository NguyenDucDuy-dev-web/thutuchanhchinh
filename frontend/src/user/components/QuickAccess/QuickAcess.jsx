import React from "react";
import { Row, Col } from "react-bootstrap";
import "./QuickAcess.scss"
const QuickAcess = () => {
  return (
    <section className="quick-access">
      <div className="custom-container">
        <div className="your-option p-4 rounded-4">
          <h5 className="fw-bold"><i className="bi bi-lightning-fill"></i> Truy cập nhanh</h5>
          <Row className="access-row align-items-stretch">
            <Col xs={6} md={3} className="mt-3 mt-md-0">
              <div className="quick-access-box">
                <div className="icon-wrapper">
                  <i className="bi bi-clipboard2-fill"></i>
                </div>
                <div className="text-box">
                  <span className="text-link">Xin bảng điểm</span>
                </div>
              </div>
            </Col>

            <Col xs={6} md={3} className="mt-3 mt-md-0">
              <div className="quick-access-box">
                <div className="icon-wrapper">
                  <i className="bi bi-clipboard2-fill"></i>
                </div>
                <div className="text-box">
                  <span className="text-link">Xin xác nhận sinh viên</span>
                </div>
              </div>
            </Col>

            <Col xs={6} md={3} className="mt-3 mt-md-0">
              <div className="quick-access-box">
                <div className="icon-wrapper">
                  <i className="bi bi-clipboard2-fill"></i>
                </div>
                <div className="text-box">
                  <span className="text-link">Tra cứu điểm</span>
                </div>
              </div>
            </Col>

            <Col xs={6} md={3} className="mt-3 mt-md-0">
              <div className="quick-access-box">
                <div className="icon-wrapper">
                  <i className="bi bi-clipboard2-fill"></i>
                </div>
                <div className="text-box">
                  <span className="text-link">Xử lý học vụ</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  );
};

export default QuickAcess;
