import React from "react";
import { Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import "./YourOption.scss";

const YourOption = () => {
  return (
    <section className="your-option-section py-4">
      <div className="custom-container">
        <div className="your-option">
          <Row className="align-items-stretch g-0">
            <Col xs={12} lg={5} className="squarebox">
              <div className="decoration-squares">
                <motion.div
                  className="square-gray"
                  initial={{ opacity: 0, y: 20, rotate: 45 }}
                  whileInView={{ opacity: 0.2, y: 0, rotate: 45 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true, amount: 0.3 }}
                ></motion.div>
                <motion.div
                  className="square-gray1"
                  initial={{ opacity: 0, y: 20 , rotate: 45}}
                  whileInView={{ opacity: 0.2, y: 0, rotate: 45 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true, amount: 0.3 }}
                ></motion.div>
                <div className="square-blue">
                  <h5>Dành cho bạn</h5>
                </div>
                <motion.div
                  className="square-blue1"
                  initial={{ opacity: 0, y: 20, rotate: 45 }}
                  whileInView={{ opacity: 0.08, y: 0, rotate: 45 }}
                  transition={{ duration: 0.8 , delay: 0.3}}
                  viewport={{ once: true, amount: 0.3 }}
                ></motion.div>
                <motion.div
                  className="square-blue2"
                  initial={{ opacity: 0, y: 20, rotate: 45 }}
                  whileInView={{ opacity: 0.1, y: 0, rotate: 45 }}
                  transition={{ duration: 0.8 , delay: 0.4}}
                  viewport={{ once: true, amount: 0.3 }}
                ></motion.div>
                <motion.div
                  className="square-blue3"
                  initial={{ opacity: 0, y: 20, rotate: 45 }}
                  whileInView={{ opacity: 0.2, y: 0, rotate: 45 }}
                  transition={{ duration: 0.8 , delay: 0.5}}
                  viewport={{ once: true, amount: 0.3 }}
                ></motion.div>
              </div>

              <div className="centered-title">Dành cho bạn</div>
            </Col>

            <Col xs={12} lg={7} className="stats-box">
              <div className="stats-wrapper text-center">
                <h4 className="stats-title">Thống kê các thủ tục</h4>
                <Row className="justify-content-center mt-4">
                  {[
                    { label: "Hoàn thành", value: 7 },
                    { label: "Đang xử lý", value: 2 },
                    { label: "Bị từ chối", value: 1 },
                    { label: "Tổng số", value: 10 },
                  ].map((item, index) => (
                    <Col key={index} xs={6} sm={3} className="mb-4">
                      <div className="stat-item">
                        <div className="stat-value">{item.value}</div>
                        <div className="stat-label">{item.label}</div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  );
};

export default YourOption;
