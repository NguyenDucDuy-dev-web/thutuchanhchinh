import React , {useState, useEffect} from "react";
import { Row, Col } from "react-bootstrap";
import BreadcrumbComponent from "../../../components/common/Breadcrumb/BreadcrumbComponent";
import FormAddProcess from "../../components/QuanlyThutuc/ProcedureProcess/FormAddProcess/FormAddProcess";
import { apiUrl, token } from "../../../components/common/Http";
import TableProcedureProcess from "../../components/Table/TableProcedureProcess";
const ProcedureProcess = () => {
  const [procedureProcess, setProcedureProcess] = useState([]);
  const [searchKeyword, setSearchKeyWord] = useState("");
  const [loading, setLoading] = useState(true);
  const filteredData = procedureProcess.filter((item) =>
    item.name?.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  const fetchProcedureProcess = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl + "procedure" + "/process", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      setProcedureProcess(result.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách quy trình:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcedureProcess();
  }, []);
  return (
    <>
      <section className="procedureProcess-section py-3 px-3">
        <BreadcrumbComponent />

        <Row className="align-items-stretch">
          <Col xs={12} md={4}>
            <FormAddProcess fetchProcedureProcess={fetchProcedureProcess} />
          </Col>
          <Col xs={12} md={8} className="mt-3 mt-md-0">
            <div className="table-box">
              <div className="table-title">
                <span className="title">Danh sách quy trình</span>
              </div>
              <div className="table-search">
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Tìm kiếm"
                  onChange={(e) => setSearchKeyWord(e.target.value)}
                />
              </div>
              <div className="table-content">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 mb-0">Đang tải dữ liệu...</p>
                  </div>
                ) : (
                  <TableProcedureProcess
                    data={filteredData}
                    fetchProcedureProcess={fetchProcedureProcess}
                  />
                )}
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default ProcedureProcess;
