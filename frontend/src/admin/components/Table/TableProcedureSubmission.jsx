import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import "./TableProcedureSubmission.scss";

const TableProcedureSubmission = ({ data }) => {
  const columns = [
    {
      header: "STT",
      accessorFn: (row, index) => index + 1,
      id: "stt",
    },
    {
      header: "Tên thủ tục",
      accessorFn: (row) => row.procedure?.title || "Không rõ",
      id: "procedure_title",
    },
    {
      header: "Người gửi",
      accessorFn: (row) => row.user?.name || "Khách",
      id: "user_name",
    },
    {
      header: "Ngày gửi",
      accessorFn: (row) => new Date(row.created_at).toLocaleString("vi-VN"),
      id: "created_at",
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const value = getValue();
        return value === 0 ? (
          <span className="badge bg-warning">Đang chờ</span>
        ) : value === 1 ? (
          <span className="badge bg-success">Đã duyệt</span>
        ) : (
          <span className="badge bg-danger">Từ chối</span>
        );
      },
    },
    {
      header: "Chức năng",
      id: "actions",
      cell: ({ row }) => (
        <>
          <i
            className="bi bi-eye-fill text-primary me-1 detail"
            onClick={() => handleViewDetail(row.original)}
          ></i>
          <i
            className="bi bi-check-circle text-success me-1"
            onClick={() => handleApprove(row.original)}
          ></i>
          <i
            className="bi bi-x-circle text-danger me-1"
            onClick={() => handleReject(row.original)}
          ></i>
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
          <table className="procedure-submission-table table table-bordered table-hover">
            <thead className="table-light">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="procedure-submission-table-header"
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
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="procedure-submission-table-cell"
                    >
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
      </div>
    </>
  );
};

export default TableProcedureSubmission;
