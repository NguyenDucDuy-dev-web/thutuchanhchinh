import React, { useState } from "react";
import { apiUrl, token } from "../../../../components/common/Http";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "./ModalDeleteUser.scss";
const ModalDeleteUser = ({ show, onHide, user, onUserDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}user/${user.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });

      const result = await res.json();
      if (result.status === true) {
        toast.success(result.message || "Xoá người dùng thành công");
        onHide();
        onUserDeleted();
      } else {
        toast.error(result.message || "Xoá người dùng thất bại");
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
        Bạn có chắc chắn muốn xóa người dùng{" "}
        <strong>{user?.name || "này"}</strong>?
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
            "Xóa"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDeleteUser;
