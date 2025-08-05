import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf";
import "./ModalPreviewProcedure.scss";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import DroppablePage from "./DroppablePage";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "../../../../../node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const ModalPreviewBlodProcedure = ({
  show,
  onHide,
  pdfBlobUrl,
  placedFields,
  // numPages,
}) => {
  const handleClearSelection = () => {};
  const handleFieldSelect = () => {};
  const handleFieldDelete = () => {};
  const handleFieldDropped = () => {};
  const [numPages, setNumPages] = useState(1);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      className="modal-preview-procedure"
      style={{ fontFamily: 'Roboto, sans-serif' }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Xem mẫu thủ tục</Modal.Title>
      </Modal.Header>
      <Modal.Body className="preview-body">
        {pdfBlobUrl ? (
          <div className="pdf-preview-container" onClick={handleClearSelection}>
            <Document
              file={pdfBlobUrl}
              className="pdf-document"
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              {Array.from(new Array(numPages), (_, index) => {
                const pageNum = index + 1;
                const fieldsOnPage = placedFields.filter(
                  (f) => Number(f.page) === pageNum
                );
                console.log("numPages", numPages);
                return (
                  <div
                    key={`page-wrapper-${pageNum}`}
                    className="pdf-page-wrapper"
                  >
                    <DroppablePage
                      key={`preview_page_${pageNum}`}
                      pageNumber={pageNum}
                      width={Math.min(800, window.innerWidth - 80)}
                      fieldsOnPage={fieldsOnPage}
                      selectedField={null}
                      onFieldSelect={handleFieldSelect}
                      onFieldDelete={handleFieldDelete}
                      onFieldDropped={handleFieldDropped}
                      isPreview={true}
                    />
                  </div>
                );
              })}
            </Document>
          </div>
        ) : (
          <div className="no-pdf-message">
            <div className="no-pdf-icon">📄</div>
            <p>Không có file PDF để xem trước.</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalPreviewBlodProcedure;
