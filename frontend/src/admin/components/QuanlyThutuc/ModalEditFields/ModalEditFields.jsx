import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { apiUrl, token } from "../../../../components/common/Http";

const ModalEditFields = ({ show, onHide, field, onFieldUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const inputType = watch("input_type");
  const selectedTable = watch("source_table");

  useEffect(() => {
    if (show && field) {
      reset({
        label: field.label || "",
        name: field.name || "",
        type: field.type || "",
        icon: field.icon || "",
        input_type: field.input_type || "",
        source_table: field.source_table || "",
        source_column: field.source_column || "",
      });
      fetchTables();
      if (field.source_table) fetchColumns(field.source_table);
    }
  }, [show, field, reset]);

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
      const updateData = {
        label: data.label,
        name: data.name,
        type: data.type,
        icon: data.icon || null,
        input_type: data.input_type || null,
        source_table: data.input_type === "db" ? data.source_table : null,
        source_column: data.input_type === "db" ? data.source_column : null,
      };

      const res = await fetch(`${apiUrl}procedure/field/${field.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(updateData),
      });
      const result = await res.json();

      if (result.status === true) {
        toast.success(result.message || "Cập nhật trường dữ liệu thành công");
        onHide();
        onFieldUpdated();
      } else {
        toast.error(result.message || "Cập nhật trường dữ liệu thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} style={{ fontFamily: 'Roboto, sans-serif' }}>
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa trường dữ liệu cần thiết</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="formAddFields-box">
          <div className="formAddFields-content">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="label">Tên trường dữ liệu:</label>
              <div className="input-group">
                <input
                  {...register("label", {
                    required: "Vui lòng nhập tên trường dữ liệu",
                  })}
                  type="text"
                  id="label"
                  className={`form-control ${errors.label && "is-invalid"}`}
                />
              </div>

              <label htmlFor="name">Tên biến:</label>
              <div className="input-group">
                <input
                  {...register("name", {
                    required: "Vui lòng nhập tên biến",
                  })}
                  type="text"
                  id="name"
                  className={`form-control ${errors.name && "is-invalid"}`}
                />
              </div>

              <label htmlFor="type">Loại:</label>
              <div className="input-group">
                <input
                  {...register("type", {
                    required: "Vui lòng nhập loại dữ liệu",
                  })}
                  type="text"
                  id="type"
                  className={`form-control ${errors.type && "is-invalid"}`}
                />
              </div>

              <label htmlFor="icon">Biểu tượng:</label>
              <div className="input-group">
                <input
                  {...register("icon")}
                  type="text"
                  id="icon"
                  className="form-control"
                />
              </div>

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

              <div className="btn-group mt-3">
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
                      <span className="add">Cập nhật</span>
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

export default ModalEditFields;
