import React from "react";
import { Row, Col } from "react-bootstrap";
import './Statistical.scss';
const Statistical = () => {
  const statistical = [
    {
      title: "Số lượng tài khoản",
      content: "1500 tài khoản",
      moreinfo: "Xem thêm",
    },
    {
      title: "Yêu cầu chưa xử lý",
      content: "20 yêu cầu",
      moreinfo: "Xem thêm",
    },
    { title: "Yêu cầu đã xử lý", content: "50 yêu cầu", moreinfo: "Xem thêm" },
    { title: "Tổng số yêu cầu", content: "70 yêu cầu", moreinfo: "Xem thêm" },
  ];
  return (
    <section className="statistical-section py-2">
      <Row className="align-items-stretch">
        {statistical.map((item, index) => (
          <Col
            xs={6}
            md={3}
            className="mt-3 mt-md-0 d-flex"
            key={`${index}-${item.title}`}
          >
            <div className="total-account-box w-100">
              <p className="title">{item.title}</p>
              <span className="content">{item.content}</span>
              <a href="#">{item.moreinfo}</a>
            </div>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default Statistical;
