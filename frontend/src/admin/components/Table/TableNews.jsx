import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import "./TableNews.scss";
import ModalEditNews from "../QuanlyTintuc/ModalEditNews/ModalEditNews";

const TableNews = ({ data, onFetchNews }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const handleShowModalDelete = (news) => {
    setShowDeleteModal(true);
    setSelectedNews(news);
  };

  const handleCloseModalDelete = () => {
    setShowDeleteModal(false);
    setSelectedNews(null);
  };

  const handleShowmodal = (news) => {
    setShowModal(true);
    setSelectedNews(news);
  };
  const handleClosemodal = () => {
    setShowModal(false);
    setSelectedNews(null);
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
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-cell" title={getValue()}>
          {truncateText(getValue(), 20)}
        </div>
      ),
    },
    {
      header: "Slug",
      accessorKey: "slug",
      size: 150,
      cell: ({ getValue }) => (
        <div className="text-cell slug-cell" title={getValue()}>
          {truncateText(getValue(), 30)}
        </div>
      ),
    },
    {
      header: "Mô tả ngắn",
      accessorKey: "short_desc",
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-cell" title={getValue()}>
          {truncateText(getValue(), 60)}
        </div>
      ),
    },
    {
      header: "Nội dung",
      accessorKey: "content",
      size: 250,
      cell: ({ getValue }) => (
        <div className="text-cell content-cell" title={getValue()}>
          {truncateText(getValue(), 80)}
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
              alt="News"
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
      header: "Phòng",
      accessorKey: "department",
      size: 120,
      cell: ({ getValue }) => (
        <div className="text-cell department-cell">{getValue()}</div>
      ),
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
      size: 100,
      cell: ({ getValue }) =>
        getValue() === 1 ? (
          <span className="badge bg-primary action">Nổi bật</span>
        ) : (
          <span className="badge bg-danger noaction">Bình thường</span>
        ),
    },
    {
      header: "Chức năng",
      id: "actions",
      size: 120,
      cell: ({ row }) => (
        <div className="action-buttons">
          <i className="bi bi-eye-fill text-primary me-1 detail"></i>

          <i
            className="bi bi-person-fill-gear text-success me-1 edit"
            onClick={() => handleShowmodal(row.original)}
          ></i>
          <i
            className="bi bi-person-fill-x text-danger me-1 delete"
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

      <ModalEditNews
        show={showModal}
        onHide={handleClosemodal}
        news={selectedNews}
        onFetchNews={onFetchNews}
      />

      {/* <ModalDeleteUser
        show={showDeleteModal}
        onHide={handleCloseModalDelete}
        user={selectedUser}
        onUserDeleted={onUserUpdated}
      /> */}
    </>
  );
};

export default TableNews;
