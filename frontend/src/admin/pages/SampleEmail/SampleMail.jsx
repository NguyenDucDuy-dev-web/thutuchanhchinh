import React, { useState, useEffect } from "react";
import BreadcrumbComponent from "../../../components/common/Breadcrumb/BreadcrumbComponent";
import { Row, Col } from "react-bootstrap";
import FormAddMail from "../../components/QuanlyMail/FormAddMail/FormAddMail";
import { apiUrl, token } from "../../../components/common/Http";
import TableMail from "../../components/Table/TableMail";
const SendEmail = () => {
  const [mails, setMails] = useState([]);
  const [searchKeyword, setSearchKeyWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);

  const filteredData = mails.filter((item) =>
    item.name?.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  const fetchMail = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl + "mailTemplate", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });

      const result = await res.json();
      setMails(result.data);
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMail();
  }, []);
  return (
    <>
      <section className="user-section py-3 px-3">
        <BreadcrumbComponent />

        <Row className="align-items-stretch">
          <Col xs={12} md={5} className="mt-3 mt-md-0">
            <div className="table-box">
              <div className="table-title">
                <span className="title">Danh sách mẫu Mail</span>
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
                  <TableMail
                    data={filteredData}
                    fetchMail={fetchMail}
                    setSelectedMail={setSelectedMail}
                  />
                )}
              </div>
            </div>
          </Col>
          <Col xs={12} md={7}>
            <FormAddMail
              selectedMail={selectedMail}
              setSelectedMail={setSelectedMail}
              fetchMail={fetchMail}
            />
          </Col>
        </Row>
      </section>
    </>
  );
};

export default SendEmail;
