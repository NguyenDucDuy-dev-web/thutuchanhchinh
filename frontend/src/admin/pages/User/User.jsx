import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormUser from "../../components/QuanlyUser/FormUser/FormUser";
import TableUser from "../../components/Table/TableUser";
import { apiUrl, token } from "../../../components/common/Http";
import "./User.scss";

const User = () => {
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyWord] = useState("");

  const filteredData = users.filter((item) =>
    item.name?.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  const fetchUsers = async () => {
    const res = await fetch(apiUrl + "user", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
    });

    const result = await res.json();
    setUsers(result.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <>
      <section className="user-section py-3 px-3">
        {/* Breadcrumb */}
        <div className="breadcrumb-box mb-3">
          <h4 className="title">Người dùng</h4>
          <nav className="breadcrumb-sub-box">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="#">Trang chủ</Link>
              </li>
              <li className="breadcrumb-item">Quản lý người dùng</li>
              <li className="breadcrumb-item active" aria-current="page">
                Người dùng
              </li>
            </ol>
          </nav>
        </div>

        <Row className="align-items-stretch">
          {/* Form Thêm người dùng */}
          <Col xs={12} md={4}>
            <FormUser onUserAdded={fetchUsers} />
          </Col>

          {/* Danh sách người dùng */}
          <Col xs={12} md={8} className="mt-3 mt-md-0">
            <div className="table-box">
              <div className="table-title">
                <span className="title">Danh sách người dùng</span>
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
                <TableUser data={filteredData} onUserUpdated={fetchUsers} />
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default User;
