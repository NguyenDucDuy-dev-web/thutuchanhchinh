import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import "./TableUserMail.scss";

const TableUserMail = ({ data, onToggleSelect }) => {
  const columns = [
    {
      header: "STT",
      accessorFn: (row, index) => index + 1,
      id: "stt",
    },
    {
      header: "Tên người dùng",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
      cell: ({ getValue }) =>
        getValue() === 1 ? (
          <span className="badge bg-success">Đã gửi</span>
        ) : (
          <span className="badge bg-warning">Chưa gửi</span>
        ),
    },
    {
      id: "select",
      header: "Chọn",
      cell: ({ row }) => {
        const disabled = row.original.status === 1;
        return (
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              disabled={disabled}
              checked={row.original.isSelected || false}
              onChange={() => onToggleSelect && onToggleSelect(row.original.id)}
              title={disabled ? "Đã gửi mail, không thể chọn" : "Chọn để gửi mail"}
            />
          </div>
        );
      },
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
          <table className="userMail-table table table-bordered table-hover">
            <thead className="table-light">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="userMail-table-header">
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
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    <div className="text-muted">
                      <i className="fas fa-inbox fa-2x mb-2"></i>
                      <p className="mb-0">Không có dữ liệu</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr 
                    key={row.id}
                    className={row.original.status === 1 ? "table-secondary" : ""}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="userMail-table-cell">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile responsive view */}
        <div className="mobile-cards d-md-none">
          {table.getRowModel().rows.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-muted">
                <i className="fas fa-inbox fa-2x mb-2"></i>
                <p className="mb-0">Không có dữ liệu</p>
              </div>
            </div>
          ) : (
            table.getRowModel().rows.map((row, index) => (
              <div 
                key={row.id} 
                className={`card mb-3 ${row.original.status === 1 ? "bg-light" : ""}`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title mb-0">#{index + 1} {row.original.name}</h6>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        disabled={row.original.status === 1}
                        checked={row.original.isSelected || false}
                        onChange={() => onToggleSelect && onToggleSelect(row.original.id)}
                      />
                    </div>
                  </div>
                  <p className="card-text">
                    <small className="text-muted">Email:</small> {row.original.email}
                  </p>
                  <div>
                    {row.original.status === 1 ? (
                      <span className="badge bg-success">Đã gửi</span>
                    ) : (
                      <span className="badge bg-warning">Chưa gửi</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default TableUserMail;