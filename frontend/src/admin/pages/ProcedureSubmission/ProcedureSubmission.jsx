import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiUrl, token } from "../../../components/common/Http";
import TableProcedureSubmission from "../../components/Table/TableProcedureSubmission";
import BreadcrumbComponent from "../../../components/common/Breadcrumb/BreadcrumbComponent";

const ProcedureSubmission = () => {
  const [procedureSubmission, setProcedureSubmission] = useState([]);
  //   const [showPreview, setShowPreview] = useState(false);
  //   const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyWord] = useState("");
  const filteredData = procedureSubmission.filter(
    (item) =>
      item.procedure?.title
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      item.user?.name?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const fetchProcedureSubmission = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl + "procedure" + "/submission", {
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
      setProcedureSubmission(result.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu cầu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcedureSubmission();
  }, []);

  return (
    <>
      <section className="user-section py-3 px-3">
       <BreadcrumbComponent/>

        <Row className="align-items-stretch">
          <Col xs={12} md={12} className="mt-3 mt-md-0">
            <div className="table-box">
              <div className="table-title">
                <span className="title">Danh sách mẫu thủ tục</span>
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
                  //   <TableSampleProcedure
                  //     data={filteredData}
                  //     onPreview={handlePreview}
                  //     onUpdated={fetchSampleProcedure}
                  //   />

                  <TableProcedureSubmission
                    data={filteredData}
                    //     onPreview={handlePreview}
                    //     onUpdated={fetchSampleProcedure}
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

export default ProcedureSubmission;
