import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormAddList from "../../components/QuanlyThutuc/ListProcedureAd/FormAddList/FormAddList";
import { apiUrl, token } from "../../../components/common/Http";
import TableProcedures from "../../components/Table/TableProcedures";
import BreadcrumbComponent from "../../../components/common/Breadcrumb/BreadcrumbComponent";
const ListProcedureAdmin = () => {
  const [procedures, setProcedures] = useState([]);
  const [searchKeyword, setSearchKeyWord] = useState("");
  const [loading, setLoading] = useState(true);
  const filteredData = procedures.filter((item) =>
    item.title?.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  const fetchProcedures = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl + "procedure" + "/procedures", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      setProcedures(result.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách thủ tục:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  const [formTemplates, setFormTemplates] = useState([]);

  const fetchTemplates = async () => {
    try {
      const res = await fetch(
        apiUrl + "procedure" + "/form-templates/getformtemplates",
        {
          headers: {
            Authorization: `Bearer ${token()}`,
          },
        }
      );
      const result = await res.json();
      if (result.status) {
        setFormTemplates(result.data);
      } else {
        toast.error("Không tải được danh sách mẫu thủ tục");
      }
    } catch (err) {
      toast.error("Lỗi khi gọi API mẫu thủ tục");
    }
  };
  useEffect(() => {
    fetchTemplates();
  }, []);

  const [procedureProcess, setProcedureProcess] = useState([]);

  const fetchProcedureProcess = async () => {
    try {
      const res = await fetch(
        apiUrl + "procedure" + "/process",
        {
          headers: {
            Authorization: `Bearer ${token()}`,
          },
        }
      );
      const result = await res.json();
      if (result.status) {
        setProcedureProcess(result.data);
      } else {
        toast.error("Không tải được danh sách quy trình xử lý");
      }
    } catch (err) {
      toast.error("Lỗi khi gọi API quy trình xử lý");
    }
  };
  useEffect(() => {
    fetchProcedureProcess();
  }, []);
  return (
    <>
      <section className="user-section py-3 px-3">
        <BreadcrumbComponent />

        <Row className="align-items-stretch">
          {/* Form Thêm người dùng */}
          <Col xs={12} md={4}>
            <FormAddList
              fetchProcedures={fetchProcedures}
              formTemplates={formTemplates}
              procedureProcess = {procedureProcess}
            />
          </Col>

          {/* Danh sách người dùng */}
          <Col xs={12} md={8} className="mt-3 mt-md-0">
            <div className="table-box">
              <div className="table-title">
                <span className="title">Danh sách thủ tục</span>
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
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 mb-0">Đang tải dữ liệu...</p>
                  </div>
                ) : (
                  <TableProcedures
                    data={filteredData}
                    fetchProcedures={fetchProcedures}
                    formTemplates={formTemplates}
                    procedureProcess = {procedureProcess}
                  />
                )}
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default ListProcedureAdmin;
