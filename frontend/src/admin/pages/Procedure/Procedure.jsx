import React, { useState } from "react";
import "./Procedure.scss";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import FieldsNeccessary from "../../components/QuanlyThutuc/FieldsNeccessary/FieldsNeccessary";
import SampleProcedure from "../../components/QuanlyThutuc/SampleProcedure/SampleProcedure";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BreadcrumbComponent from "../../../components/common/Breadcrumb/BreadcrumbComponent";

const Procedure = () => {
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditModeChange = (newEditMode) => {
    setIsEditMode(newEditMode);
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <section className="user-section py-3 px-3">
          <BreadcrumbComponent/>

          {/* Status indicator */}
          {isEditMode && (
            <div className="alert alert-info alert-dismissible fade show mb-3" role="alert">
              <i className="bi bi-info-circle me-2"></i>
              <strong>Chế độ chỉnh sửa:</strong> Bạn đang ở chế độ chỉnh sửa trường dữ liệu. 
              Không thể kéo thả trong chế độ này.
            </div>
          )}

          <Row className="align-items-stretch g-3">
            {/* Các trường dữ liệu */}
            <FieldsNeccessary onEditModeChange={handleEditModeChange} />

            {/* Mẫu thủ tục */}
            <SampleProcedure />
          </Row>

          {/* Help text */}
          <Row className="mt-3">
            <Col xs={12}>
              <div className="card border-0 bg-light">
                <div className="card-body py-2">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-lightbulb text-warning me-2"></i>
                    <small className="text-muted mb-0">
                      <strong>Hướng dẫn:</strong> Tải lên file PDF mẫu thủ tục, sau đó kéo các trường dữ liệu 
                      từ bên trái vào vị trí mong muốn trên PDF. Nhấp vào trường đã thả để chỉnh sửa thuộc tính.
                    </small>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </section>
      </DndProvider>
    </>
  );
};

export default Procedure;