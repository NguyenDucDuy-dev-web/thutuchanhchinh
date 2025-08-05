import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "../FormUser/FormUser.scss";
import { apiUrl, token } from "../../../../components/common/Http";
const ModalEditUser = ({ show, onHide, user, onUserUpdated }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        password: "",
        status: user.status?.toString() || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const updateData = {};
      if (data.name) updateData.name = data.name;
      if (data.email) updateData.email = data.email;
      if (data.password) updateData.password = data.password;
      if (data.status !== "") updateData.status = parseInt(data.status);

      const res = await fetch(`${apiUrl}user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(updateData),
      });
      const result = await res.json();

      if (result.status == true) {
        toast.success(result.message || "Cập nhật người dùng thành công");
        onHide();
        onUserUpdated();
      } else {
        toast.error(result.message || "Cập nhật người dùng thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Modal show={show} onHide={onHide} style={{ fontFamily: 'Roboto, sans-serif' }}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa người dùng</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="form-box">
            <div className="form-content">
              <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="name">Tên:</label>
                <div className="input-group">
                  <input
                    {...register("name", {
                      required: "Vui lòng nhập tên người dùng",
                    })}
                    type="text"
                    id="name"
                    className={`form-control ${errors.name && "is-invalid"}`}
                    placeholder="Nhập tên người dùng"
                  />
                  {errors.name && (
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
                    type="email"
                    id="email"
                    className={`form-control ${errors.email && "is-invalid"}`}
                    placeholder="Nhập email"
                  />
                  {errors.email && (
                    <p className="invalid-feedback">{errors.email?.message}</p>
                  )}
                </div>
                <label htmlFor="password">
                  Mật khẩu (để trống nếu không thay đổi):
                </label>
                <div className="input-group">
                  <input
                    {...register("password", {
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    })}
                    type="password"
                    id="password"
                    className={`form-control ${
                      errors.password && "is-invalid"
                    }`}
                    placeholder="Nhập mật khẩu mới"
                  />
                  {errors.password && (
                    <p className="invalid-feedback">
                      {errors.password?.message}
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
                    <option value="1">Hoạt động</option>
                    <option value="0">Không hoạt động</option>
                  </select>
                  {errors.status && (
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
    </>
  );
};

export default ModalEditUser;
