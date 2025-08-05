import React from "react";
import { Modal, Button, Badge } from "react-bootstrap";

const ModalViewDetailProcess = ({
  show,
  onHide,
  process,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "(Không có)";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const renderSteps = () => {
    if (!process?.steps || process.steps.length === 0) {
      return (
        <div className="no-steps-message">
          <p className="text-muted">Quy trình này chưa có bước nào được thiết lập.</p>
        </div>
      );
    }

    return (
      <div className="steps-container">
        {process.steps
          .sort((a, b) => a.step_order - b.step_order)
          .map((step, index) => (
            <div key={step.id} className="step-item-detail">
              <div className="step-header">
                <div className="step-number">
                </div>
                <h6 className="step-name"><strong>Bước {step.step_order}:</strong> {step.name}</h6>
              </div>
              
              {step.description && (
                <div className="step-description">
                  <span><strong>Mô tả: </strong>{step.description}</span>
                  
                </div>
              )}
              {index < process.steps.length - 1 && (
                <div className="step-divider">
                  <i className="bi bi-arrow-down text-primary"></i>
                </div>
              )}
            </div>
          ))}
      </div>
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Chi tiết quy trình
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="detail-box">
          <div className="basic-info mb-4">
            <h5 className="section-title">
              <i className="bi bi-info-circle me-2"></i>
              Thông tin cơ bản
            </h5>
            <div className="info-grid">
              <p>
                <strong>Tên quy trình:</strong> {process?.name || "(Không có)"}
              </p>
              <p>
                <strong>Tổng số bước:</strong> 
                <Badge bg="success" className="ms-2">
                  {process?.steps?.length || 0} bước
                </Badge>
              </p>
              <p>
                <strong>Ngày tạo:</strong> {formatDate(process?.created_at)}
              </p>
              <p>
                <strong>Cập nhật lần cuối:</strong> {formatDate(process?.updated_at)}
              </p>
            </div>
          </div>

          {/* Các bước quy trình */}
          <div className="steps-section">
            <h5 className="section-title">
              <i className="bi bi-list-ol me-2"></i>
              Các bước trong quy trình
            </h5>
            {renderSteps()}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalViewDetailProcess;