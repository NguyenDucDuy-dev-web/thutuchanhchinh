import React, { useRef } from "react";
import { Page } from "react-pdf";

const DroppablePreviewPage = ({
  pageNumber,
  width,
  fieldsOnPage = [],
  formData,
}) => {
  const pageRef = useRef(null);


  return (
    <div
      ref={pageRef}
      style={{
        width,
        position: "relative",
        marginBottom: "20px",
      }}
    >
      <Page
        pageNumber={pageNumber}
        width={width}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />

      {fieldsOnPage.map((field, index) => {
        const fieldName = field.name || field.field_name;
        const fieldLabel = field.label || field.field?.label || field.field_label || fieldName;
        const value = formData?.[fieldName] || field.value || field.defaultValue || "";
        const posX = field.position_x || field.x || 0;
        const posY = field.position_y || field.y || 0;
        
        return (
          <div
            key={field.id || index}
            style={{
              position: "absolute",
              top: posY,  
              left: posX, 
              background: "none",
              color: "#000000",
              padding: "4px 8px",
              userSelect: "none",
              minWidth: "60px",
              textAlign: "center",
              zIndex: 100,
              fontWeight: "bold",
              fontSize: "14px",
            }}
            title={`Field: ${fieldLabel} | Value: ${value || 'Empty'} | Position: (${posX}px, ${posY}px)`}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span>{value || fieldLabel}</span>
            </div>
          </div>
        );
      })}



      {fieldsOnPage.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(255, 0, 0, 0.8)",
            color: "white",
            padding: "10px",
            fontSize: "14px",
            fontWeight: "bold",
            zIndex: 20,
          }}
        >
          No fields on this page
        </div>
      )}
    </div>
  );
};

export default DroppablePreviewPage;