import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import "./ListProcedure.scss";
import anhphobien from "../../../../assets/images/anhphobien1.png";
import { Link } from "react-router-dom";
import { apiUrl, token } from "../../../../components/common/Http";
const ListProcedure = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Sắp xếp theo:");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const options = [
    "Title A to Z",
    "Title Z to A",
    "Highest Price",
    "Lowest Price",
  ];

  useEffect(() => {
    if (isFilterModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup khi component unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFilterModalOpen]);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const [procedures, setProcedures] = useState([]);

  const fetchProcedures = async () => {
    try {
      const res = await fetch(apiUrl + "procedure" + "/procedures", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });

      if (!res.ok) throw new Error("Server error");

      const result = await res.json();
      setProcedures(result.data);
    } catch (err) {
      console.error("Lỗi khi tải thủ tục:", err);
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  // const procedureList = [
  //   {
  //     id: 1,
  //     title: "Đăng ký xin giấy tạm hoãn nghĩa vụ quân sự",
  //     short_desc:
  //       "Sinh viên đang theo học chính quy tại trường đại học được xem xét tạm hoãn nghĩa vụ quân sự theo quy định.",
  //     room: "Phòng đào tạo",
  //     hinhthuc: "Trực tuyến",
  //     image: anhphobien,
  //   },
  //   {
  //     id: 2,
  //     title: "Đăng ký xin giấy tạm hoãn nghĩa vụ quân sự",
  //     short_desc:
  //       "Sinh viên đang theo học chính quy tại trường đại học được xem xét tạm hoãn nghĩa vụ quân sự theo quy định.",
  //     room: "Phòng đào tạo",
  //     hinhthuc: "Trực tuyến",
  //     image: "https://via.placeholder.com/300x200",
  //   },
  //   {
  //     id: 3,
  //     title: "Đăng ký xin giấy tạm hoãn nghĩa vụ quân sự",
  //     short_desc:
  //       "Sinh viên đang theo học chính quy tại trường đại học được xem xét tạm hoãn nghĩa vụ quân sự theo quy định.",
  //     room: "Phòng đào tạo",
  //     hinhthuc: "Trực tuyến",
  //     image: "https://via.placeholder.com/300x200",
  //   },
  //   {
  //     id: 4,
  //     title: "Đăng ký xin giấy tạm hoãn nghĩa vụ quân sự",
  //     short_desc:
  //       "Sinh viên đang theo học chính quy tại trường đại học được xem xét tạm hoãn nghĩa vụ quân sự theo quy định.",
  //     room: "Phòng đào tạo",
  //     hinhthuc: "Trực tuyến",
  //     image: "https://via.placeholder.com/300x200",
  //   },
  //   {
  //     id: 5,
  //     title: "Đăng ký xin giấy tạm hoãn nghĩa vụ quân sự",
  //     short_desc:
  //       "Sinh viên đang theo học chính quy tại trường đại học được xem xét tạm hoãn nghĩa vụ quân sự theo quy định.",
  //     room: "Phòng đào tạo",
  //     hinhthuc: "Trực tuyến",
  //     image: "https://via.placeholder.com/300x200",
  //   },
  //   {
  //     id: 6,
  //     title: "Đăng ký xin giấy tạm hoãn nghĩa vụ quân sự",
  //     short_desc:
  //       "Sinh viên đang theo học chính quy tại trường đại học được xem xét tạm hoãn nghĩa vụ quân sự theo quy định.",
  //     room: "Phòng đào tạo",
  //     hinhthuc: "Trực tuyến",
  //     image: "https://via.placeholder.com/300x200",
  //   },
  //   {
  //     id: 7,
  //     title: "Đăng ký xin giấy tạm hoãn nghĩa vụ quân sự",
  //     short_desc:
  //       "Sinh viên đang theo học chính quy tại trường đại học được xem xét tạm hoãn nghĩa vụ quân sự theo quy định.",
  //     room: "Phòng đào tạo",
  //     hinhthuc: "Trực tuyến",
  //     image: "https://via.placeholder.com/300x200",
  //   },
  //   {
  //     id: 8,
  //     title: "Đăng ký xin giấy tạm hoãn nghĩa vụ quân sự",
  //     short_desc:
  //       "Sinh viên đang theo học chính quy tại trường đại học được xem xét tạm hoãn nghĩa vụ quân sự theo quy định.",
  //     room: "Phòng đào tạo",
  //     hinhthuc: "Trực tuyến",
  //     image: "https://via.placeholder.com/300x200",
  //   },
  //   {
  //     id: 9,
  //     title: "Đăng ký xin giấy tạm hoãn nghĩa vụ quân sự",
  //     short_desc:
  //       "Sinh viên đang theo học chính quy tại trường đại học được xem xét tạm hoãn nghĩa vụ quân sự theo quy định.",
  //     room: "Phòng đào tạo",
  //     hinhthuc: "Trực tuyến",
  //     image: "https://via.placeholder.com/300x200",
  //   },
  // ];

  const sectionTitles = ["Bộ lọc thủ tục", "Bộ lọc phòng", "Bộ lọc hình thức"];
  const sidebarLists = [
    [
      "Tất cả thủ tục",
      "Giấy NVQS",
      "Giấy vay vốn",
      "Bảng điểm",
      "Giấy xin cấp học bổng",
      "Giấy giới thiệu thực tập",
    ],
    [
      "Tất cả phòng",
      "Phòng đào tạo",
      "Phòng tài chính",
      "Phòng CTCT QLSV",
      "Khoa CNTT",
      "Khoa ...",
    ],
    ["Tất cả hình thức", "Trực tiếp", "Trực tuyến"],
  ];

  return (
    <section className="listprocedure-section">
      <div className="custom-container">
        <div className="listprocedure-box">
          <div className="listprocedure-title">
            <div className="left-title">
              <h5 className="numberprocedure">
                Tất cả {procedures.length} thủ tục
              </h5>
            </div>

            <div className="right-title">
              <button
                className="filter-button mobile-filter"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <i className="bi bi-funnel"></i>
                Bộ lọc
              </button>
              <div className="navigate-box">
                <button className="process-box active">Tiến trình</button>
                <button className="history-box">Lịch sử</button>
              </div>

              <div className="sort-dropdown">
                <div
                  className="dropdown-toggle"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {selected}
                </div>
                {isOpen && (
                  <ul className="dropdown-menu">
                    {options.map((opt) => (
                      <li key={opt} onClick={() => handleSelect(opt)}>
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="listprocedure-body">
            <div className="content-grid">
              {/* Sidebar */}
              <div className="sidebar-column">
                <div className="filter-sidebar-container">
                  {sectionTitles.map((title, index) => (
                    <div
                      key={index}
                      className={`filter-sidebar filter-${index + 1}`}
                    >
                      <h6 className="filter-title">{title}</h6>
                      <ul className="category-list">
                        {sidebarLists[index].map((item, i) => (
                          <li key={i} className={i === 0 ? "active" : ""}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cards */}
              <div className="cards-column">
                <div className="cards-grid">
                  {procedures.map((item, index) => (
                    <div
                      key={item.id}
                      className={`card-wrapper card-${index + 1}`}
                    >
                      <div className="card-item">
                        <div className="card-image">
                          <img
                            src={
                              "http://localhost:8000/storage/procedures/thumb/" +
                              item.image.split("/").pop()
                            }
                            alt={item.title}
                          />
                        </div>
                        <div className="card-title">{item.title}</div>
                        <div className="card-short-desc">{item.short_desc}</div>
                        <div className="card-room">
                          <div className="room">
                            <span>{item.room}</span>
                          </div>
                          <div className="hinhthuc">
                            <span>{item.format === 1 ? "Trực tuyến" : "Trực tiếp"}</span>
                          </div>
                        </div>
                        <Link
                          to={`/procedure/${item.id}`}
                          className="card-button"
                        >
                          XEM CHI TIẾT
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFilterModalOpen && (
        <>
          <div
            className="filter-modal-overlay"
            onClick={() => setIsFilterModalOpen(false)}
          ></div>
          <div className="filter-modal">
            <div className="filter-modal-header">
              <h5>Bộ lọc</h5>
              <button
                className="close-button"
                onClick={() => setIsFilterModalOpen(false)}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            <div className="filter-modal-content">
              {sectionTitles.map((title, index) => (
                <div key={index} className="filter-section">
                  <h6 className="filter-title">{title}</h6>
                  <ul className="category-list">
                    {sidebarLists[index].map((item, i) => (
                      <li key={i} className={i === 0 ? "active" : ""}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="filter-modal-footer">
              <button className="reset-button">Đặt lại</button>
              <button
                className="apply-button"
                onClick={() => setIsFilterModalOpen(false)}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ListProcedure;
