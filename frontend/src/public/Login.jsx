import React, { useContext, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/Auth";
import "./Login.scss";
import anhlogin from "../assets/images/anhlogin.jpg";
import logo from "../assets/images/logo.jpg";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [captchaImage, setCaptchaImage] = useState("");

  const fetchCaptcha = async () => {
    try {
      const res = await fetch("http://localhost:8000/captcha", {
        credentials: "include",
      });

      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setCaptchaImage(data.captcha);
      } else {
        const blob = await res.blob();
        const imageUrl = URL.createObjectURL(blob);
        setCaptchaImage(imageUrl);
      }
    } catch (error) {
      toast.error("Không thể tải captcha");
    }
  };

  useEffect(() => {
    fetchCaptcha();
    return () => {
      if (captchaImage && captchaImage.startsWith("blob:")) {
        URL.revokeObjectURL(captchaImage);
      }
    };
  }, []);

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

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // 1. Lấy CSRF token trước
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      // 2. Lấy CSRF token từ cookie
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      };

      const csrfToken = decodeURIComponent(getCookie("XSRF-TOKEN") || "");

      // 3. Gửi login request
      const res = await fetch("http://localhost:8000/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();

      if (!result.status) {
        toast.error(result.message || "Lỗi đăng nhập");
        fetchCaptcha();
        return;
      }

      toast.success("Đăng nhập thành công");
      // 4. Lưu token
      const userInfo = {
        id: result.id,
        token: result.token,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      login(userInfo);

      // 5. Gọi API lấy thông tin user
      const meRes = await fetch("http://localhost:8000/api/me", {
        headers: {
          Authorization: `Bearer ${result.token}`,
          Accept: "application/json",
        },
      });
      const me = await meRes.json();

      if (me.role === 0) navigate("/homeadmin");
      else navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Lỗi kết nối hệ thống");
      fetchCaptcha();
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
                  {errors.email && (touchedFields.email || isSubmitted) && (
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
                  {errors.password && (touchedFields.password || isSubmitted) && (
                    <p className="invalid-feedback">
                      {errors.password?.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="captcha">Mã captcha:</label>
                  <div className="captcha-group">
                    <input
                      {...register("captcha", {
                        required: "Vui lòng nhập mã captcha",
                      })}
                      type="text"
                      id="captcha"
                      placeholder="Nhập mã captcha"
                    />
                    {errors.captcha && (touchedFields.captcha || isSubmitted) && (
                      <p className="invalid-feedback">
                        {errors.captcha?.message}
                      </p>
                    )}

                    <div className="captcha-box">
                      {captchaImage && <img src={captchaImage} alt="captcha" />}
                      <button
                        type="button"
                        className="refresh-captcha"
                        onClick={fetchCaptcha}
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
