import React, { useState } from "react";
import "./Footer.scss";
import logo from "../../../assets/images/logo.jpg";
const Footer = () => {
  const [expandedSections, setExpandedSections] = useState({
    quickaccess: false,
    resources: false,
    legal: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <footer className="footer">
      <div className="custom-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">
                <img src={logo} alt="CTUT Logo" className="logo-image" />
              </div>
              <span className="brand-name">Thủ tục hành chính</span>
            </div>
            <p className="brand-description">
              “ Hỗ trợ thức hiện các thủ tục hành chính mốt cách nhanh chóng, dẽ
              dàng và tiện lợi cho sinh viên.”{" "}
            </p>
            <p className="copyright">© CTUT 2025</p>
          </div>

          <div className="footer-column">
            <h3
              className="column-title"
              onClick={() => toggleSection("quickaccess")}
            >
              Liên kết nhanh
              <i
                className={`bi bi-chevron-${
                  expandedSections.quickaccess ? "up" : "down"
                } mobile-toggle`}
              ></i>
            </h3>
            <ul
              className={`footer-links ${
                expandedSections.quickaccess ? "expanded" : ""
              }`}
            >
              <li>
                <a href="#">Đại học Kỹ thuật - Công nghệ Cần Thơ</a>
              </li>
              <li>
                <a href="#">Phòng đào tạo</a>
              </li>
              <li>
                <a href="#">Phòng CTCT QLSV</a>
              </li>
              <li>
                <a href="#">Khoa CNTT</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3
              className="column-title"
              onClick={() => toggleSection("resources")}
            >
              Danh mục
              <i
                className={`bi bi-chevron-${
                  expandedSections.resources ? "up" : "down"
                } mobile-toggle`}
              ></i>
            </h3>
            <ul
              className={`footer-links ${
                expandedSections.resources ? "expanded" : ""
              }`}
            >
              <li>
                <a href="#">Trang chủ</a>
              </li>
              <li>
                <a href="#">Thủ tục</a>
              </li>
              <li>
                <a href="#">Tin tức</a>
              </li>
              <li>
                <a href="#">Hỏi đáp</a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="footer-column">
            <h3 className="column-title" onClick={() => toggleSection("legal")}>
              Legal
              <i
                className={`bi bi-chevron-${
                  expandedSections.legal ? "up" : "down"
                } mobile-toggle`}
              ></i>
            </h3>
            <ul
              className={`footer-links ${
                expandedSections.legal ? "expanded" : ""
              }`}
            >
              <li>
                <a href="#">Privacy policy</a>
              </li>
              <li>
                <a href="#">Terms of use</a>
              </li>
            </ul>
          </div>

          <div className="footer-bottom">
            <div className="social-section">
              <div className="social-icons">
                <a href="#" className="social-icon facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="social-icon twitter">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="social-icon instagram">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="social-icon linkedin">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>

            <div className="language-section">
              <div className="language-selector">
                <select>
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
