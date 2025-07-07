import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "./FormAddNews.scss";
import { apiUrl, token } from "../../../../components/common/Http";

const FormAddNews = () => {
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
      const response = await fetch(apiUrl + "news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === true) {
        toast.success("Thêm tin tức thành công!");
        reset(); 
        setUploadedImage(null);
        setfileName("");
      } else {
        toast.error(result.message || "Thêm tin thất bại!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Đã xảy ra lỗi khi thêm tin tức!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-box">
        <div className="form-title">
          <span>Thêm tin tức</span>
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

            <label htmlFor="slug">Slug:</label>
            <div className="input-group">
              <input
                {...register("slug", {
                  required: "Vui lòng nhập slug",
                })}
                className={`form-control ${errors.slug && "is-invalid"}`}
                type="text"
                id="slug"
                placeholder="Nhập slug"
              />
              {errors.slug && (touchedFields.slug || isSubmitted) && (
                <p className="invalid-feedback">{errors.slug?.message}</p>
              )}
            </div>

            <label htmlFor="short_desc">Mô tả ngắn:</label>
            <div className="input-group">
              <textarea
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

            <label htmlFor="image">Chọn hình ảnh:</label>
            <div className="input-group">
              {!uploadedImage ? (
                // Hiển thị input file khi chưa upload
                <input
                  {...register("image", {})}
                  type="file"
                  id="image"
                  accept="image/*"
                  className={`form-control ${errors.image && "is-invalid"}`}
                  onChange={handleImageUpload}
                />
              ) : (
                // Hiển thị thông tin ảnh đã upload
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

            <label htmlFor="department">Phòng:</label>
            <div className="input-group">
              <input
                {...register("department", {
                  required: "Vui lòng nhập phòng",
                })}
                className={`form-control ${errors.department && "is-invalid"}`}
                type="text"
                id="department"
                placeholder="Nhập phòng"
              />
              {errors.department &&
                (touchedFields.department || isSubmitted) && (
                  <p className="invalid-feedback">
                    {errors.department?.message}
                  </p>
                )}
            </div>

            <label htmlFor="status">Trạng thái:</label>
            <div className="input-group">
              <select
                {...register("status", {
                  required: "Vui lòng chọn trạng thái",
                })}
                id="status"
                className={`form-control ${errors.status && "is-invalid"}`}
              >
                <option value="">-- Chọn trạng thái --</option>
                <option value="1">Nổi bật</option>
                <option value="0">Bình thường</option>
              </select>
              {errors.status && (touchedFields.status || isSubmitted) && (
                <p className="invalid-feedback">{errors.status?.message}</p>
              )}
            </div>

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
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormAddNews;
