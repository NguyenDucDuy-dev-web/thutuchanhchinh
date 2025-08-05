import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import "./TableMail.scss";

const TableMail = ({ data, fetchMail, setSelectedMail }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  
  //   const handleShowModalDelete = (user) => {
  //     setShowDeleteModal(true);
  //     setSelectedUser(user);
  //   };

  //   const handleCloseModalDelete = () => {
  //     setShowDeleteModal(false);
  //     setSelectedUser(null);
  //   };

  //   const handleShowmodal = (user) => {
  //     setShowModal(true);
  //     setSelectedUser(user);
  //   };
  //   const handleClosemodal = () => {
  //     setShowModal(false);
  //     setSelectedUser(null);
  //   };

  const columns = [
    {
      header: "STT",
      accessorFn: (row, index) => index + 1,
      id: "stt",
    },
    {
      header: "Tên email",
      accessorKey: "name",
    },
    {
      header: "Chức năng",
      id: "actions",
      cell: ({ row }) => (
        <>
          <i
            className="bi bi-person-fill-gear text-success me-1 edit"
            onClick={() => setSelectedMail(row.original)}
          ></i>
          <i
            className="bi bi-person-fill-x text-danger me-1 delete"
            // onClick={() => handleShowModalDelete(row.original)}
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
          <table className="mail-table table table-bordered table-hover">
            <thead className="table-light">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="mail-table-header">
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
                    <td key={cell.id} className="mail-table-cell">
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

export default TableMail;
