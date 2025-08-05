import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import "./TableProcedures.scss";
import ModalEditList from "../QuanlyThutuc/ListProcedureAd/ModalEditList/ModalEditList";
import ModalDeleteList from "../QuanlyThutuc/ListProcedureAd/ModalDeleteList/ModalDeleteList";
import ModalViewDetail from "../QuanlyThutuc/ListProcedureAd/ModalViewDetail/ModalViewDetail";

const TableProcedures = ({ data, fetchProcedures, formTemplates, procedureProcess }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProcedures, setSelectedProcedures] = useState(null);

  const handleShowModalDelete = (procedures) => {
    setShowDeleteModal(true);
    setSelectedProcedures(procedures);
  };

  const handleCloseModalDelete = () => {
    setShowDeleteModal(false);
    setSelectedProcedures(null);
  };

  const handleShowmodal = (procedures) => {
    setShowModal(true);
    setSelectedProcedures(procedures);
  };

  const handleClosemodal = () => {
    setShowModal(false);
    setSelectedProcedures(null);
  };

  const handleViewDetail = (procedures) => {
    setSelectedProcedures(procedures);
    setShowDetailModal(true);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const columns = [
    {
      header: "STT",
      accessorFn: (row, index) => index + 1,
      id: "stt",
      size: 50,
    },
    {
      header: "Tiêu đề",
      accessorKey: "title",
      size: 100,
      cell: ({ getValue }) => (
        <div className="text-cell title-cell" title={getValue()}>
          {truncateText(getValue(), 30)}
        </div>
      ),
    },
    {
      header: "Mô tả",
      accessorKey: "short_desc",
      size: 150,
      cell: ({ getValue }) => (
        <div className="text-cell short_desc-cell" title={getValue()}>
          {truncateText(getValue(), 40)}
        </div>
      ),
    },
    {
      header: "Nội dung",
      accessorKey: "content",
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-cell content-cell" title={getValue()}>
          {truncateText(getValue(), 25)}
        </div>
      ),
    },
    {
      header: "Phòng",
      accessorKey: "room",
      size: 100,
      cell: ({ getValue }) => (
        <div className="text-cell department-cell" title={getValue()}>
          {truncateText(getValue(), 20)}
        </div>
      ),
    },
    {
      header: "Thời gian",
      accessorKey: "time",
      size: 100,
      cell: ({ getValue }) => (
        <div className="text-cell time-cell" title={getValue()}>
          {truncateText(getValue(), 15)}
        </div>
      ),
    },
    {
      header: "Hình ảnh",
      accessorKey: "image",
      size: 100,
      cell: ({ getValue }) => (
        <div className="image-cell">
          {getValue() ? (
            <img
              src={`http://localhost:8000/storage/${getValue()}`}
              alt="Procedure"
              className="news-thumbnail"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="no-image">Không có ảnh</div>
          )}
        </div>
      ),
    },
    {
      header: "Loại",
      accessorKey: "type",
      size: 120,
      cell: ({ getValue }) =>
        getValue() === 0 ? (
          <span className="actiontype">Thủ tục hành chính công</span>
        ) : (
          <span className="noactiontype">Bình thường</span>
        ),
    },
    {
      header: "Hình thức",
      accessorKey: "format",
      size: 100,
      cell: ({ getValue }) =>
        getValue() === 1 ? (
          <span className="badge bg-primary action">Trực tuyến</span>
        ) : (
          <span className="badge bg-danger noaction">Trực tiếp</span>
        ),
    },
    {
      header: "Quy trình",
      accessorFn: (row) => row.process?.name ?? "",
      size: 120,
      cell: ({ getValue }) => (
        <div className="text-cell" title={getValue()}>
          {truncateText(getValue(), 20)}
        </div>
      ),
    },
    {
      header: "Mẫu thủ tục",
      accessorFn: (row) => row.form_template?.name ?? "",
      size: 120,
      cell: ({ getValue }) => (
        <div className="text-cell" title={getValue()}>
          {truncateText(getValue(), 20)}
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
          ></i>
          <i
            className="bi bi-file-earmark-code-fill text-success me-1 edit"
            onClick={() => handleShowmodal(row.original)}
          ></i>
          <i
            className="bi bi-file-earmark-x-fill text-danger me-1 delete"
            onClick={() => handleShowModalDelete(row.original)}
          ></i>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="table-responsive-wrapper">
        <div className="desktop-table">
          <table className="procedure-table table table-bordered table-hover">
            <thead className="table-light">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="procedure-table-header">
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
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="procedure-table-cell">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mobile-cards">
          {data.map((procedure, index) => (
            <div key={index} className="procedure-card">
              <div className="card-header">
                <div className="procedure-info">
                  <h6 className="procedure-title">
                    {truncateText(procedure.title, 50)}
                  </h6>
                  <span className="procedure-index">#{index + 1}</span>
                </div>
                <div className="procedure-status">
                  {procedure.format === 1 ? (
                    <span className="badge bg-primary action">Trực tuyến</span>
                  ) : (
                    <span className="badge bg-danger noaction">Trực tiếp</span>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="procedure-description">
                  <i className="bi bi-file-text me-2"></i>
                  <span>{truncateText(procedure.short_desc, 100)}</span>
                </div>
                <div className="procedure-room">
                  <i className="bi bi-building me-2"></i>
                  <span>{procedure.room}</span>
                </div>
                <div className="procedure-time">
                  <i className="bi bi-clock me-2"></i>
                  <span>{procedure.time}</span>
                </div>
              </div>
              <div className="card-actions">
                <button
                  className="btn btn-sm btn-outline-primary detail"
                  onClick={() => handleViewDetail(procedure)}
                >
                  <i className="bi bi-eye-fill me-1"></i>Chi tiết
                </button>
                <button
                  className="btn btn-sm btn-outline-success edit"
                  onClick={() => handleShowmodal(procedure)}
                >
                  <i className="bi bi-file-earmark-code-fill me-1"></i>Sửa
                </button>
                <button
                  className="btn btn-sm btn-outline-danger delete"
                  onClick={() => handleShowModalDelete(procedure)}
                >
                  <i className="bi bi-file-earmark-x-fill me-1"></i>Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalViewDetail
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        procedures={selectedProcedures}
        formTemplates={formTemplates}
        procedureProcess = {procedureProcess}
      />

      <ModalEditList
        show={showModal}
        onHide={handleClosemodal}
        procedures={selectedProcedures}
        onFetchProcedures={fetchProcedures}
        formTemplates={formTemplates}
        procedureProcess = {procedureProcess}
      />

      <ModalDeleteList
        show={showDeleteModal}
        onHide={handleCloseModalDelete}
        procedure={selectedProcedures}
        onFetchProcedures={fetchProcedures}
      />
    </>
  );
};

export default TableProcedures;
