import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiUrl, token } from "../../../../components/common/Http";
import "./FormUser.scss";
const FormUser = ({ onUserAdded }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm({
    mode: "onTouched",
  });
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl + "user", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.status == true) {
        toast.success(result.message || "Thêm người dùng thành công");
        reset();
        onUserAdded();
      } else {
        toast.error(result.message || "Thêm người dùng thất bại");
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
          <span>Thêm người dùng</span>
        </div>
        <div className="form-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name">Tên:</label>
            <div className="input-group">
              <input
                {...register("name", {
                  required: "Vui lòng nhập tên người dùng",
                })}
                className={`form-control ${errors.name && "is-invalid"}`}
                type="text"
                id="name"
                placeholder="Nhập tên người dùng"
              />
              {errors.name && (touchedFields.name || isSubmitted) && (
                <p className="invalid-feedback">{errors.name?.message}</p>
              )}
            </div>
            <label htmlFor="email">Email:</label>
            <div className="input-group">
              <input
                {...register("email", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Vui lòng nhập email đúng định dạng",
                  },
                })}
                className={`form-control ${errors.email && "is-invalid"}`}
                type="email"
                id="email"
                placeholder="Nhập email"
              />
              {errors.email && (touchedFields.email || isSubmitted) && (
                <p className="invalid-feedback">{errors.email?.message}</p>
              )}
            </div>
            <label htmlFor="password">Mật khẩu:</label>
            <div className="input-group">
              <input
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu phải có ít nhất 6 ký tự",
                  },
                })}
                className={`form-control ${errors.password && "is-invalid"}`}
                type="password"
                id="password"
                placeholder="Nhập mật khẩu"
              />
              {errors.password && (touchedFields.password || isSubmitted) && (
                <p className="invalid-feedback">{errors.password?.message}</p>
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
                <option value="1">Hoạt động</option>
                <option value="0">Không hoạt động</option>
              </select>
              {errors.status && (touchedFields.status || isSubmitted) && (
                <p className="invalid-feedback">{errors.status?.message}</p>
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

export default FormUser;
