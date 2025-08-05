import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalViewDetail = ({
  show,
  onHide,
  procedures,
  formTemplates,
  procedureProcess,
}) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (procedures?.image) {
      const filename = procedures.image.split("/").pop();
      const fullImageUrl = `http://localhost:8000/storage/procedures/thumb/${filename}`;
      setImageUrl(fullImageUrl);
    } else {
      setImageUrl("");
    }
  }, [procedures]);

  const getFormTemplateName = (id) => {
    const found = formTemplates?.find(
      (tpl) => tpl.id === procedures?.form_template_id
    );
    return found?.name || "(Không có)";
  };

  const getProcedureProcess = (id) => {
    const found = procedureProcess?.find(
      (tpl) => tpl.id === procedures?.process_id
    );
    return found?.name || "(Không có)";
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết thủ tục</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="detail-box">
          <p>
            <strong>Tiêu đề:</strong> {procedures?.title || "(Không có)"}
          </p>
          <p>
            <strong>Mô tả ngắn:</strong>{" "}
            {procedures?.short_desc || "(Không có)"}
          </p>
          <p>
            <strong>Nội dung:</strong> {procedures?.content || "(Không có)"}
          </p>
          <p>
            <strong>Phòng:</strong> {procedures?.room || "(Không có)"}
          </p>
          <p>
            <strong>Thời gian:</strong> {procedures?.time || "(Không có)"}
          </p>
          <p>
            <strong>Loại thủ tục:</strong>{" "}
            {procedures?.type === 0 ? "Thủ tục hành chính công" : "(Không rõ)"}
          </p>
          <p>
            <strong>Hình thức:</strong>{" "}
            {procedures?.format === 1 ? "Trực tuyến" : "Trực tiếp"}
          </p>
          <p>
            <strong>Quy trình xử lý:</strong>{" "}
            {getProcedureProcess(procedures?.process_id)}
          </p>
          <p>
            <strong>Mẫu thủ tục:</strong>{" "}
            {getFormTemplateName(procedures?.form_template_id)}
          </p>

          {imageUrl && (
            <div className="mt-3">
              <strong>Ảnh minh họa:</strong>
              <br />
              <img
                src={imageUrl}
                alt="Ảnh minh họa"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "6px",
                  marginTop: "10px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}
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

export default ModalViewDetail;
