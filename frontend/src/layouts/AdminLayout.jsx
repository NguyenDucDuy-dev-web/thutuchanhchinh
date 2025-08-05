import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { Outlet } from "react-router-dom";
import './AdminLayout.scss'
import Topbar from "../admin/components/Dashboard/Topbar/Topbar";
import Sidebar from "../admin/components/Sidebar/Sidebar";


const AdminLayout = () => {
  const [isMenuOpen, setisMenuOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setShowMobileSidebar(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  
  const closeMobileSidebar = () => {
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  };

  return (
    <>
      <main className={`Home-admin-page`}>
        <Container fluid className="Homepage_container p-0">
          <div className="d-flex">
            <Sidebar 
              isMenuOpen={isMenuOpen} 
              setisMenuOpen={setisMenuOpen}
              isMobile={isMobile}
              showMobileSidebar={showMobileSidebar}
              closeMobileSidebar={closeMobileSidebar}
            />

            <div className={`main-content-box ${isMenuOpen ? "" : "open"}`}>
              <Topbar
                isMenuOpen={isMenuOpen} 
                setisMenuOpen={setisMenuOpen}
                isMobile={isMobile}
                toggleMobileSidebar={toggleMobileSidebar}
              />

              <div className="content">
                <Outlet />
              </div>
            </div>
          </div>
        </Container>

        
        {isMobile && showMobileSidebar && (
          <div 
            className="mobile-overlay" 
            onClick={closeMobileSidebar}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998
            }}
          />
        )}
      </main>
    </>
  );
};

export default AdminLayout;