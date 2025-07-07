import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Row, Col } from "react-bootstrap";
import logo from "../../../assets/images/logo.jpg";
import avt from "../../../assets/images/avt.jpg";
import "./Header.scss";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [sidebarOpen]);

  return (
    <>
      <header className={scrolled ? "scrolled" : ""}>
        <Navbar expand="xl" className="custom-navbar">
          <div className="custom-container">
            {/* Left Section - Logo & Hamburger */}
            <div className="left-section">
              {/* Hamburger Menu Button - Tablet/Mobile */}
              <button
                className="sidebar-toggle d-xl-none"
                onClick={toggleSidebar}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

              {/* Logo */}
              <Navbar.Brand as={Link} to="/home" className="logo-brand">
                <img src={logo} alt="logo" />
                <span className="logo-text-full d-none d-md-inline">
                  Thủ tục hành chính
                </span>
                <span className="logo-text-short d-md-none">TTHC</span>
              </Navbar.Brand>
            </div>

            {/* Desktop Navigation */}
            <Navbar.Collapse
              id="basic-navbar-nav"
              className="d-none d-xl-block"
            >
              <Nav className="mx-auto">
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <span className="nav-text">Trang chủ</span>
                </NavLink>
                <NavLink
                  to="/thutuc"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <span className="nav-text">Thủ tục</span>
                </NavLink>
                <NavLink
                  to="/tintuc"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <span className="nav-text">Tin tức</span>
                </NavLink>
                <NavLink
                  to="/hoidap"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <span className="nav-text">Hỏi đáp</span>
                </NavLink>
                <NavLink
                  to="/lienhe"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <span className="nav-text">Liên hệ</span>
                </NavLink>
              </Nav>
            </Navbar.Collapse>

            {/* Right Section - User Controls */}
            <div className="right-section">
              {/* User section - Desktop */}
              <div className="user-section d-none d-xl-flex">
                <div className="notification-icon">
                  <i className="bi bi-bell-fill"></i>
                </div>
                <div className="user-info">
                  <img src={avt} alt="avatar" className="user-avatar" />
                  <span className="username">Đức Duy</span>
                  <i className="bi bi-chevron-down"></i>
                </div>
                <div className="setting-icon">
                  <i className="bi bi-gear-fill"></i>
                </div>
              </div>

              {/* User section - Tablet */}
              <div className="user-section-tablet d-none d-md-flex d-xl-none">
                <div className="notification-icon">
                  <i className="bi bi-bell-fill"></i>
                </div>
                <div className="user-info">
                  <img src={avt} alt="avatar" className="user-avatar" />
                  <span className="username">Đức Duy</span>
                  <i className="bi bi-chevron-down"></i>
                </div>
                <div className="setting-icon">
                  <i className="bi bi-gear-fill"></i>
                </div>
              </div>

              {/* User section - Mobile (Only Settings) */}
              <div className="user-section-mobile d-md-none">
                <div className="setting-icon">
                  <i className="bi bi-gear-fill"></i>
                </div>
              </div>
            </div>
          </div>
        </Navbar>
      </header>

      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar Menu */}
      <div className={`sidebar-menu ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={logo} alt="logo" />
            <span>Thủ tục hành chính</span>
          </div>
          <button className="sidebar-close" onClick={closeSidebar}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `sidebar-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/thutuc"
            className={({ isActive }) =>
              `sidebar-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Thủ tục
          </NavLink>
          <NavLink
            to="/tintuc"
            className={({ isActive }) =>
              `sidebar-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Tin tức
          </NavLink>
          <NavLink
            to="/hoidap"
            className={({ isActive }) =>
              `sidebar-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Hỏi đáp
          </NavLink>
          <NavLink
            to="/lienhe"
            className={({ isActive }) =>
              `sidebar-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            Liên hệ
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <img src={avt} alt="avatar" className="sidebar-user-avatar" />
            <div className="sidebar-user-info">
              <span className="sidebar-username">Đức Duy</span>
              <span className="sidebar-user-role">Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
