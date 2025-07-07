import React from "react";
import "./Footer.scss"
const Footer = () => {
  return (
    <footer>
      <div className="custom-container">
        <div className="footer-main">
          <p>© 2025 CTUT - Cổng thông tin thủ tục hành chính.</p>
          <div className="social-icons">
            <i className="bi bi-youtube"></i>
            <i className="bi bi-whatsapp"></i>
            <i className="bi bi-facebook"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
