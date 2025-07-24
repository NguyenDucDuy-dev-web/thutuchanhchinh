import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiUrl, token } from "../../../components/common/Http";
import TableSampleProcedure from "../../components/Table/TableSampleProcedure";
import ModalPreviewBlodProcedure from "./../../components/QuanlyThutuc/SampleProcedure/ModalPreviewBlobProcedure";
import BreadcrumbComponent from "../../../components/common/Breadcrumb/BreadcrumbComponent";

const ListSampleProcedure = () => {
  const [sampleProcedure, setSampleProcedure] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyWord] = useState("");
  const filteredData = sampleProcedure.filter((item) =>
    item.name?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const fetchSampleProcedure = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl + "procedure" + "/form-templates", {
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
      setSampleProcedure(result.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách mẫu thủ tục:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSampleProcedure();
  }, []);

  const handlePreview = async (template) => {
    try {
      setLoading(true);

      const res = await fetch(
        apiUrl + `procedure/form-templates/${template.id}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token()}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      const data = result.data;

      let fullPdfUrl;
      if (data.file_name) {
        fullPdfUrl = apiUrl + `form-templates/file/${data.file_name}`;
      } else if (data.file_url?.startsWith("http")) {
        fullPdfUrl = data.file_url;
      } else if (data.file_url) {
        const fileName = data.file_url.split("/").pop();
        fullPdfUrl = apiUrl + `form-templates/file/${fileName}`;
      }

      const pdfRes = await fetch(fullPdfUrl, {
        headers: {
          Authorization: `Bearer ${token()}`,
        },
      });

      if (!pdfRes.ok) {
        throw new Error(`Failed to fetch PDF: ${pdfRes.status}`);
      }

      const pdfBlob = await pdfRes.blob();
      const blobUrl = URL.createObjectURL(pdfBlob);

      setSelectedTemplate({
        ...data,
        pdfBlobUrl: blobUrl,
        templateId: template.id,
      });
      setShowPreview(true);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết mẫu thủ tục:", err);
      alert("Không thể tải chi tiết mẫu thủ tục. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setTimeout(() => {
      setSelectedTemplate(null);
    }, 300);
  };

  return (
    <>
      <section className="user-section py-3 px-3">
        <BreadcrumbComponent />

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
                  <TableSampleProcedure
                    data={filteredData}
                    onPreview={handlePreview}
                    onUpdated={fetchSampleProcedure}
                  />
                )}
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* Modal Preview */}
      <ModalPreviewBlodProcedure
        show={showPreview}
        onHide={handleClosePreview}
        pdfBlobUrl={selectedTemplate?.pdfBlobUrl}
        placedFields={selectedTemplate?.fields || []}
        // numPages={selectedTemplate?.num_pages || 1}
      />
    </>
  );
};

export default ListSampleProcedure;
