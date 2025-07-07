import React from "react";
import './Topbar.scss';
import avt from "../../../../assets/images/avt.jpg"
const Topbar = ({ 
  isMenuOpen, 
  setisMenuOpen, 
  isMobile, 
  toggleMobileSidebar 
}) => {
  
  const handleToggleClick = () => {
    if (isMobile) {
      toggleMobileSidebar();
    } else {
      setisMenuOpen(!isMenuOpen);
    }
  };

  return (
    <>
      <div className="topbar d-flex">
        <div className="toggle" onClick={handleToggleClick}>
          <i className="bi bi-filter-left"></i>
        </div>
        <div className="notification_avt">
          <i className="bi bi-bell-fill"></i>
          <div className="avt-wrapper">
            <img src={avt} alt="avt" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
