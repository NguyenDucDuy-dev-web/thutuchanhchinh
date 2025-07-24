import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ModalPreviewWithData from "../ModalPreviewWithData/ModalPreviewWithData";
import { apiUrl, token } from "../../../../components/common/Http";
import { toast } from "react-toastify";

const ModalFillForm = ({
  show,
  onHide,
  fields,
  form_template_id,
  procedure_id,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm();

  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handlePreview = async () => {
    try {
      setLoading(true);

      const currentData = getValues();
      setFormData(currentData);

      const res = await fetch(
        `${apiUrl}procedure/form-templates/${form_template_id}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token()}`,
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const result = await res.json();
      const data = result.data;

      let fullPdfUrl;
      if (data.file_name) {
        fullPdfUrl = `${apiUrl}form-templates/file/${data.file_name}`;
      } else if (data.file_url?.startsWith("http")) {
        fullPdfUrl = data.file_url;
      } else if (data.file_url) {
        const fileName = data.file_url.split("/").pop();
        fullPdfUrl = `${apiUrl}form-templates/file/${fileName}`;
      }

      const pdfRes = await fetch(fullPdfUrl, {
        headers: {
          Authorization: `Bearer ${token()}`,
        },
      });

      if (!pdfRes.ok) throw new Error(`Failed to fetch PDF: ${pdfRes.status}`);

      const pdfBlob = await pdfRes.blob();
      const blobUrl = URL.createObjectURL(pdfBlob);

      setSelectedTemplate({
        ...data,
        pdfBlobUrl: blobUrl,
        templateId: data.id,
        // pages: data.pages || 1,
      });

      setShowPreview(true);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết mẫu thủ tục:", err);
      toast.error("Không thể tải chi tiết mẫu thủ tục. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setTimeout(() => setSelectedTemplate(null), 300);
  };

  const normalizedFields =
    fields?.map((f) => ({
      ...f.field,
      id: f.id,
      position_x: f.position_x,
      position_y: f.position_y,
      page: f.page || 1,
      width: f.width,
      height: f.height,
      defaultValue: f.defaultValue,
      input_type: f.field?.input_type,
    })) || [];

  useEffect(() => {
    normalizedFields.forEach((field) => {
      if (field.defaultValue) {
        setValue(field.name, field.defaultValue);
      }
    });
  }, [fields, setValue, normalizedFields]);

  const renderField = (field) => {
    const inputType = field.input_type?.toLowerCase();

    return (
      <Form.Group key={field.id || field.name} className="mb-3">
        <Form.Label>{field.label || field.name}</Form.Label>
        <Form.Control
          type="text"
          {...register(field.name, {
            required: field.required ? `${field.label} là bắt buộc` : false,
          })}
          defaultValue={field.defaultValue || ""}
          className={errors[field.name] ? "is-invalid" : ""}
          placeholder={`Nhập ${(field.label || field.name).toLowerCase()}`}
          readOnly={inputType === "db"}
        />
        {errors[field.name] && (
          <div className="invalid-feedback">{errors[field.name]?.message}</div>
        )}
      </Form.Group>
    );
  };

  const mappedFields = normalizedFields.map((field) => {
    const fieldName = field.name;
    const fieldValue = formData[fieldName] ?? field.defaultValue ?? "";

    return {
      id: field.id,
      name: fieldName,
      label: field.label,
      value: fieldValue,
      position_x: field.position_x,
      position_y: field.position_y,
      width: field.width,
      height: field.height,
      page: field.page,
      ...field,
    };
  });

  const onSubmit = async (data) => {
    const fieldsPayload = normalizedFields.map((field) => ({
      field_id: field.id, //  Bắt buộc
      field_name: field.name, // (nếu backend cần)
      value: data[field.name] ?? "", // Lấy giá trị người dùng nhập
    }));

    const payload = {
      procedure_id,
      fields: fieldsPayload,
    };

    try {
      const res = await fetch(`${apiUrl}procedure/submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Gửi thủ tục thành công!");
        onHide();
        reset(); 
      } else {
        toast.error("Lỗi gửi thủ tục");
        console.error(result);
      }
    } catch (err) {
      console.error("Lỗi hệ thống:", err);
      toast.error("Không thể gửi dữ liệu, vui lòng thử lại.");
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Điền thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {normalizedFields.length > 0 ? (
              normalizedFields.map(renderField)
            ) : (
              <p className="text-muted">Không có trường nào để hiển thị.</p>
            )}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <Button
                variant="secondary"
                onClick={handlePreview}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Đang tải...
                  </>
                ) : (
                  "Xem trước"
                )}
              </Button>
              <Button variant="primary" type="submit">
                Gửi
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {selectedTemplate && (
        <ModalPreviewWithData
          show={showPreview}
          onHide={handleClosePreview}
          pdfBlobUrl={selectedTemplate.pdfBlobUrl}
          placedFields={mappedFields}
          // numPages={selectedTemplate.pages}
          formData={formData}
        />
      )}
    </>
  );
};

export default ModalFillForm;
