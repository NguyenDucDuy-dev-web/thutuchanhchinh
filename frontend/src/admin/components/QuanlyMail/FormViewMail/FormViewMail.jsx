import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { apiUrl, token } from "../../../../components/common/Http";

const FormViewMail = ({ onChangeTemplate }) => {
  const {
    register,
    setValue,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm({ mode: "onTouched" });

  const [mailTemplates, setMailTemplates] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [previewContent, setPreviewContent] = useState("");

  // Hàm chuyển đổi HTML thành plain text có format
  const htmlToPlainText = (html) => {
    if (!html) return "";
    
    // Tạo một div tạm để parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    
    // Lấy text content và giữ lại line breaks
    let text = tempDiv.innerText || tempDiv.textContent || "";
    
    return text;
  };

  const fetchMailTemplates = async () => {
    try {
      const res = await fetch(apiUrl + "mailTemplate", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });
      const result = await res.json();
      if (result.status) {
        setMailTemplates(result.data);
      } else {
        toast.error("Không thể tải mẫu mail");
      }
    } catch (error) {
      toast.error("Lỗi khi tải mẫu mail: " + error.message);
    }
  };

  const handleSelectChange = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    const template = mailTemplates.find((t) => t.id === parseInt(id));

    if (template) {
      setValue("name", template.name);
      setValue("subject", template.subject);
      
      // Chuyển đổi HTML content thành plain text
      const plainTextContent = htmlToPlainText(template.content);
      setValue("content", plainTextContent);
      setPreviewContent(plainTextContent);
      
      if (onChangeTemplate) {
        // Truyền cả id và template object
        onChangeTemplate(template.id, template);
      }
    } else {
      setValue("name", "");
      setValue("subject", "");
      setValue("content", "");
      setPreviewContent("");
      if (onChangeTemplate) {
        onChangeTemplate(null, null);
      }
    }
  };

  useEffect(() => {
    fetchMailTemplates();
  }, []);

  return (
    <div className="form-box">
      <div className="form-title">
        <span>Xem trước mẫu Mail</span>
      </div>

      <div className="form-content">
        <form>
          <label htmlFor="mailTemplateSelect">Chọn mẫu Mail:</label>
          <div className="input-group">
            <select
              id="mailTemplateSelect"
              className="form-select"
              value={selectedId}
              onChange={handleSelectChange}
            >
              <option value="">-- Chọn mẫu mail --</option>
              {mailTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <label htmlFor="name">Tên Email:</label>
          <div className="input-group">
            <input
              {...register("name")}
              className="form-control"
              type="text"
              id="name"
              disabled
            />
          </div>

          <label htmlFor="subject">Tiêu đề:</label>
          <div className="input-group">
            <input
              {...register("subject")}
              className="form-control"
              type="text"
              id="subject"
              disabled
            />
          </div>

          <label htmlFor="content">Nội dung:</label>
          <div className="input-group">
            <textarea
              {...register("content")}
              className="form-control"
              id="content"
              rows={10}
              disabled
              value={previewContent}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormViewMail;  