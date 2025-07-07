import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import ModalDeleteSP from "../QuanlyThutuc/ModalDeleteSampleProcedure/ModalDeleteSP";
import ModalRestoreSampleProcedure from "../QuanlyThutuc/ModalRestore/ModalRestoreSampleProcedure";

const TableSampleProcedure = ({ data, onPreview, onUpdated }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleShowModalDelete = (item) => {
    setShowDeleteModal(true);
    setSelectedItem(item);
  };
  const handleCloseModalDelete = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const handleShowModalRestore = (item) => {
    setShowRestoreModal(true);
    setSelectedItem(item);
  };

  const handleCloseModalRestore = () => {
    setShowRestoreModal(false);
    setSelectedItem(null);
  };

  const columns = [
    {
      header: "STT",
      accessorFn: (row, index) => index + 1,
      id: "stt",
    },
    {
      header: "Tên mẫu thủ tục",
      accessorKey: "name",
    },
    {
      header: "Mô tả",
      accessorKey: "description",
    },
    {
      header: "Đường dẫn",
      accessorKey: "pdf_file_path",
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
      cell: ({ getValue }) =>
        getValue() === 1 ? (
          <span className="badge bg-primary action">Đang triển khai</span>
        ) : (
          <span className="badge bg-danger noaction">Ngừng triển khai</span>
        ),
    },
    {
      header: "Chức năng",
      id: "actions",
      cell: ({ row }) => (
        <>
          <i
            className="bi bi-eye-fill text-primary me-1 detail"
            onClick={() => onPreview(row.original)}
          ></i>
          <i
            className="bi bi-file-earmark-x-fill me-1 delete"
            onClick={() => handleShowModalDelete(row.original)}
          ></i>

          {row.original.status == 0 && (
            <i
              className="bi bi-file-earmark-check-fill text-success me-1 edit"
              onClick={() => handleShowModalRestore(row.original)}
            ></i>
          )}
        </>
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
          <table className="user-table table table-bordered table-hover">
            <thead className="table-light">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="user-table-header">
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
                    <td key={cell.id} className="user-table-cell">
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
          {data.map((user, index) => (
            <div key={index} className="user-card">
              <div className="card-header">
                <div className="user-info">
                  <h6 className="user-name">{user.name}</h6>
                  <span className="user-index">#{index + 1}</span>
                </div>
                <div className="user-status">
                  {user.status === 1 ? (
                    <span className="badge bg-primary action">Hoạt động</span>
                  ) : (
                    <span className="badge bg-danger noaction">
                      Không hoạt động
                    </span>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="user-email">
                  <i className="bi bi-envelope me-2"></i>
                  <span>{user.email}</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn btn-sm btn-outline-primary detail">
                  <i className="bi bi-eye-fill me-1"></i>Chi tiết
                </button>
                <button className="btn btn-sm btn-outline-success edit">
                  <i className="bi bi-person-fill-gear me-1"></i>
                  Sửa
                </button>
                <button className="btn btn-sm btn-outline-danger delete">
                  <i className="bi bi-person-fill-x me-1"></i>Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalDeleteSP
        show={showDeleteModal}
        onHide={handleCloseModalDelete}
        template={selectedItem}
        onDeleted={onUpdated}
      />

      <ModalRestoreSampleProcedure
        show={showRestoreModal}
        onHide={handleCloseModalRestore}
        template={selectedItem}
        onRestore={onUpdated}
      />
    </>
  );
};

export default TableSampleProcedure;
