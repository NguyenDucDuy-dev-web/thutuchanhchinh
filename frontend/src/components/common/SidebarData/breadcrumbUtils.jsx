export const menuData = [
  {
    id: 1,
    title: "Trang chủ",
    icon: "bi bi-house-fill",
    submenu: [
      {
        id: 11,
        title: "Tổng quan",
        icon: "bi bi-pie-chart-fill",
        path: "/homeadmin/dashboard",
        pageTitle: "Tổng quan hệ thống",
      },
    ],
  },
  {
    id: 2,
    title: "Quản lý người dùng",
    icon: "bi bi-person-square",
    submenu: [
      {
        id: 21,
        title: "Người dùng",
        icon: "bi bi-person-fill",
        path: "/homeadmin/user",
        pageTitle: "Danh sách người dùng",
      },
      {
        id: 22,
        title: "Phân quyền",
        icon: "bi bi-gear-fill",
        path: "/homeadmin/role",
        pageTitle: "Quản lý phân quyền",
      },
    ],
  },
  {
    id: 3,
    title: "Quản lý thủ tục",
    icon: "bi bi-folder-fill",
    submenu: [
      {
        id: 31,
        title: "Danh sách thủ tục",
        icon: "bi bi-list-ul",
        path: "/homeadmin/listprocedures",
        pageTitle: "Danh sách thủ tục",
      },
      {
        id: 32,
        title: "Thống kê",
        icon: "bi bi-graph-up-arrow",
        path: "/homeadmin/thongke",
        pageTitle: "Thống kê thủ tục",
      },
      {
        id: 33,
        title: "Mẫu thủ tục",
        icon: "bi bi-file-earmark-fill",
        path: "/homeadmin/procedure",
        pageTitle: "Quản lý mẫu thủ tục",
      },
      {
        id: 34,
        title: "Danh sách mẫu thủ tục",
        icon: "bi bi-list-ul",
        path: "/homeadmin/listsampleprocedure",
        pageTitle: "Danh sách mẫu thủ tục",
      },
      {
        id: 35,
        title: "Danh sách yêu cầu",
        icon: "bi bi-list-ul",
        path: "/homeadmin/listproceduresubmission",
        pageTitle: "Danh sách yêu cầu thủ tục",
      },
    ],
  },
  {
    id: 4,
    title: "Quản lý tin tức",
    icon: "bi bi-newspaper",
    submenu: [
      {
        id: 41,
        title: "Tin tức",
        icon: "bi bi-file-richtext-fill",
        path: "/homeadmin/news",
        pageTitle: "Quản lý tin tức",
      },
    ],
  },
];

export const findMenuByPath = (path) => {
  for (const menu of menuData) {
    for (const submenu of menu.submenu) {
      if (submenu.path === path) {
        return {
          parent: menu,
          current: submenu,
        };
      }
    }
  }
  return null;
};

export const generateBreadcrumb = (pathname) => {
  const menuInfo = findMenuByPath(pathname);
  
  if (!menuInfo) {
    return {
      title: "Trang không tìm thấy",
      breadcrumbs: [
        { title: "Trang chủ", path: "/homeadmin", isActive: false },
        { title: "Trang không tìm thấy", path: pathname, isActive: true },
      ],
    };
  }

  return {
    title: menuInfo.current.pageTitle || menuInfo.current.title,
    breadcrumbs: [
      { title: "Trang chủ", path: "/homeadmin", isActive: false },
      { title: menuInfo.parent.title, path: null, isActive: false },
      { title: menuInfo.current.title, path: pathname, isActive: true },
    ],
  };
};