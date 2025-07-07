import React from "react";
import { Row, Col } from "react-bootstrap";
import "./Toturial.scss";

const Toturial = () => {
  return (
    <section className="toturial-section py-4">
      <div className="custom-container">
        <div className="toturial p-4 rounded-4">
          <h5 className="fw-bold"><i className="bi bi-question-circle-fill"></i> Hướng dẫn</h5>

          <Row className="align-items-stretch toturial-row">
            <Col xs={12} md={6} className="mt-3 mt-md-0">
              <div className="toturial-card">
                <img
                  src="https://img.baocaovien.vn///MediaUpload/Org/2025/04/05/tuhaovietnam_00205042025.jpg"
                  alt="Logo"
                  className="toturial-card-image"
                />
                <div className="toturial-card-body">
                  <div className="toturial-card-meta">
                    <span className="toturial-card-tag">Học vụ</span>
                    <span className="toturial-card-time">2 giờ trước</span>
                  </div>
                  <h6 className="toturial-card-title">
                    Hướng dẫn đăng ký học phần
                  </h6>
                  <p className="toturial-card-desc">
                    Thực hiện theo các bước để đăng ký học phần cho học kỳ mới
                    nhanh chóng và hiệu quả.
                  </p>
                  <a href="#" className="toturial-card-link">
                    Xem hướng dẫn
                  </a>
                </div>
              </div>
            </Col>

            <Col xs={12} md={6} className="mt-3 mt-md-0">
              <div className="toturial-card">
                <img
                  src="https://img.baocaovien.vn///MediaUpload/Org/2025/04/05/tuhaovietnam_00205042025.jpg"
                  alt="Logo"
                  className="toturial-card-image"
                />
                <div className="toturial-card-body">
                  <div className="toturial-card-meta">
                    <span className="toturial-card-tag">Thủ tục</span>
                    <span className="toturial-card-time">2 giờ trước</span>
                  </div>
                  <h6 className="toturial-card-title">
                    Hướng dẫn làm thủ tục xin giấy tờ
                  </h6>
                  <p className="toturial-card-desc">
                    Quy trình để xin cấp các loại giấy tờ, chứng nhận tại phòng
                    đào tạo.
                  </p>
                  <a href="#" className="toturial-card-link">
                    Xem hướng dẫn
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  );
};

export default Toturial;
