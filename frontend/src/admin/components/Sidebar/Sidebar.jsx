import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo.jpg";
import { menuData } from "../../../components/common/SidebarData/breadcrumbUtils";

const Sidebar = ({
  isMenuOpen,
  setisMenuOpen,
  isMobile,
  showMobileSidebar,
  closeMobileSidebar,
}) => {
  const [activeMenu, setactiveMenu] = useState([]);

  const toggleMenu = (id) => {
    setactiveMenu((prevactiveMenu) => {
      if (prevactiveMenu.includes(id)) {
        return prevactiveMenu.filter((menuId) => menuId !== id);
      } else {
        return [...prevactiveMenu, id];
      }
    });
  };

  const handleLinkClick = () => {
    if (isMobile) {
      closeMobileSidebar();
    }
  };

  const getSidebarClasses = () => {
    let classes = "sidebar_box";

    if (!isMobile) {
      classes += isMenuOpen ? "" : " close";
    } else {
      classes += showMobileSidebar ? " mobile-open" : "";
      if (!isMenuOpen) {
        classes += " close";
      }
    }

    return classes;
  };

  return (
    <>
      <div className={getSidebarClasses()}>
        <div className="header_sidebar">
          <div className="logo_wrapper">
            <Link to="/homeadmin" onClick={handleLinkClick}>
              <img src={logo} alt="logo" className="sidebar_logo" />
            </Link>
          </div>
          <span className="sidebar_title">Thủ tục hành chính</span>
        </div>

        <div className="content_sidebar">
          <ul className="sidebar_menu">
            {menuData.map((menu) => (
              <li key={menu.id} className="sidebar_item">
                <div
                  className="sidebar_link"
                  onClick={() => toggleMenu(menu.id)}
                >
                  <i className={menu.icon}></i>
                  <span className="sidebar_text">{menu.title}</span>
                  <i
                    className={`sidebar_arrow bi bi-chevron-down ${
                      activeMenu.includes(menu.id) ? "rotate" : ""
                    }`}
                  ></i>
                </div>
                {activeMenu.includes(menu.id) && (
                  <ul className="sidebar_submenu">
                    {menu.submenu.map((item) => (
                      <Link
                        key={item.id}
                        to={item.path}
                        className="sidebar_sublink"
                        onClick={handleLinkClick}
                      >
                        <li className="sidebar_subitem">
                          <i className={item.icon}></i>
                          <span className="sidebar_subtext">{item.title}</span>
                        </li>
                      </Link>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;