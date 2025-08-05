import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiUrl, token } from "../../../../../components/common/Http";
import "./FormAddProcess.scss";

const FormAddProcess = ({fetchProcedureProcess}) => {
  const navigate = useNavigate();
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

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}procedure/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      if (res.status) {
        toast.success("Tạo quy trình thành công");
        reset();
        fetchProcedureProcess();
      } else {
        toast.error("Có lỗi xảy ra khi tạo");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-box">
      <div className="form-title">
        <span>Thêm quy trình xử lý</span>
      </div>
      <div className="form-content">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Tên quy trình */}
          <label htmlFor="name">Tên quy trình:</label>
          <div className="input-group">
            <input
              {...register("name", { required: "Vui lòng nhập tên quy trình" })}
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
          {fields.map((field, index) => (
            <div className="step-item" key={field.id}>
              <div className="input-group mb-2">
                <input
                  {...register(`steps.${index}.name`, {
                    required: "Vui lòng nhập tên bước",
                  })}
                  className={`form-control ${
                    errors.steps?.[index]?.name && "is-invalid"
                  }`}
                  placeholder={`Bước ${index + 1}: Tên bước`}
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
                  placeholder="Mô tả bước xử lý"
                />
                {errors.steps?.[index]?.description && (
                  <p className="invalid-feedback">
                    {errors.steps[index].description.message}
                  </p>
                )}
              </div>
              <div className="deleteAdd-box">
                <div className="btn-group deleteAdd">
                  <button
                    type="button"
                    className="btn btn-deleteSteps"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    Xoá bước
                  </button>

                  <button
                    type="button"
                    className="btn btn-addSteps"
                    onClick={() => append({ name: "", description: "" })}
                  >
                    Thêm bước
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="btn-group">
            <button type="reset" className="btn-reset w-100" disabled={loading}>
              <i className="bi bi-arrow-repeat me-1"></i>
              <span className="reset">Làm mới</span>
            </button>
            <button type="submit" className="btn-add w-100" disabled={loading}>
              {loading ? (
                <div
                  className="spinner-border spinner-border-sm text-light"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <>
                  <i className="bi bi-floppy-fill me-1"></i>
                  <span className="add">Thêm</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAddProcess;
