import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalViewDetailNews = ({ show, onHide, news }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (news?.image) {
      const filename = news.image.split("/").pop();
      const fullImageUrl = `http://localhost:8000/storage/news/thumb/${filename}`;
      setImageUrl(fullImageUrl);
    } else {
      setImageUrl("");
    }
  }, [news]);

  return (
    <Modal show={show} onHide={onHide} size="lg" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết tin tức</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="detail-box">
          <p><strong>Tiêu đề:</strong> {news?.title || "(Không có)"}</p>
          <p><strong>Slug:</strong> {news?.slug || "(Không có)"}</p>
          <p><strong>Mô tả ngắn:</strong> {news?.short_desc || "(Không có)"}</p>
          <p><strong>Nội dung:</strong> {news?.content || "(Không có)"}</p>
          <p><strong>Phòng:</strong> {news?.department || "(Không có)"}</p>
          <p><strong>Trạng thái:</strong> {news?.status === 1 ? "Nổi bật" : "Bình thường"}</p>

          {imageUrl && (
            <div className="mt-3">
              <strong>Ảnh minh họa:</strong><br />
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

export default ModalViewDetailNews;
