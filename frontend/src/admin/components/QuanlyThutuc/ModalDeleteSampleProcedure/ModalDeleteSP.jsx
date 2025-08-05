import React, {useState} from "react";
import "./ModalDeleteSP.scss";
import { apiUrl, token } from "../../../../components/common/Http";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
const ModalDeleteSP = ({show, onHide, template, onDeleted}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!template) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}procedure/form-templates/${template.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });

      const result = await res.json();
      if (result.status === true) {
        toast.success(result.message || "Xoá mẫu thủ tục thành công");
        onHide();
        onDeleted();
      } else {
        toast.error(result.message || "Xoá mẫu thủ tục thất bại");
      }
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal show={show} onHide={onHide} dialogClassName="top-modal" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xóa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có chắc chắn muốn xóa mẫu thủ tục{" "}
        <strong>{template?.name || "này"}</strong>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleDelete}
          disabled={loading}
          className="btn-delete"
        >
          {loading ? (
            <>
              <div
                className="spinner-border spinner-border-sm text-light me-1"
                role="status"
                style={{
                  width: "1rem",
                  height: "1rem",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </>
          ) : (
            "Xóa"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDeleteSP;
