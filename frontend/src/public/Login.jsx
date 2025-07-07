import React, { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import { Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../components/common/Http";
import { AuthContext } from "../components/context/Auth";
import "./Login.scss";
import anhlogin from "../assets/images/anhlogin.jpg";
import logo from "../assets/images/logo.jpg";
const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const res = await fetch(apiUrl + "authenticate", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.status == false) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        const userInfo = {
          id: result.id,
          token: result.token,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        login(userInfo);

        const meRes = await fetch(apiUrl + "me", {
          headers: {
            Authorization: `Bearer ${result.token}`,
          },
        });

        const me = await meRes.json();

        if (me.role === 0) {
          navigate("/homeadmin");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <Container fluid className="p-0">
        <Row className="login-wrapper align-items-stretch">
          <Col md={6} className="login-left p-0">
            <img src={anhlogin} alt="Login Illustration" />
          </Col>

          <Col md={6} className="login-right">
            <div className="login-box">
              <div className="login-header text-center">
                <h3>
                  TRƯỜNG ĐẠI HỌC
                  <br />
                  <span>KỸ THUẬT - CÔNG NGHỆ CẦN THƠ</span>
                </h3>
                <img src={logo} alt="CTUT Logo" className="logo" />
                <h2>ĐĂNG NHẬP HỆ THỐNG</h2>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="username">Tên đăng nhập:</label>
                <div className={"input-group"}>
                  <input
                    {...register("email", {
                      required: "Vui lòng điền tài khoản",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Vui lòng nhập email đúng định dạng",
                      },
                    })}
                    type="text"
                    id="username"
                    placeholder="Nhập tên đăng nhập"
                    className={`form-control ${errors.email && "is-invalid"}`}
                  />
                  {errors.email && (
                    <p className="invalid-feedback">{errors.email?.message}</p>
                  )}
                </div>

                <label htmlFor="password">Mật khẩu:</label>
                <div className="input-group">
                  <input
                    {...register("password", {
                      required: "Vui lòng nhập mật khẩu",
                    })}
                    type="password"
                    id="password"
                    placeholder="Nhập mật khẩu"
                    className={`form-control ${
                      errors.password && "is-invalid"
                    }`}
                  />
                  {errors.password && (
                    <p className="invalid-feedback">
                      {errors.password?.message}
                    </p>
                  )}
                  {/* <i className="fa-solid fa-eye toggle-password"></i> */}
                </div>

                <div className="form-group">
                  <label htmlFor="captcha">Mã captcha:</label>
                  <div className="captcha-group">
                    <input
                      type="text"
                      id="captcha"
                      placeholder="Nhập mã captcha"
                    />

                    <div className="captcha-box">
                      <img src="/captcha-image-url" alt="captcha" />
                      <button
                        type="button"
                        className="refresh-captcha"
                        title="Làm mới captcha"
                      >
                        🔄
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div
                        className="spinner-border spinner-border-sm text-light me-1"
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
                    "Đăng nhập"
                  )}
                </button>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Login;
