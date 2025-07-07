// components/FieldItem/FieldItem.jsx
import React from "react";
import { useDrag } from "react-dnd";

const FieldItem = ({ field, editMode, onEdit, onDelete }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "FIELD",
    item: { ...field },
    canDrag: () => !editMode,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className={`field-item d-flex align-items-center justify-content-between p-2 mb-2 border rounded ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="d-flex align-items-center field-item__box">
        <i className={`bi ${field.icon} me-2`}></i>
        <div>
          <div className="field-item__label fw-medium">{field.label}</div>
          <div className="field-item__type text-muted text-xs">
            {field.name}
          </div>
        </div>
      </div>

      {editMode ? (
        <div className="d-flex gap-2">
          <i
            className="bi bi-pencil cursor-pointer text-icon-edit"
            onClick={() => onEdit(field)}
          ></i>
          <i
            className="bi bi-trash cursor-pointer text-icon-delete"
            onClick={() => onDelete(field)}
          ></i>
        </div>
      ) : (
        <i className="bi bi-arrows-move text-icon-move"></i>
      )}
    </div>
  );
};

export default FieldItem;
