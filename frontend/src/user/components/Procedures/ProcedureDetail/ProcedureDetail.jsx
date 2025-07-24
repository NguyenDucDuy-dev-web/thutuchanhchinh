import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import "./ProcedureDetail.scss";
import anhphobien from "../../../../assets/images/anhphobien1.png";
import avt from "../../../../assets/images/avt.jpg";
import { apiUrl, token } from "../../../../components/common/Http";
import ModalFillForm from "../ModalFillForm/ModalFillForm";
const ProcedureDetail = () => {
  const { id } = useParams();
  const [procedureData, setProcedureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formFields, setFormFields] = useState([]);
  useEffect(() => {
    const fetchProcedure = async () => {
      try {
        const res = await fetch(`${apiUrl}procedure/procedures/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token()}`,
          },
        });

        const result = await res.json();
        if (result.status === true) {
          setProcedureData(result.data);

          if (result.data.form_template_id) {
            const fields = await fetchFormFields(result.data.form_template_id);
            setFormFields(fields);
          }
        } else {
          setError(result.message || "Không tìm thấy thủ tục.");
        }
      } catch (err) {
        setError("Lỗi kết nối máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    fetchProcedure();
  }, [id]);

  const fetchFormFields = async (formTemplateId) => {
    const res = await fetch(
      `${apiUrl}procedure/form-templates/${formTemplateId}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      }
    );

    const result = await res.json();

    if (result.status) {
      const fetchFields = await Promise.all(
        (result.data?.fields || []).map(async (field) => {
          if (field.field.input_type === "db" && field.id) {
            try {
              const resDb = await fetch(
                `${apiUrl}procedure/field/fields/${field.id}/source-data`,
                {
                  headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                  },
                }
              );
              const resultDb = await resDb.json();

              return {
                ...field,

                defaultValue:
                  resultDb.data?.length > 0
                    ? resultDb.data[0][field.field.source_column]
                    : "",
              };
            } catch (e) {
              console.error("Error fetching DB data for field", field.id, e);
              return {
                ...field,
                options: [],
              };
            }
          } else {
            return field;
          }
        })
      );

      return fetchFields;
    }

    return [];
  };

  const openModal = () => { 
    setModalOpen(true);
  };
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "John Doe",
      date: "13 Dec 2021",
      content:
        "Maecenas nisl libero, tincidunt id odio id, feugiat vulputate quam. Vestibulum feugiat rhoncus metus. In non erat et ipsum molestie porta sit amet ut felis. Vestibulum a massa...",
      avatar: avt,
    },
    {
      id: 2,
      author: "John Doe",
      date: "13 Dec 2021",
      content:
        "Maecenas nisl libero, tincidunt id odio id, feugiat vulputate quam. Vestibulum feugiat rhoncus metus. In non erat et ipsum molestie porta sit amet ut felis. Vestibulum a massa...",
      avatar: avt,
    },
    {
      id: 3,
      author: "John Doe",
      date: "13 Dec 2021",
      content:
        "Maecenas nisl libero, tincidunt id odio id, feugiat vulputate quam. Vestibulum feugiat rhoncus metus. In non erat et ipsum molestie porta sit amet ut felis. Vestibulum a massa...",
      avatar: avt,
    },
  ]);

  const handleSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "Bạn",
        date: new Date().toLocaleDateString("vi-VN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        content: newComment,
        avatar: null,
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  if (loading)
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 mb-0">Đang tải dữ liệu...</p>
      </div>
    );
  if (error) return <div className="error">{error}</div>;
  if (!procedureData) return null;

  return (
    <>
      <div className="procedure-detail-section">
        <div className="custom-container">
          <div className="procedure-detail-box">
            <div className="procedure-detail-title">
              <Row>
                <Col md={4} className="image-wrapper">
                  <div className="image-box">
                    <img
                      src={
                        "http://localhost:8000/storage/procedures/thumb/" +
                        procedureData.image.split("/").pop()
                      }
                      alt={procedureData.title}
                      className="procedure-image"
                    />
                  </div>
                </Col>
                <Col md={7} className="content-wrapper">
                  <div className="content-box">
                    <div className="procedure-header">
                      <h1 className="procedure-title">{procedureData.title}</h1>
                      <div className="procedure-meta">
                        <span className="status">
                          {procedureData.format === 1
                            ? "Trực tuyến"
                            : "Trực tiếp"}
                        </span>{" "}
                        |
                        <span className="views-count">
                          {procedureData.views}
                        </span>
                      </div>
                      <p className="procedure-short_desc">
                        {procedureData.short_desc}
                      </p>
                      <div className="action-buttons">
                        <button className="btn-xemhuongdan">
                          XEM HƯỚNG DẪN
                        </button>
                        <button className="btn-thuchien" onClick={openModal}>
                          THỰC HIỆN NGAY
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={8} className="description-wrapper">
                  <div className="description-box">
                    <h3>Mô tả</h3>
                    <div className="description-content">
                      {procedureData.content &&
                        procedureData.content
                          .split("\n\n")
                          .map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                          ))}
                    </div>
                  </div>
                </Col>
                <Col md={4} className="metadata-wrapper">
                  <div className="metadata-box">
                    <div className="metadata-item">
                      <div className="metadata-label">THỦ TỤC</div>
                      <div className="metadata-value">
                        {procedureData.type === 0
                          ? "Thủ tục hành chính công"
                          : ""}
                      </div>
                    </div>
                    <div className="metadata-item">
                      <div className="metadata-label">ĐƠN VỊ PHỤ TRÁCH</div>
                      <div className="metadata-value">{procedureData.room}</div>
                    </div>
                    <div className="metadata-item">
                      <div className="metadata-label">THỜI GIAN XỬ LÝ</div>
                      <div className="metadata-value">{procedureData.time}</div>
                    </div>
                    <div className="metadata-item">
                      <div className="metadata-label">HÌNH THỨC</div>
                      <div className="metadata-value">
                        {procedureData.format === 1
                          ? "Trực tuyến"
                          : "Trực tiếp"}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="procedure-detail-body">
              <div className="suggestions-section">
                <div className="section-title">
                  <h3>Đề xuất cho bạn</h3>
                </div>

                <Row>
                  <Col md={3} sm={6} xs={12}>
                    <div className="suggestion-card">
                      <div className="card-image">
                        <img
                          src={anhphobien}
                          alt="Đăng ký xin giấy vay vốn sinh viên"
                        />
                      </div>
                      <div className="card-content">
                        <h5 className="card-title">
                          Đăng ký xin giấy vay vốn sinh viên
                        </h5>
                        <p className="card-description">
                          Sinh viên đang theo học chính quy tại trường đại học
                          được xem xét tạm hoãn nghĩa vụ quân sự theo quy định.
                        </p>
                        <div className="card-meta">
                          <span className="card-type">Phòng đào tạo</span>
                          <span className="card-status">Trực tuyến</span>
                        </div>
                        <button className="btn-view-detail">
                          XEM CHI TIẾT
                        </button>
                      </div>
                    </div>
                  </Col>

                  <Col md={3} sm={6} xs={12}>
                    <div className="suggestion-card">
                      <div className="card-image">
                        <img
                          src={anhphobien}
                          alt="Đăng ký xin giấy vay vốn sinh viên"
                        />
                      </div>
                      <div className="card-content">
                        <h5 className="card-title">
                          Đăng ký xin giấy vay vốn sinh viên
                        </h5>
                        <p className="card-description">
                          Sinh viên đang theo học chính quy tại trường đại học
                          được xem xét tạm hoãn nghĩa vụ quân sự theo quy định.
                        </p>
                        <div className="card-meta">
                          <span className="card-type">Phòng đào tạo</span>
                          <span className="card-status">Trực tuyến</span>
                        </div>
                        <button className="btn-view-detail">
                          XEM CHI TIẾT
                        </button>
                      </div>
                    </div>
                  </Col>

                  <Col md={3} sm={6} xs={12}>
                    <div className="suggestion-card">
                      <div className="card-image">
                        <img
                          src={anhphobien}
                          alt="Đăng ký xin giấy vay vốn sinh viên"
                        />
                      </div>
                      <div className="card-content">
                        <h5 className="card-title">
                          Đăng ký xin giấy vay vốn sinh viên
                        </h5>
                        <p className="card-description">
                          Sinh viên đang theo học chính quy tại trường đại học
                          được xem xét tạm hoãn nghĩa vụ quân sự theo quy định.
                        </p>
                        <div className="card-meta">
                          <span className="card-type">Phòng đào tạo</span>
                          <span className="card-status">Trực tuyến</span>
                        </div>
                        <button className="btn-view-detail">
                          XEM CHI TIẾT
                        </button>
                      </div>
                    </div>
                  </Col>

                  <Col md={3} sm={6} xs={12}>
                    <div className="suggestion-card">
                      <div className="card-image">
                        <img
                          src={anhphobien}
                          alt="Đăng ký xin giấy vay vốn sinh viên"
                        />
                      </div>
                      <div className="card-content">
                        <h5 className="card-title">
                          Đăng ký xin giấy vay vốn sinh viên
                        </h5>
                        <p className="card-description">
                          Sinh viên đang theo học chính quy tại trường đại học
                          được xem xét tạm hoãn nghĩa vụ quân sự theo quy định.
                        </p>
                        <div className="card-meta">
                          <span className="card-type">Phòng đào tạo</span>
                          <span className="card-status">Trực tuyến</span>
                        </div>
                        <button className="btn-view-detail">
                          XEM CHI TIẾT
                        </button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="procedure-detail-footer">
              <div className="comment-section">
                <div className="comment-title">
                  <h3>Bình luận</h3>
                </div>

                <Row>
                  <Col lg={8} md={12} className="comment-main-col">
                    {/* Comment Input */}
                    <div className="comment-input-wrapper">
                      <div className="comment-input-box">
                        <div className="comment-input-content">
                          <div className="user-avatar">
                            <img
                              src={avt}
                              alt="User Avatar"
                              className="avatar-img"
                            />
                          </div>
                          <div className="input-content">
                            <input
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Viết bình luận ..."
                              className="comment-input"
                            />
                          </div>
                          <button
                            onClick={handleSubmit}
                            className="send-message-btn"
                          >
                            GỬI
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="comments-list">
                      {comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                          <div className="comment-avatar">
                            <img
                              src={
                                comment.avatar ||
                                "https://via.placeholder.com/48x48/cccccc/999999?text=U"
                              }
                              alt={`${comment.author} Avatar`}
                              className="avatar-img-gray"
                            />
                          </div>
                          <div className="comment-content">
                            <div className="comment-header">
                              <h4 className="comment-author">
                                {comment.author}
                              </h4>
                              <span className="comment-date">
                                {comment.date}
                              </span>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Col>

                  <Col lg={4} md={12} className="comment-sidebar-col">
                    {/* Right Sidebar */}
                    <div className="comment-sidebar">
                      <div className="sidebar-item">
                        <div className="sidebar-icon">
                          <i className="bi bi-clock-fill"></i>
                        </div>
                        <span className="sidebar-text">LỊCH SỬ THỦ TỤC</span>
                      </div>
                      <div className="sidebar-item">
                        <div className="sidebar-icon">
                          <i className="bi bi-info-circle-fill"></i>
                        </div>
                        <span className="sidebar-text">
                          LIÊN HỆ VỚI CHÚNG TÔI
                        </span>
                      </div>
                      <div className="sidebar-item">
                        <div className="sidebar-icon">
                          <i className="bi bi-circle-fill"></i>
                        </div>
                        <span className="sidebar-text">OTHER OPTION 1</span>
                      </div>
                      <div className="sidebar-item active">
                        <div className="sidebar-icon">
                          <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <span className="sidebar-text">OTHER OPTION 2</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalFillForm
        show={isModalOpen}
        onHide={() => setModalOpen(false)}
        fields={formFields}
        form_template_id = {procedureData?.form_template_id}
        procedure_id = {procedureData?.id}
      />
    </>
  );
};

export default ProcedureDetail;
