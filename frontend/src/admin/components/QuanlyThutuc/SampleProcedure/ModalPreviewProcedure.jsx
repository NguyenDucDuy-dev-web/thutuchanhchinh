import React from "react";
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



const ModalPreviewProcedure = ({
  show,
  onHide,
  pdfFileURL,
  placedFields,
  numPages,
}) => {
  const handleClearSelection = () => {}; 
  const handleFieldSelect = () => {};
  const handleFieldDelete = () => {};
  const handleFieldDropped = () => {};

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      className="modal-preview-procedure"
    >
      <Modal.Header closeButton>
        <Modal.Title>Xem trước mẫu thủ tục</Modal.Title>
      </Modal.Header>
      <Modal.Body className="preview-body">
        {pdfFileURL ? (
          <div className="pdf-preview-container" onClick={handleClearSelection}>
            <Document file={pdfFileURL} className="pdf-document">
              {Array.from(new Array(numPages), (_, index) => {
                const pageNum = index + 1;
                const fieldsOnPage = placedFields.filter(
                  (f) => f.page === pageNum
                );
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

export default ModalPreviewProcedure;
