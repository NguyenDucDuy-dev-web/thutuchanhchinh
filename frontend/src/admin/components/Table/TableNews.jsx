import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import "./TableNews.scss";
import ModalEditNews from "../QuanlyTintuc/ModalEditNews/ModalEditNews";
import ModalDeleteNews from "../QuanlyTintuc/ModalDeleteNews/ModalDeleteNews";
import ModalViewDetailNews from "../QuanlyTintuc/ModalViewDetailNews/ModalViewDetailNews";

const TableNews = ({ data, onFetchNews }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
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

  const handleViewDetail = (news) => {
    setSelectedNews(news);
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
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-cell title-cell" title={getValue()}>
          {truncateText(getValue(), 30)}
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
        <div className="text-cell short_desc-cell" title={getValue()}>
          {truncateText(getValue(), 40)}
        </div>
      ),
    },
    {
      header: "Nội dung",
      accessorKey: "content",
      size: 150,
      cell: ({ getValue }) => (
        <div className="text-cell content-cell" title={getValue()}>
          {truncateText(getValue(), 25)}
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
          <i
            className="bi bi-eye-fill text-primary me-1 detail"
            onClick={() => handleViewDetail(row.original)}
          ></i>
          <i
            className="bi bi-file-earmark-check-fill text-success me-1 edit"
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
          <table className="news-table table table-bordered table-hover">
            <thead className="table-light">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="news-table-header">
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
                    <td key={cell.id} className="news-table-cell">
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
          {data.map((news, index) => (
            <div key={index} className="news-card">
              <div className="card-header">
                <div className="news-info">
                  <h6 className="news-title">{truncateText(news.title, 50)}</h6>
                  <span className="news-index">#{index + 1}</span>
                </div>
                <div className="news-status">
                  {news.status === 1 ? (
                    <span className="badge bg-primary action">Nổi bật</span>
                  ) : (
                    <span className="badge bg-danger noaction">
                      Bình thường
                    </span>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="news-description">
                  <i className="bi bi-file-text me-2"></i>
                  <span>{truncateText(news.short_desc, 100)}</span>
                </div>
                <div className="news-department">
                  <i className="bi bi-building me-2"></i>
                  <span>{news.department}</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn btn-sm btn-outline-primary detail">
                  <i
                    className="bi bi-eye-fill me-1"
                    onClick={() => handleViewDetail(news)}
                  ></i>
                  Chi tiết
                </button>
                <button
                  className="btn btn-sm btn-outline-success edit"
                  onClick={() => handleShowmodal(news)}
                >
                  <i className="bi bi-file-earmark-check-fill me-1"></i>Sửa
                </button>
                <button
                  className="btn btn-sm btn-outline-danger delete"
                  onClick={() => handleShowModalDelete(news)}
                >
                  <i className="bi bi-file-earmark-x-fill me-1"></i>Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ModalViewDetailNews
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        news={selectedNews}
      />

      <ModalEditNews
        show={showModal}
        onHide={handleClosemodal}
        news={selectedNews}
        onFetchNews={onFetchNews}
      />
      <ModalDeleteNews
        show={showDeleteModal}
        onHide={handleCloseModalDelete}
        news={selectedNews}
        onFetchNews={onFetchNews}
      />
    </>
  );
};

export default TableNews;
