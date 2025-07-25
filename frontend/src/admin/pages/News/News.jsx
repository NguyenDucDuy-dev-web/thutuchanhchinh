import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./News.scss";
import FormAddNews from "../../components/QuanlyTintuc/FormAddNews/FormAddNews";
import TableNews from "../../components/Table/TableNews";
import { apiUrl, token } from "../../../components/common/Http";
import BreadcrumbComponent from "../../../components/common/Breadcrumb/BreadcrumbComponent";
const News = () => {
  const [news, setNews] = useState([]);
  const [searchKeyword, setSearchKeyWord] = useState("");

  const filteredData = news.filter((item) =>
    item.title?.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  const fetchNews = async () => {
    const res = await fetch(apiUrl + "news", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
    });

    const result = await res.json();
    setNews(result.data);
  };

  useEffect(() => {
    fetchNews();
  }, []);
  return (
    <>
      <section className="user-section py-3 px-3">
        <BreadcrumbComponent />

        <Row className="align-items-stretch">
          {/* Form Thêm tin tức */}
          <Col xs={12} md={4}>
            <FormAddNews onFetchNews={fetchNews} />
          </Col>

          {/* Danh sách tin tức */}
          <Col xs={12} md={8} className="mt-3 mt-md-0">
            <div className="table-box">
              <div className="table-title">
                <span className="title">Danh sách tin tức</span>
              </div>
              <div className="table-search">
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Tìm kiếm"
                  onChange={(e) => setSearchKeyWord(e.target.value)}
                />
              </div>
              <div className="table-content">
                <TableNews data={filteredData} onFetchNews={fetchNews} />
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default News;
