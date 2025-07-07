import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import './Welcome.scss';
const Welcome = () => {
  return (
    <section className="greeting-search py-4">
      <div className="custom-container">
        <div className="welcome-total">
          <Row className="align-items-center w-100">
            <Col
              xs={12}
              md={5}
              className="text-center text-md-start main-welcome"
            >
              <h4 className="mb-1 fw-bold">
                Xin chào, <span className="welcome">A Wy Mập!</span>
              </h4>
              <p className="sub-welcome">
                Chào mừng bạn đến với hệ thống hỗ trợ thủ tục hành chính. <br />
                Hãy chọn thủ tục bạn cần thực hiện hoặc tra cứu thông tin hữu
                ích.
              </p>
            </Col>

            <Col
              xs={12}
              md={7}
              className="text-center text-md-start main-status"
            >
              <Row>
                <Col xs={6} md={3} className="mt-3 mt-md-0">
                  <div className="status-box success h-100">
                    {/* <div className="icon-box">
                        <i className="bi bi-check2"></i>
                      </div> */}
                    <div className="text-box-success">
                      <div className="number">5</div>
                      <div className="label">Hoàn thành</div>
                    </div>
                  </div>
                </Col>

                <Col xs={6} md={3} className="mt-3 mt-md-0">
                  <div className="status-box pending h-100">
                    {/* <div className="icon-box">
                        <i className="bi bi-arrow-clockwise"></i>
                      </div> */}
                    <div className="text-box-pending">
                      <div className="number">2</div>
                      <div className="label">Đang chờ</div>
                    </div>
                  </div>
                </Col>

                <Col xs={6} md={3} className="mt-3 mt-md-0">
                  <div className="status-box reject h-100">
                    {/* <div className="icon-box">
                        <i className="bi bi-x-lg"></i>
                      </div> */}
                    <div className="text-box-reject">
                      <div className="number">1</div>
                      <div className="label">Từ chối</div>
                    </div>
                  </div>
                </Col>

                <Col xs={6} md={3} className="mt-3 mt-md-0">
                  <div className="status-box total h-100">
                    {/* <div className="icon-box">
                        <i className="bi bi-list"></i>
                      </div> */}
                    <div className="text-box-total">
                      <div className="number">8</div>
                      <div className="label">Tổng số</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
