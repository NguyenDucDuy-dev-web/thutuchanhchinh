import React, { useState } from "react";
import { apiUrl, token } from "../../../../components/common/Http";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "./ModalDeleteNews.scss";
const ModalDeleteNews = ({ show, onHide, news, onFetchNews }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!news) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}news/${news.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });

      const result = await res.json();
      if (result.status === true) {
        toast.success(result.message || "Xoá tin tức thành công");
        onHide();
        onFetchNews();
      } else {
        toast.error(result.message || "Xoá tin tức thất bại");
      }
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal show={show} onHide={onHide} dialogClassName="top-modal">
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xóa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có chắc chắn muốn xóa tin tức{" "}
        <strong>{news?.title || "này"}</strong>?
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

export default ModalDeleteNews;
