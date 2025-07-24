import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/stylecommon/style.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import RequireAuth from "./components/common/RequireAuth";
import Login from "./public/Login";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./admin/pages/Dashboard/Dashboard";
import Procedure from "./admin/pages/Procedure/Procedure";
import User from "./admin/pages/User/User";
import Home from "./user/pages/Home/Home";
import ListSampleProcedure from "./admin/pages/ListSampleProcedure/ListSampleProcedure";
import News from "./admin/pages/News/News";
import ProcedureUser from "./user/pages/Procedure/ProcedureUser";
import ProcedureDetail from "./user/components/Procedures/ProcedureDetail/ProcedureDetail";
import ListProcedureAdmin from "./admin/pages/ListProcedureAdmin/ListProcedureAdmin";
import ProcedureSubmission from "./admin/pages/ProcedureSubmission/ProcedureSubmission";

function App() {
  const homeadminRoutes = [
    { path: "dashboard", element: <Dashboard /> },
    { path: "user", element: <User /> },
    { path: "listprocedures", element: <ListProcedureAdmin /> },
    { path: "procedure", element: <Procedure /> },
    { path: "listsampleprocedure", element: <ListSampleProcedure /> },
    { path: "listproceduresubmission", element: <ProcedureSubmission /> },
    { path: "news", element: <News /> },
    // { path: "sidebar", element: <Setting /> },
  ];

  const userRoutes = [
    { path: "home", element: <Home /> },
    // { path: "user", element: <User/> },
    // { path: "requests", element: <Requests /> },
    { path: "procedure", element: <ProcedureUser /> },
    { path: "procedure/:id", element: <ProcedureDetail /> },
    // { path: "reports", element: <Reports /> },
    // { path: "sidebar", element: <Setting /> },
  ];
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <UserLayout />
              </RequireAuth>
            }
          >
            {userRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.element} />
            ))}
          </Route>

          <Route
            path="/homeadmin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            {homeadminRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.element} />
            ))}
          </Route>

          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
