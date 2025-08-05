import React, { useState } from "react";
import { Modal, Button, Table, Spinner, Alert } from "react-bootstrap";
import { apiUrl, token } from "../../../../components/common/Http";

const ModalViewDetailYeuCau = ({ show, onHide, submission }) => {
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  if (!submission) return null;

  const fields = submission.fields || [];

  const handleViewPdf = async () => {
    setIsLoadingPdf(true);
    setPdfError(null);
    
    try {
      // Lấy token từ hàm token() đã có sẵn
      const authToken = token();

      if (!authToken) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await fetch(`${apiUrl}procedure/submission/${submission.id}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/pdf',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn');
        } else if (response.status === 404) {
          throw new Error('Không tìm thấy file PDF');
        } else {
          throw new Error(`Lỗi server: ${response.status}`);
        }
      }

      // Kiểm tra content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error('File trả về không phải là PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Mở PDF trong tab mới
      const newWindow = window.open();
      if (newWindow) {
        newWindow.location.href = url;
      } else {
        // Fallback nếu popup bị block
        const link = document.createElement('a');
        link.href = url;
        link.download = `thu_tuc_${submission.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      // Cleanup URL sau 1 giây
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

    } catch (error) {
      console.error('Error viewing PDF:', error);
      setPdfError(error.message || 'Có lỗi xảy ra khi tải PDF');
    } finally {
      setIsLoadingPdf(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable style={{ fontFamily: 'Roboto, sans-serif' }}>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết thủ tục đã nộp</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Tên thủ tục:</strong> {submission.procedure?.title}</p>
        <p><strong>Người gửi:</strong> {submission.user?.name} ({submission.user?.email})</p>
        <p><strong>Ngày gửi:</strong> {new Date(submission.created_at).toLocaleString("vi-VN")}</p>

        <hr />
        <h6>Thông tin đã điền:</h6>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Trường</th>
              <th>Giá trị</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f, idx) => (
              <tr key={idx}>
                <td>{f.field?.label || f.field?.name || "Không rõ"}</td>
                <td>{f.value}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {pdfError && (
          <Alert variant="danger" className="mt-3">
            <strong>Lỗi:</strong> {pdfError}
          </Alert>
        )}

        <div className="text-end">
          <Button
            variant="primary"
            onClick={handleViewPdf}
            disabled={isLoadingPdf}
          >
            {isLoadingPdf ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Đang tải PDF...
              </>
            ) : (
              'Xem lại file PDF'
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalViewDetailYeuCau;