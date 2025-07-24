import React from "react";
import { Link, useLocation } from "react-router-dom";
import { generateBreadcrumb } from "../../../components/common/SidebarData/breadcrumbUtils";

const BreadcrumbComponent = () => {
  const location = useLocation();
  const { title, breadcrumbs } = generateBreadcrumb(location.pathname);

  return (
    <div className="breadcrumb-box mb-3">
      <h4 className="title">{title}</h4>
      <nav className="breadcrumb-sub-box">
        <ol className="breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <li
              key={index}
              className={`breadcrumb-item ${crumb.isActive ? "active" : ""}`}
              aria-current={crumb.isActive ? "page" : undefined}
            >
              {crumb.isActive || !crumb.path ? (
                crumb.title
              ) : (
                <Link to={crumb.path}>{crumb.title}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default BreadcrumbComponent;