import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiUrl, token } from "../../../../../components/common/Http";
import "./FormAddList.scss";
const FormAddList = ({ fetchProcedures, formTemplates, procedureProcess }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm({
    mode: "onTouched",
  });
  const [loading, setLoading] = useState(false);

  const [fileName, setfileName] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(apiUrl + "temp-images", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token()}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (result.status == true) {
        setValue("image", result.data.url);
        setValue("imageId", result.data.id);
        setfileName(file.name);
        setUploadedImage(result.data.url);
        toast.success("Tải ảnh thành công");
      } else {
        toast.error("Tải ảnh thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi upload ảnh");
    }
  };

  const handleRemoveImage = () => {
    setValue("image", "");
    setValue("imageId", "");
    setfileName("");
    setUploadedImage(null);
  };
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl + "procedure" + "/procedures", {
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
        toast.success(result.message || "Thêm thủ tục thành công");
        reset();
        setUploadedImage(null);
        setfileName("");
        if (fetchProcedures) fetchProcedures();
      } else {
        toast.error(result.message || "Thêm thủ tục thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-box">
        <div className="form-title">
          <span>Thêm thủ tục</span>
        </div>
        <div className="form-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="title">Tiêu đề:</label>
            <div className="input-group">
              <input
                {...register("title", {
                  required: "Vui lòng nhập tiêu đề",
                })}
                className={`form-control ${errors.title && "is-invalid"}`}
                type="text"
                id="title"
                placeholder="Nhập tiêu đề"
              />
              {errors.title && (touchedFields.title || isSubmitted) && (
                <p className="invalid-feedback">{errors.title?.message}</p>
              )}
            </div>

            <label htmlFor="short_desc">Mô tả ngắn:</label>
            <div className="input-group">
              <input
                {...register("short_desc", {
                  required: "Vui lòng nhập mô tả",
                })}
                className={`form-control ${errors.short_desc && "is-invalid"}`}
                type="text"
                id="short_desc"
                placeholder="Nhập mô tả"
              />
              {errors.short_desc &&
                (touchedFields.short_desc || isSubmitted) && (
                  <p className="invalid-feedback">
                    {errors.short_desc?.message}
                  </p>
                )}
            </div>

            <label htmlFor="content">Nội dung:</label>
            <div className="input-group">
              <textarea
                {...register("content", {
                  required: "Vui lòng nhập nội dung",
                })}
                className={`form-control ${errors.content && "is-invalid"}`}
                type="text"
                id="content"
                placeholder="Nhập nội dung"
              />
              {errors.content && (touchedFields.content || isSubmitted) && (
                <p className="invalid-feedback">{errors.content?.message}</p>
              )}
            </div>

            <label htmlFor="room">Phòng:</label>
            <div className="input-group">
              <input
                {...register("room", {
                  required: "Vui lòng nhập phòng",
                })}
                className={`form-control ${errors.room && "is-invalid"}`}
                type="text"
                id="room"
                placeholder="Nhập phòng"
              />
              {errors.room && (touchedFields.room || isSubmitted) && (
                <p className="invalid-feedback">{errors.room?.message}</p>
              )}
            </div>

            <label htmlFor="time">Thời gian:</label>
            <div className="input-group">
              <input
                {...register("time", {
                  required: "Vui lòng thời gian",
                })}
                className={`form-control ${errors.time && "is-invalid"}`}
                type="text"
                id="time"
                placeholder="Nhập thời gian"
              />
              {errors.time && (touchedFields.time || isSubmitted) && (
                <p className="invalid-feedback">{errors.time?.message}</p>
              )}
            </div>

            <label htmlFor="image">Chọn hình ảnh:</label>
            <div className="input-group">
              {!uploadedImage ? (
                <input
                  {...register("image", {})}
                  type="file"
                  id="image"
                  accept="image/*"
                  className={`form-control ${errors.image && "is-invalid"}`}
                  onChange={handleImageUpload}
                />
              ) : (
                <div
                  className="uploaded-image-info"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    backgroundColor: "#f8f9fa",
                    width: "100%",
                  }}
                >
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                  <span style={{ flex: 1, fontSize: "14px" }}>{fileName}</span>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    style={{
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </div>
              )}

              {errors.image && (touchedFields.image || isSubmitted) && (
                <p className="invalid-feedback">{errors.image.message}</p>
              )}
            </div>
            <input type="hidden" {...register("imageId")} />

            <label htmlFor="type">Loại thủ tục:</label>
            <div className="input-group">
              <select
                {...register("type", {
                  required: "Vui lòng chọn loại thủ tục",
                })}
                id="type"
                className={`form-control ${errors.type && "is-invalid"}`}
              >
                <option value="">-- Chọn loại thủ tục --</option>
                <option value="0">Thủ tục hành chính công</option>
                {/* <option value="0">Trực tiếp</option> */}
              </select>
              {errors.type && (touchedFields.type || isSubmitted) && (
                <p className="invalid-feedback">{errors.type?.message}</p>
              )}
            </div>

            <label htmlFor="format">Hình thức:</label>
            <div className="input-group">
              <select
                {...register("format", {
                  required: "Vui lòng chọn hình thức",
                })}
                id="format"
                className={`form-control ${errors.format && "is-invalid"}`}
              >
                <option value="">-- Chọn hình thức --</option>
                <option value="1">Trực tuyến</option>
                <option value="0">Trực tiếp</option>
              </select>
              {errors.format && (touchedFields.format || isSubmitted) && (
                <p className="invalid-feedback">{errors.format?.message}</p>
              )}
            </div>

            <label htmlFor="process_id">Chọn quy trình xử lý:</label>
            <div className="input-group">
              <select
                {...register("process_id", {
                  required: "Vui lòng chọn quy trình xử lý",
                })}
                id="process_id"
                className={`form-control ${
                  errors.process_id && "is-invalid"
                }`}
              >
                <option value="">-- Chọn quy trình xử lý --</option>
                {procedureProcess.map((procedureProcess) => (
                  <option key={procedureProcess.id} value={procedureProcess.id}>
                    {procedureProcess.name}
                  </option>
                ))}
              </select>
              {errors.process_id &&
                (touchedFields.process_id || isSubmitted) && (
                  <p className="invalid-feedback">
                    {errors.process_id?.message}
                  </p>
                )}
            </div>

            <label htmlFor="form_template_id">Chọn mẫu thủ tục:</label>
            <div className="input-group">
              <select
                {...register("form_template_id", {
                  required: "Vui lòng chọn mẫu thủ tục",
                })}
                id="form_template_id"
                className={`form-control ${
                  errors.form_template_id && "is-invalid"
                }`}
              >
                <option value="">-- Chọn mẫu thủ tục --</option>
                {formTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              {errors.form_template_id &&
                (touchedFields.form_template_id || isSubmitted) && (
                  <p className="invalid-feedback">
                    {errors.form_template_id?.message}
                  </p>
                )}
            </div>

            <div className="btn-group">
              {/* <div className="align-items-stretch"> */}
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
                  <>
                    <i className="bi bi-floppy-fill me-1"></i>
                    <span className="add">Thêm</span>
                  </>
                )}
              </button>
              {/* </div> */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormAddList;
