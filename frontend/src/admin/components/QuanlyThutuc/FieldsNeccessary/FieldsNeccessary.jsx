import React, { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import "./FieldsNeccessary.scss";
import ModalAddFields from "../ModalAddFields/ModalAddFields";

import ModalEditFields from "../ModalEditFields/ModalEditFields";
import ModalDeleteFields from "../ModalDeleteFields/ModalDeleteFields";
import FieldItem from "../FieldItem/FieldItem";
import { apiUrl, token } from "../../../../components/common/Http";

const FieldsNeccessary = ({ onEditModeChange }) => {
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    const newMode = !editMode;
    setEditMode(newMode);
    // Gọi callback nếu có
    if (onEditModeChange) {
      onEditModeChange(newMode);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const [selectedField, setSelectedField] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const handleShowUpdateModal = (field) => {
    setSelectedField(field);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setSelectedField(null);
    setShowUpdateModal(false);
  };

  const handleShowDeleteModal = (field) => {
    setSelectedField(field);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedField(null);
    setShowDeleteModal(false);
  };

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFields = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(apiUrl + "procedure" + "/field", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      setFields(result.data || []);
    } catch (err) {
      console.error("Error fetching fields:", err);
      setError("Không thể tải danh sách trường dữ liệu");
      setFields([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleFieldAdded = () => {
    fetchFields();
    handleCloseAddModal();
  };

  const handleFieldUpdated = () => {
    fetchFields();
    handleCloseUpdateModal();
  };

  const handleFieldDeleted = () => {
    fetchFields();
    handleCloseDeleteModal();
  };

  return (
    <>
      <Col xs={12} md = {3} lg={3} className="mb-3 mb-lg-0">
        <div className="field-box">
          <div className="field-title">
            <span>Các trường dữ liệu</span>
            <button 
              className="btn btn_setting" 
              onClick={toggleEditMode}
              title={editMode ? "Thoát chế độ chỉnh sửa" : "Chế độ chỉnh sửa"}
            >
              <i className={`bi ${editMode ? 'bi-x-lg' : 'bi-gear-fill'}`}></i>
            </button>
          </div>

          {editMode && (
            <div className="buttonAddField-box">
              <button
                className="btn btn-addField"
                onClick={handleShowAddModal}
                disabled={loading}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Thêm trường mới
              </button>
            </div>
          )}

          <div className="field-box__list">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 mb-0 text-muted small">Đang tải...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <i className="bi bi-exclamation-triangle text-warning fs-2"></i>
                <p className="mt-2 mb-2 text-muted small">{error}</p>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={fetchFields}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Thử lại
                </button>
              </div>
            ) : fields.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-inbox text-muted fs-2"></i>
                <p className="mt-2 mb-0 text-muted small">
                  {editMode 
                    ? "Chưa có trường dữ liệu nào. Nhấn 'Thêm trường mới' để bắt đầu." 
                    : "Chưa có trường dữ liệu nào."
                  }
                </p>
              </div>
            ) : (
              fields.map((field) => (
                <FieldItem
                  key={field.id}
                  field={field}
                  editMode={editMode}
                  onEdit={handleShowUpdateModal}
                  onDelete={handleShowDeleteModal}
                />
              ))
            )}
          </div>
        </div>
      </Col>

      {/* Modals */}
      <ModalAddFields
        show={showAddModal}
        onHide={handleCloseAddModal}
        onFieldAdded={handleFieldAdded}
      />

      <ModalEditFields
        show={showUpdateModal}
        onHide={handleCloseUpdateModal}
        field={selectedField}
        onFieldUpdated={handleFieldUpdated}
      />

      <ModalDeleteFields
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        field={selectedField}
        onFieldDelete={handleFieldDeleted}
      />
    </>
  );
};

export default FieldsNeccessary;