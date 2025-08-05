import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./FormAddMail.scss";
import { toast } from "react-toastify";
import { apiUrl, token } from "../../../../components/common/Http";

const FormAddMail = ({ selectedMail, fetchMail, setSelectedMail }) => {
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
  const [loading, setLoading] = useState(false);
  const contentEditableRef = useRef(null);

  //   const onSubmit = async (data) => {
  //     console.log("Form data:", data);
  //     setLoading(true);
  //     try {
  //       const res = await fetch(apiUrl + "mailTemplate", {
  //         method: "POST",
  //         headers: {
  //           "Content-type": "application/json",
  //           Accept: "application/json",
  //           Authorization: `Bearer ${token()}`,
  //         },
  //         body: JSON.stringify(data),
  //       });
  //       const result = await res.json();
  //       if (result.status === true) {
  //         toast.success(result.message || "Thêm mẫu Mail thành công");
  //         reset();
  //       } else {
  //         toast.error(result.message || "Thêm mẫu Mail thất bại");
  //       }
  //     } catch (error) {
  //       toast.error("Có lỗi xảy ra: " + error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // Rich text editor functions

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const method = selectedMail ? "PUT" : "POST";
      const url = selectedMail
        ? `${apiUrl}mailTemplate/${selectedMail.id}`
        : `${apiUrl}mailTemplate`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.status) {
        toast.success(result.message || "Lưu thành công");
        reset();
        if (contentEditableRef.current)
          contentEditableRef.current.innerHTML = "";
        setSelectedMail(null); // Reset trạng thái sửa
        fetchMail(); // Load lại danh sách
      } else {
        toast.error(result.message || "Thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    updateFormValue();
  };

  const changeFontFamily = (fontFamily) => {
    document.execCommand("fontName", false, fontFamily);
    updateFormValue();
  };

  const changeTextColor = (color) => {
    document.execCommand("foreColor", false, color);
    updateFormValue();
  };
  const insertList = (type) => {
    document.execCommand(
      type === "ordered" ? "insertOrderedList" : "insertUnorderedList"
    );
    updateFormValue();
  };

  const updateFormValue = () => {
    if (contentEditableRef.current) {
      setValue("content", contentEditableRef.current.innerHTML);
    }
  };

  const handleContentChange = () => {
    updateFormValue();
  };

  const handleReset = () => {
    reset();
    if (contentEditableRef.current) {
      contentEditableRef.current.innerHTML = "";
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    updateFormValue();
  };

  useEffect(() => {
    if (selectedMail) {
      setValue("name", selectedMail.name || "");
      setValue("subject", selectedMail.subject || "");
      setValue("content", selectedMail.content || "");
      if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = selectedMail.content || "";
      }
    }
  }, [selectedMail]);

  return (
    <div className="form-box-mail">
      <div className="form-title-mail">
        <span>{selectedMail ? "Chỉnh sửa mẫu Mail" : "Thêm mẫu Mail"}</span>
      </div>
      <div className="form-content-mail">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name">Tên Email:</label>
          <div className="input-group">
            <input
              {...register("name", {
                required: "Vui lòng nhập tiêu đề",
              })}
              className={`form-control ${errors.name && "is-invalid"}`}
              type="text"
              id="name"
              placeholder="Nhập tiêu đề"
            />
            {errors.name && (touchedFields.name || isSubmitted) && (
              <p className="invalid-feedback">{errors.name?.message}</p>
            )}
          </div>

          <label htmlFor="subject">Tiêu đề:</label>
          <div className="input-group">
            <input
              {...register("subject", {
                required: "Vui lòng tiêu đề",
              })}
              className={`form-control ${errors.subject && "is-invalid"}`}
              type="text"
              id="subject"
              placeholder="Nhập tiêu đề"
            />
            {errors.subject && (touchedFields.subject || isSubmitted) && (
              <p className="invalid-feedback">{errors.subject?.message}</p>
            )}
          </div>

          <label htmlFor="content">Nội dung:</label>
          <div className="input-group">
            {/* Rich Text Editor Toolbar */}
            <div className="rich-editor-toolbar">
              {/* Font Family */}
              <select
                onChange={(e) => changeFontFamily(e.target.value)}
                className="font-select"
                defaultValue=""
              >
                <option value="">Font chữ</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Impact">Impact</option>
                <option value="Tahoma">Tahoma</option>
              </select>

              <div className="toolbar-divider"></div>

              {/* Format buttons */}
              <button
                type="button"
                onClick={() => formatText("bold")}
                className="format-btn bold"
                title="In đậm (Ctrl+B)"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => formatText("italic")}
                className="format-btn italic"
                title="In nghiêng (Ctrl+I)"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => formatText("underline")}
                className="format-btn underline"
                title="Gạch chân (Ctrl+U)"
              >
                U
              </button>

              <div className="toolbar-divider"></div>

              {/* Text color */}
              <div className="color-picker-container">
                <input
                  type="color"
                  onChange={(e) => changeTextColor(e.target.value)}
                  className="color-input"
                  title="Màu chữ"
                  defaultValue="#000000"
                />
              </div>

              <div className="toolbar-divider"></div>

              {/* Alignment */}
              <button
                type="button"
                onClick={() => formatText("justifyLeft")}
                className="format-btn"
                title="Canh trái"
              >
                ⬅
              </button>
              <button
                type="button"
                onClick={() => formatText("justifyCenter")}
                className="format-btn"
                title="Canh giữa"
              >
                ↔
              </button>
              <button
                type="button"
                onClick={() => formatText("justifyRight")}
                className="format-btn"
                title="Canh phải"
              >
                ➡
              </button>

              <div className="toolbar-divider"></div>

              {/* Lists */}
              <button
                type="button"
                onClick={() => insertList("unordered")}
                className="format-btn"
                title="Danh sách dấu chấm"
              >
                •
              </button>
              <button
                type="button"
                onClick={() => insertList("ordered")}
                className="format-btn"
                title="Danh sách số"
              >
                1.
              </button>

              <div className="toolbar-divider"></div>

              {/* Undo/Redo */}
              <button
                type="button"
                onClick={() => formatText("undo")}
                className="format-btn"
                title="Hoàn tác (Ctrl+Z)"
              >
                ↶
              </button>
              <button
                type="button"
                onClick={() => formatText("redo")}
                className="format-btn"
                title="Làm lại (Ctrl+Y)"
              >
                ↷
              </button>
            </div>

            {/* Hidden input for form registration */}
            <input
              {...register("content", {
                required: "Vui lòng nhập nội dung",
              })}
              type="hidden"
            />

            {/* Content editable area */}
            <div
              ref={contentEditableRef}
              contentEditable
              suppressContentEditableWarning={true}
              onInput={handleContentChange}
              onPaste={handlePaste}
              className={`rich-editor-content form-control ${
                errors.content && "is-invalid"
              }`}
              data-placeholder="Nhập nội dung email tại đây..."
            />

            {errors.content && (touchedFields.content || isSubmitted) && (
              <p className="invalid-feedback">{errors.content?.message}</p>
            )}
          </div>

          <div className="btn-group">
            <button
              type="button"
              className="btn-reset w-100"
              disabled={loading}
              onClick={handleReset}
            >
              <i className="bi bi-arrow-repeat me-1"></i>
              <span className="reset">Làm mới</span>
            </button>

            <button type="submit" className="btn-add w-100" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm text-light">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </>
              ) : (
                <>
                  <i className="bi bi-floppy-fill me-1"></i>
                  <span className="add">
                    {selectedMail ? "Cập nhật" : "Thêm"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAddMail;
