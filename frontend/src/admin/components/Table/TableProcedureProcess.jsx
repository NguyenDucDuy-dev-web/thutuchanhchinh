import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import "./TableProcedureProcess.scss";
import ModalViewDetailProcess from "../QuanlyThutuc/ProcedureProcess/ModalViewDetailProcess/ModalViewDetailProcess";
import ModalEditProcess from "../QuanlyThutuc/ProcedureProcess/ModalEditProcess/ModalEditProcess";
import ModalDeleteProcess from "../QuanlyThutuc/ProcedureProcess/ModalDeleteProcess/ModalDeleteProcess";

const TableProcedureProcess = ({ data, fetchProcedureProcess }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);

  const handleShowModalDelete = (process) => {
    setShowDeleteModal(true);
    setSelectedProcess(process);
  };

  const handleCloseModalDelete = () => {
    setShowDeleteModal(false);
    setSelectedProcess(null);
  };

  const handleShowmodal = (process) => {
    setShowModal(true);
    setSelectedProcess(process);
  };

  const handleClosemodal = () => {
    setShowModal(false);
    setSelectedProcess(null);
  };

  const handleViewDetail = (process) => {
    setSelectedProcess(process);
    setShowDetailModal(true);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      header: "STT",
      accessorFn: (row, index) => index + 1,
      id: "stt",
      size: 50,
    },
    {
      header: "Tên quy trình",
      accessorKey: "name",
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-cell name-cell" title={getValue()}>
          {truncateText(getValue(), 40)}
        </div>
      ),
    },
    {
      header: "Số bước",
      accessorFn: (row) => row.steps?.length || 0,
      id: "steps_count",
      size: 80,
      cell: ({ getValue }) => (
        <div className="text-cell steps-count-cell">
          <span className="badge bg-info">{getValue()} bước</span>
        </div>
      ),
    },
    {
      header: "Các bước",
      accessorKey: "steps",
      size: 300,
      cell: ({ getValue }) => (
        <div className="steps-cell">
          {getValue() && getValue().length > 0 ? (
            <div className="steps-list">
              {getValue()
                .slice(0, 3)
                .map((step, index) => (
                  <div key={step.id} className="step-item">
                    <span className="step-order">{step.step_order}.</span>
                    <span className="step-name" title={step.name}>
                      {truncateText(step.name, 25)}
                    </span>
                  </div>
                ))}
              {getValue().length > 3 && (
                <div className="step-item more-steps">
                  <span className="text-muted">
                    ... và {getValue().length - 3} bước khác
                  </span>
                </div>
              )}
            </div>
          ) : (
            <span className="text-muted">Chưa có bước nào</span>
          )}
        </div>
      ),
    },
    {
      header: "Ngày tạo",
      accessorKey: "created_at",
      size: 120,
      cell: ({ getValue }) => (
        <div className="text-cell date-cell" title={formatDate(getValue())}>
          {formatDate(getValue())}
        </div>
      ),
    },
    {
      header: "Cập nhật",
      accessorKey: "updated_at",
      size: 120,
      cell: ({ getValue }) => (
        <div className="text-cell date-cell" title={formatDate(getValue())}>
          {formatDate(getValue())}
        </div>
      ),
    },
    {
      header: "Chức năng",
      id: "actions",
      size: 120,
      cell: ({ row }) => (
        <div className="action-buttons">
          <i
            className="bi bi-eye-fill text-primary me-1 detail"
            onClick={() => handleViewDetail(row.original)}
            title="Xem chi tiết"
          ></i>
          <i
            className="bi bi-file-earmark-code-fill text-success me-1 edit"
            onClick={() => handleShowmodal(row.original)}
            title="Chỉnh sửa"
          ></i>
          <i
            className="bi bi-file-earmark-x-fill text-danger me-1 delete"
            onClick={() => handleShowModalDelete(row.original)}
            title="Xóa"
          ></i>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="table-responsive-wrapper">
        <div className="desktop-table">
          <table className="procedure-process-table table table-bordered table-hover">
            <thead className="table-light">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="procedure-process-table-header"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="procedure-process-table-cell"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center text-muted py-4"
                  >
                    Không có dữ liệu quy trình
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mobile-cards">
          {data && data.length > 0 ? (
            data.map((process, index) => (
              <div key={process.id} className="process-card">
                <div className="card-header">
                  <div className="process-info">
                    <h6 className="process-title">
                      {truncateText(process.name, 50)}
                    </h6>
                    <span className="process-index">#{index + 1}</span>
                  </div>
                  <div className="process-status">
                    <span className="badge bg-info">
                      {process.steps?.length || 0} bước
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="process-id">
                    <i className="bi bi-hash me-2"></i>
                    <span>ID: {process.id}</span>
                  </div>
                  <div className="process-steps">
                    <i className="bi bi-list-ol me-2"></i>
                    <span>
                      {process.steps && process.steps.length > 0
                        ? `${process.steps.length} bước: ${process.steps
                            .slice(0, 2)
                            .map((s) => s.name)
                            .join(", ")}${
                            process.steps.length > 2 ? "..." : ""
                          }`
                        : "Chưa có bước nào"}
                    </span>
                  </div>
                  <div className="process-dates">
                    <div className="created-date">
                      <i className="bi bi-calendar-plus me-2"></i>
                      <span>Tạo: {formatDate(process.created_at)}</span>
                    </div>
                    <div className="updated-date">
                      <i className="bi bi-calendar-check me-2"></i>
                      <span>Cập nhật: {formatDate(process.updated_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="card-actions">
                  <button
                    className="btn btn-sm btn-outline-primary detail"
                    onClick={() => handleViewDetail(process)}
                  >
                    <i className="bi bi-eye-fill me-1"></i>Chi tiết
                  </button>
                  <button
                    className="btn btn-sm btn-outline-success edit"
                    onClick={() => handleShowmodal(process)}
                  >
                    <i className="bi bi-file-earmark-code-fill me-1"></i>Sửa
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger delete"
                    onClick={() => handleShowModalDelete(process)}
                  >
                    <i className="bi bi-file-earmark-x-fill me-1"></i>Xóa
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data-card">
              <div className="text-center text-muted py-4">
                <i className="bi bi-inbox display-4"></i>
                <p className="mt-2">Không có dữ liệu quy trình</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ModalViewDetailProcess
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        process={selectedProcess}
      />

      <ModalEditProcess
        show={showModal}
        onHide={handleClosemodal}
        process={selectedProcess}
        fetchProcedureProcess={fetchProcedureProcess}
      />

      <ModalDeleteProcess
        show={showDeleteModal}
        onHide={handleCloseModalDelete}
        process={selectedProcess}
        fetchProcedureProcess={fetchProcedureProcess}
      />
      {/* 



      <ModalDeleteProcess
        show={showDeleteModal}
        onHide={handleCloseModalDelete}
        process={selectedProcess}
      />
      */}
    </>
  );
};

export default TableProcedureProcess;
