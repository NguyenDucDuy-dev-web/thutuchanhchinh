import React from "react";
import { Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import "./Toturial.scss";

const Toturial = () => {
  return (
    <section className="toturial-section">
      <div className="custom-container">
        <div className="toturial">
          <div className="toturial-title">
            <h5 className="fw-bold">Hướng dẫn</h5>
          </div>

          <Row className="align-items-stretch toturial-row">
            {/* 2 Card lớn bên trái */}
            <Col xs={12} md={6} className="mt-3 mt-md-0">
              <motion.div
                className="toturial-left-cards"
                initial={{ opacity: 0, y: 20}}
                whileInView={{ opacity: 1, y: 0}}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="toturial-card toturial-card-main">
                  <div className="toturial-card-overlay">
                    <div className="toturial-card-icon">
                      <i className="fas fa-search"></i>
                    </div>
                    <div className="toturial-card-main-content">
                      <h4 className="toturial-card-main-title">
                        Đăng ký thủ tục xin giấy NVQS
                      </h4>
                      <p className="toturial-card-main-desc">
                        Thực hiện theo các bước để đăng ký giấy nvqs cho học kỳ
                        mới nhanh chóng và hiệu quả.
                      </p>
                    </div>
                  </div>
                  <img
                    src="https://img.baocaovien.vn///MediaUpload/Org/2025/04/05/tuhaovietnam_00205042025.jpg"
                    alt="nvqs"
                    className="toturial-card-image"
                  />
                </div>

                <div className="toturial-card toturial-card-main">
                  <div className="toturial-card-overlay">
                    <div className="toturial-card-icon">
                      <i className="fas fa-graduation-cap"></i>
                    </div>
                    <div className="toturial-card-main-content">
                      <h4 className="toturial-card-main-title">
                        Đăng ký thủ tục xin giấy vay vốn
                      </h4>
                      <p className="toturial-card-main-desc">
                        Thực hiện theo các bước để đăng ký giấy vay vốn cho học
                        kỳ mới nhanh chóng và hiệu quả.
                      </p>
                    </div>
                  </div>
                  <img
                    src="https://img.baocaovien.vn///MediaUpload/Org/2025/04/05/tuhaovietnam_00205042025.jpg"
                    alt="Education Management"
                    className="toturial-card-image"
                  />
                </div>
              </motion.div>
            </Col>

            {/* 3 card nhỏ bên phải */}
            <Col xs={12} md={6} className="mt-md-0">
              <motion.div
                className="toturial-right-cards"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="toturial-card toturial-card-small">
                  <div className="toturial-card-overlay">
                    <div className="toturial-card-icon">
                      <i className="fas-atom"></i>
                    </div>
                    <div className="toturial-card-content">
                      <h6 className="toturial-card-title">Indoor Solution</h6>
                      <p className="toturial-card-desc">
                        Solutions for the retail industry
                      </p>
                    </div>
                  </div>
                  <img
                    src="https://via.placeholder.com/300x200/6f7b8a/white?text=Indoor+Solution"
                    alt="Indoor Solution"
                    className="toturial-card-image"
                  />
                </div>

                <div className="toturial-card toturial-card-small">
                  <div className="toturial-card-overlay">
                    <div className="toturial-card-icon">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="toturial-card-content">
                      <h6 className="toturial-card-title">
                        Media Asset Management
                      </h6>
                      <p className="toturial-card-desc">
                        Builds advanced media asset
                      </p>
                    </div>
                  </div>
                  <img
                    src="https://via.placeholder.com/300x200/8b9dc3/white?text=Media+Asset"
                    alt="Media Asset Management"
                    className="toturial-card-image"
                  />
                </div>

                <div className="toturial-card toturial-card-small">
                  <div className="toturial-card-overlay">
                    <div className="toturial-card-icon">
                      <i className="fas fa-cog"></i>
                    </div>
                    <div className="toturial-card-content">
                      <h6 className="toturial-card-title">System Management</h6>
                      <p className="toturial-card-desc">
                        Manage your system efficiently
                      </p>
                    </div>
                  </div>
                  <img
                    src="https://via.placeholder.com/300x200/f4a261/white?text=System+Management"
                    alt="System Management"
                    className="toturial-card-image"
                  />
                </div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  );
};

export default Toturial;
