import React, { useState } from "react";
import { Col } from "react-bootstrap";
import { Document, pdfjs } from "react-pdf";
import DroppablePage from "./DroppablePage";
import "./SampleProcedure.scss";
import ModalSaveTemplate from "../ModalSaveTemplate/ModalSaveTemplate";
import ModalPreviewProcedure from "./ModalPreviewProcedure";
// Sử dụng worker từ node_modules với Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "../../../../../node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const SampleProcedure = () => {
  const [pdfData, setPdfData] = useState({ file: null, fileURL: null });
  const [numPages, setNumPages] = useState(null);
  const [placedFields, setPlacedFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const handelCloseSaveModal = () => {
    setShowSaveModal(false);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      setPdfData({ file, fileURL });
      setPlacedFields([]);
      setSelectedField(null);
    } else {
      alert("Vui lòng chọn file PDF!");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleFieldDropped = (data) => {
    const newField = {
      ...data,
      id: Date.now() + Math.random(), 
    };
    setPlacedFields((prev) => [...prev, newField]);
  };

  const handleFieldSelect = (fieldId) => {
    setSelectedField(fieldId);
  };

  const handleFieldDelete = (fieldId) => {
    setPlacedFields((prev) => prev.filter((field) => field.id !== fieldId));
    setSelectedField(null);
  };

  const handleClearSelection = () => {
    setSelectedField(null);
  };

  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleClearAllFields = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả các trường đã đặt?")) {
      setPlacedFields([]);
      setSelectedField(null);
    }
  };

  return (
    <>
      <Col xs={12} md={9} lg={9} className="mt-3 mt-md-3">
        <div className="sample-box">
          <div className="sample-title">
            <span className="title">Mẫu thủ tục</span>
          </div>

          <div className="sample-content">
            <div className="sample-controls d-flex justify-content-between align-items-center mb-2">
              <div>
                <label className="btn btn-upload me-2 mb-0">
                  <i className="bi bi-upload me-1"></i> Tải PDF mới
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>
                <span className="sub-text">
                  | Kéo các trường dữ liệu vào vị trí mong muốn trên mẫu
                </span>
              </div>
              <div>
                {placedFields.length > 0 && (
                  <button
                    className="btn btn-outline-danger me-2"
                    onClick={handleClearAllFields}
                    title="Xóa tất cả trường"
                  >
                    <i className="bi bi-trash me-1"></i> Xóa tất cả
                  </button>
                )}
                <button className="btn btn-see me-2" onClick={handlePreview}>
                  <i className="bi bi-eye me-1"></i> Xem trước
                </button>
                <button className="btn btn-save" onClick={handleSave}>
                  <i className="bi bi-save me-1"></i> Lưu
                </button>
              </div>
            </div>

            {/* Thông tin trường được chọn */}
            {/* {selectedField && (
            <div className="alert alert-dismissible fade show mb-2" role="alert">
              <div className="d-flex justify-content-between align-items-center">
                <div className="sub-text-alert">
                  <i className="bi bi-cursor me-2"></i>
                  <strong>Đã chọn:</strong> {placedFields.find(f => f.id === selectedField)?.field.label}
                  <small className="ms-2 text-muted">
                    (Nhấp vào trường khác hoặc vùng trống để bỏ chọn)
                  </small>
                </div>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleFieldDelete(selectedField)}
                >
                  <i className="bi bi-trash"></i> Xóa
                </button>
              </div>
            </div>
          )} */}

            <div
              className="pdf-viewer"
              style={{ maxHeight: "600px", overflow: "auto" }}
            >
              {pdfData.fileURL ? (
                <div onClick={handleClearSelection}>
                  <Document
                    file={pdfData.fileURL}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    {Array.from(new Array(numPages), (_, index) => {
                      const pageNum = index + 1;
                      const fieldsOnPage = placedFields.filter(
                        (f) => f.page === pageNum
                      );
                      return (
                        <DroppablePage
                          key={`page_${pageNum}`}
                          pageNumber={pageNum}
                          width={Math.min(800, window.innerWidth - 40)}
                          onFieldDropped={handleFieldDropped}
                          fieldsOnPage={fieldsOnPage}
                          selectedField={selectedField}
                          onFieldSelect={handleFieldSelect}
                          onFieldDelete={handleFieldDelete}
                        />
                      );
                    })}
                  </Document>
                </div>
              ) : (
                <p className="sub-text text-center">
                  Chưa có file PDF để hiển thị. Vui lòng tải lên file PDF.
                </p>
              )}
            </div>
          </div>
        </div>
      </Col>

      <ModalSaveTemplate
        show={showSaveModal}
        onHide={handelCloseSaveModal}
        placedFields={placedFields}
      />

      <ModalPreviewProcedure
        show={showPreviewModal}
        onHide={() => setShowPreviewModal(false)}
        pdfFileURL={pdfData.fileURL}
        placedFields={placedFields}
        numPages={numPages}
      />
    </>
  );
};

export default SampleProcedure;
