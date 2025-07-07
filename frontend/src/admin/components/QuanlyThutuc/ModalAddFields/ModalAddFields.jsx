import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "./ModalAddFields.scss";
import { apiUrl, token } from "../../../../components/common/Http";

const ModalAddFields = ({ show, onHide, onFieldAdded }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm({ mode: "onTouched" });

  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState([]);

  const selectedTable = watch("source_table");
  const inputType = watch("input_type");

  useEffect(() => {
    if (show) {
      reset();
      fetchTables();
    }
  }, [show]);

  useEffect(() => {
    if (selectedTable) {
      fetchColumns(selectedTable);
    } else {
      setColumns([]);
    }
  }, [selectedTable]);

  const fetchTables = async () => {
    try {
      const res = await fetch(`${apiUrl}procedure/field/tables`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const result = await res.json();
      if (result.status) setTables(result.data);
    } catch (err) {
      toast.error("Lỗi khi tải bảng dữ liệu");
    }
  };

  const fetchColumns = async (table) => {
    try {
      const res = await fetch(`${apiUrl}procedure/field/columns/${table}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const result = await res.json();
      if (result.status) setColumns(result.data);
    } catch (err) {
      toast.error("Lỗi khi tải cột dữ liệu");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl + "procedure/field", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.status === true) {
        toast.success(result.message || "Thêm trường dữ liệu thành công");
        reset();
        onFieldAdded();
      } else {
        toast.error(result.message || "Thêm trường dữ liệu thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm trường dữ liệu cần thiết</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="formAddFields-box">
          <div className="formAddFields-content">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Label */}
              <label htmlFor="label">Tên trường dữ liệu:</label>
              <div className="input-group">
                <input
                  {...register("label", {
                    required: "Vui lòng tên trường dữ liệu",
                  })}
                  type="text"
                  id="label"
                  placeholder="Nhập tên trường dữ liệu"
                  className={`form-control ${errors.label && "is-invalid"}`}
                />
                {errors.label && (touchedFields.label || isSubmitted) && (
                  <p className="invalid-feedback">{errors.label?.message}</p>
                )}
              </div>

              {/* Name */}
              <label htmlFor="name">Tên biến:</label>
              <div className="input-group">
                <input
                  {...register("name", { required: "Vui lòng tên biến" })}
                  type="text"
                  id="name"
                  placeholder="Nhập tên biến"
                  className={`form-control ${errors.name && "is-invalid"}`}
                />
                {errors.name && (touchedFields.name || isSubmitted) && (
                  <p className="invalid-feedback">{errors.name?.message}</p>
                )}
              </div>

              {/* Type */}
              <label htmlFor="type">Loại:</label>
              <div className="input-group">
                <input
                  {...register("type", {
                    required: "Vui lòng nhập loại dữ liệu",
                  })}
                  type="text"
                  id="type"
                  placeholder="Nhập loại dữ liệu"
                  className={`form-control ${errors.type && "is-invalid"}`}
                />
                {errors.type && (touchedFields.type || isSubmitted) && (
                  <p className="invalid-feedback">{errors.type?.message}</p>
                )}
              </div>

              {/* Icon */}
              <label htmlFor="icon">Biểu tượng:</label>
              <div className="input-group">
                <input
                  {...register("icon")}
                  type="text"
                  id="icon"
                  placeholder="Nhập biểu tượng"
                  className="form-control"
                />
              </div>

              {/* Input Type */}
              <label htmlFor="input_type">Kiểu nhập liệu:</label>
              <div className="input-group">
                <select
                  {...register("input_type")}
                  id="input_type"
                  className="form-control"
                >
                  <option value="">-- Chọn kiểu nhập liệu --</option>
                  <option value="manual">Nhập tay (manual)</option>
                  <option value="db">Lấy từ CSDL (db)</option>
                </select>
              </div>

              {/* Nếu là Select thì hiển thị các lựa chọn bảng/cột */}
              {inputType === "db" && (
                <>
                  <label htmlFor="source_table">Bảng dữ liệu nguồn:</label>
                  <div className="input-group">
                    <select
                      {...register("source_table")}
                      id="source_table"
                      className="form-control"
                    >
                      <option value="">-- Chọn bảng --</option>
                      {tables.map((tbl) => (
                        <option key={tbl} value={tbl}>
                          {tbl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label htmlFor="source_column">Cột hiển thị dữ liệu:</label>
                  <div className="input-group">
                    <select
                      {...register("source_column")}
                      id="source_column"
                      className="form-control"
                    >
                      <option value="">-- Chọn cột --</option>
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="btn-group">
                <button
                  type="reset"
                  className="btn-reset w-100"
                  disabled={loading}
                >
                  <i className="bi bi-arrow-repeat me-1"></i>
                  <span className="reset">Làm mới</span>
                </button>

                <button
                  type="submit"
                  className="btn-add w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <div
                      className="spinner-border spinner-border-sm text-light"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <i className="bi bi-floppy-fill me-1"></i>
                      <span className="add">Thêm</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddFields;
