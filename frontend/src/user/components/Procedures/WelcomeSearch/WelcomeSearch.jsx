import React from "react";
import "./WelcomeSearch.scss";
const WelcomeSearch = () => {
  return (
    <>
      <section className="welcome-search-section">
        <div className="custom-container">
          <div className="welcome-search-box">
            <div className="welcome-search-title">
              <h5 className="main-welcome">
                Bạn muốn thực hiện thủ tục gì hôm nay?
              </h5>
              <span className="sub-welcome">
                Hỗ trợ sinh viên thực hiện thủ tục hành chính nhanh chóng, tiện
                lợi, hiệu quả.
              </span>
            </div>
            <div className="welcome-search-body">
              <div className="search-input-wrapper">
                <span className="search-icon">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Tìm kiếm thủ tục ..."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WelcomeSearch;
