import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { apiUrl, token } from "../../../../../components/common/Http";
import "./ModalEditProcess.scss";

const ModalEditProcess = ({
  show,
  onHide,
  process,
  fetchProcedureProcess,
}) => {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm({
    defaultValues: {
      name: "",
      steps: [{ name: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  useEffect(() => {
    if (!process) return;

    reset({
      name: process.name || "",
      steps: process.steps && process.steps.length > 0 
        ? process.steps.map(step => ({
            name: step.name || "",
            description: step.description || "",
            id: step.id || null, 
            step_order: step.step_order || null
          }))
        : [{ name: "", description: "" }]
    });
  }, [process, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const updateData = {
        name: data.name,
        steps: data.steps.map((step, index) => ({
          ...step,
          step_order: index + 1 
        }))
      };

      console.log("Update data:", updateData);
      
      const response = await fetch(`${apiUrl}procedure/process/${process.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.status === true) {
        toast.success(result.message || "Cập nhật quy trình thành công");
        onHide();
        fetchProcedureProcess();
      } else {
        toast.error(result.message || "Cập nhật quy trình thất bại");
      }
    } catch (error) {
      console.error("Error updating process:", error);
      toast.error("Có lỗi xảy ra: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (process) {
      reset({
        name: process.name || "",
        steps: process.steps && process.steps.length > 0 
          ? process.steps.map(step => ({
              name: step.name || "",
              description: step.description || "",
              id: step.id || null,
              step_order: step.step_order || null
            }))
          : [{ name: "", description: "" }]
      });
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        className="modal-edit-process"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa quy trình</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="form-box">
            <div className="form-content">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Tên quy trình */}
                <label htmlFor="name">Tên quy trình:</label>
                <div className="input-group">
                  <input
                    {...register("name", {
                      required: "Vui lòng nhập tên quy trình",
                    })}
                    className={`form-control ${errors.name && "is-invalid"}`}
                    type="text"
                    id="name"
                    placeholder="Nhập tên quy trình"
                  />
                  {errors.name && (touchedFields.name || isSubmitted) && (
                    <p className="invalid-feedback">{errors.name?.message}</p>
                  )}
                </div>

                {/* Danh sách các bước */}
                <label className="mt-3">Danh sách các bước xử lý:</label>
                <div className="steps-container">
                  {fields.map((field, index) => (
                    <div className="step-item" key={field.id}>
                      <div className="step-header">
                        <h6>Bước {index + 1}</h6>
                        <div className="step-actions">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                            title="Xóa bước"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success"
                            onClick={() => append({ name: "", description: "" })}
                            title="Thêm bước mới"
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>

                      <div className="input-group">
                        <input
                          {...register(`steps.${index}.name`, {
                            required: "Vui lòng nhập tên bước",
                          })}
                          className={`form-control ${
                            errors.steps?.[index]?.name && "is-invalid"
                          }`}
                          placeholder="Tên bước xử lý"
                        />
                        {errors.steps?.[index]?.name && (
                          <p className="invalid-feedback">
                            {errors.steps[index].name.message}
                          </p>
                        )}
                      </div>

                      <div className="input-group">
                        <textarea
                          {...register(`steps.${index}.description`, {
                            required: "Vui lòng nhập mô tả bước",
                          })}
                          className={`form-control ${
                            errors.steps?.[index]?.description && "is-invalid"
                          }`}
                          placeholder="Mô tả chi tiết bước xử lý"
                          rows="3"
                        />
                        {errors.steps?.[index]?.description && (
                          <p className="invalid-feedback">
                            {errors.steps[index].description.message}
                          </p>
                        )}
                      </div>

                      {/* Hidden fields để giữ ID và step_order */}
                      <input 
                        type="hidden" 
                        {...register(`steps.${index}.id`)} 
                      />
                      <input 
                        type="hidden" 
                        {...register(`steps.${index}.step_order`)} 
                      />
                    </div>
                  ))}
                </div>

                {/* Nút thêm bước nếu chưa có bước nào */}
                {fields.length === 0 && (
                  <div className="no-steps-container">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => append({ name: "", description: "" })}
                    >
                      <i className="bi bi-plus me-1"></i>
                      Thêm bước đầu tiên
                    </button>
                  </div>
                )}

                <div className="btn-group">
                  <button
                    type="button"
                    className="btn-reset w-100"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-repeat me-1"></i>
                    <span className="reset">Làm mới</span>
                  </button>
                  <button
                    type="submit"
                    className="btn-add w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm text-light me-1" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="add">Đang cập nhật...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-floppy-fill me-1"></i>
                        <span className="add">Cập nhật</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalEditProcess;