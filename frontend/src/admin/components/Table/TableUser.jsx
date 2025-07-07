import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import "./TableUser.scss";
import ModalEditUser from "../QuanlyUser/ModalEditUser/ModalEditUser";
import ModalDeleteUser from "../QuanlyUser/ModalDelete/ModalDeleteUser";

const TableUser = ({ data, onUserUpdated }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const handleShowModalDelete = (user) => {
    setShowDeleteModal(true);
    setSelectedUser(user);
  };

  const handleCloseModalDelete = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleShowmodal = (user) => {
    setShowModal(true);
    setSelectedUser(user);
  };
  const handleClosemodal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

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
          <span className="badge bg-primary action">Hoạt động</span>
        ) : (
          <span className="badge bg-danger noaction">Không hoạt động</span>
        ),
    },
    {
      header: "Chức năng",
      id: "actions",
      cell: ({ row }) => (
        <>
          <i className="bi bi-eye-fill text-primary me-1 detail"></i>
          <i
            className="bi bi-person-fill-gear text-success me-1 edit"
            onClick={() => handleShowmodal(row.original)}
          ></i>
          <i
            className="bi bi-person-fill-x text-danger me-1 delete"
            onClick={() => handleShowModalDelete(row.original)}
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

      <ModalEditUser
        show={showModal}
        onHide={handleClosemodal}
        user={selectedUser}
        onUserUpdated={onUserUpdated}
      />

      <ModalDeleteUser
        show={showDeleteModal}
        onHide={handleCloseModalDelete}
        user={selectedUser}
        onUserDeleted={onUserUpdated}
      />
    </>
  );
};

export default TableUser;
