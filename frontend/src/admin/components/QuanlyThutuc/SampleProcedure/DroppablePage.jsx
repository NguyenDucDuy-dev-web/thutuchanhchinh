import React, { useRef } from "react";
import { Page } from "react-pdf";
import { useDrop } from "react-dnd";

const DroppablePage = ({
  pageNumber,
  width,
  onFieldDropped,
  fieldsOnPage = [],
  selectedField,
  onFieldSelect,
  onFieldDelete,
  isPreview = false,
}) => {
  const pageRef = useRef(null);

  // Chỉ sử dụng useDrop khi không phải chế độ preview
  const dropResult = !isPreview ? useDrop({
    accept: "FIELD",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const pageBox = pageRef.current.getBoundingClientRect();

      const x = offset.x - pageBox.left;
      const y = offset.y - pageBox.top;

      onFieldDropped({
        field: item,
        page: pageNumber,
        x,
        y,
      });
    },
  }) : [null, null];

  const [, drop] = dropResult;

  const handleFieldClick = (e, field) => {
    e.stopPropagation();
    if (isPreview) return;
    onFieldSelect?.(field.id);
  };

  const handleFieldDoubleClick = (e, field) => {
    e.stopPropagation();
    if (isPreview) return; 
    if (
      window.confirm(`Bạn có muốn xóa trường "${field.field_label || field.field?.label}" không?`)
    ) {
      onFieldDelete?.(field.id);
    }
  };

  return (
    <div
      ref={(node) => {
        pageRef.current = node;
        if (!isPreview && drop && node) {
          drop(node);
        }
      }}
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

      {/* Các trường đã thả trên trang */}
      {fieldsOnPage.map((item) => {
        const isSelected = selectedField === item.id;
        const fieldLabel = item.field?.label || item.field_label || 'Field';


        return (
          <div
            key={item.id}
            style={{
              position: "absolute",
              top: item.position_y || item.y,
              left: item.position_x || item.x,
              background: isSelected ? "#dc3545" : "#0d6efd",
              color: "#fff",
              padding: "4px 8px",
              fontSize: "12px",
              borderRadius: "4px",
              cursor: isPreview ? "default" : "pointer",
              border: isSelected ? "2px solid #fff" : "none",
              boxShadow: isSelected
                ? "0 0 10px rgba(220, 53, 69, 0.5)"
                : "none",
              userSelect: "none",
              minWidth: "60px",
              textAlign: "center",
              transition: "all 0.2s ease",
              zIndex: isSelected ? 1000 : 100,
            }}
            onClick={(e) => handleFieldClick(e, item)}
            onDoubleClick={(e) => handleFieldDoubleClick(e, item)}
            title={isPreview ? fieldLabel : `${fieldLabel} - Nhấp để chọn, nhấp đúp để xóa`}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span>{fieldLabel}</span>
              {isSelected && !isPreview && (
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    marginLeft: "4px",
                    padding: "0",
                    fontSize: "10px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFieldDelete?.(item.id);
                  }}
                  title="Xóa trường"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DroppablePage;