import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { apiUrl, token } from "../../../../components/common/Http";

const ModalSaveTemplate = ({ show, onHide, placedFields }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const onSubmit = async (data) => {
    // Validate file trước khi submit
    if (!selectedFile) {
      setError("pdf_file", { 
        type: "required", 
        message: "Vui lòng chọn file PDF" 
      });
      toast.error("Vui lòng chọn file PDF");
      return;
    }

    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setError("pdf_file", { 
        type: "invalid", 
        message: "Chỉ chấp nhận file PDF" 
      });
      toast.error("Chỉ chấp nhận file PDF");
      return;
    }

    // Validate file size (20MB = 20 * 1024 * 1024 bytes)
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError("pdf_file", { 
        type: "size", 
        message: "File PDF không được vượt quá 20MB" 
      });
      toast.error("File PDF không được vượt quá 20MB");
      return;
    }

    const formData = new FormData();

    // Gắn các giá trị text
    formData.append("name", data.name);
    formData.append("description", data.description);

    // Gắn file PDF
    formData.append("pdf_file", selectedFile);

    // Gắn các trường dragged fields (fields: [...])
    formData.append(
      "fields",
      JSON.stringify(
        placedFields.map((f) => ({
          field_id: f.field.id,
          position_x: f.x,
          position_y: f.y,
          page: f.page,
        }))
      )
    );

    // Debug: Log FormData content
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ', pair[1]);
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}procedure/form-templates`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token()}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (result.status === true) {
        toast.success(result.message || "Thêm mẫu thủ tục thành công");
        reset();
        setSelectedFile(null); 
        onHide();
      } else {
        toast.error(result.message || "Thêm mẫu thủ tục thất bại");
        

        if (result.errors) {
          Object.keys(result.errors).forEach(key => {
            setError(key, { 
              type: "server", 
              message: result.errors[key][0] 
            });
          });
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Có lỗi xảy ra: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    
    
    if (errors.pdf_file) {
      setError("pdf_file", null);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Lưu mẫu thủ tục</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-box">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name">Tên mẫu thủ tục:</label>
            <input
              {...register("name", {
                required: "Vui lòng nhập tên mẫu thủ tục",
              })}
              type="text"
              id="name"
              className={`form-control ${errors.name && "is-invalid"}`}
              placeholder="Nhập tên mẫu thủ tục"
            />
            {errors.name && (
              <p className="invalid-feedback">{errors.name.message}</p>
            )}

            <label htmlFor="description">Mô tả:</label>
            <input
              {...register("description", { required: "Vui lòng nhập mô tả" })}
              type="text"
              id="description"
              className={`form-control ${errors.description && "is-invalid"}`}
              placeholder="Nhập mô tả"
            />
            {errors.description && (
              <p className="invalid-feedback">{errors.description.message}</p>
            )}

            <label htmlFor="pdf_file">Chọn file PDF mẫu:</label>
            <input
              type="file"
              id="pdf_file"
              accept="application/pdf"
              className={`form-control ${errors.pdf_file && "is-invalid"}`}
              onChange={handleFileChange}
            />
            {errors.pdf_file && (
              <p className="invalid-feedback">{errors.pdf_file.message}</p>
            )}
            
            {/* Hiển thị tên file đã chọn */}
            {selectedFile && (
              <small className="text-muted">
                Đã chọn: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </small>
            )}

            <div className="btn-group mt-3">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <div
                    className="spinner-border spinner-border-sm text-light"
                    role="status"
                  ></div>
                ) : (
                  <>
                    <i className="bi bi-floppy-fill me-1"></i>
                    Lưu
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalSaveTemplate;