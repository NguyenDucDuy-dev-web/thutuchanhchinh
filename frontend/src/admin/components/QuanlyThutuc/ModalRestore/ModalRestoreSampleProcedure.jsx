import React , {useState} from "react";
import { apiUrl, token } from "../../../../components/common/Http";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
const ModalRestoreSampleProcedure = ({show, onHide, template, onRestore}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!template) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}procedure/form-templates/restore/${template.id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });

      const result = await res.json();
      if (result.status === true) {
        toast.success(result.message || "Khôi phục mẫu thủ tục thành công");
        onHide();
        onRestore();
      } else {
        toast.error(result.message || "Khôi phục mẫu thủ tục thất bại");
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
        <Modal.Title>Xác nhận khôi phục</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có chắc chắn muốn khôi phục mẫu thủ tục{" "}
        <strong>{template?.name || "này"}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleDelete}
          disabled={loading}
          className="btn-restore"
        >
          {loading ? (
            <>
              <div
                className="spinner-border spinner-border-sm text-light"
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
            "Khôi phục"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRestoreSampleProcedure;
