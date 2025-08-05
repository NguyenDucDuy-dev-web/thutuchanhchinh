import React, { useState, useEffect } from "react";
import FormViewMail from "../../components/QuanlyMail/FormViewMail/FormViewMail";
import BreadcrumbComponent from "../../../components/common/Breadcrumb/BreadcrumbComponent";
import { Row, Col, Button } from "react-bootstrap";
import TableUserMail from "../../components/Table/TableUserMail";
import { apiUrl, token } from "../../../components/common/Http";
import { toast } from "react-toastify";
import "./SendEmail.scss"
const SendEmail = () => {
  const [mailStatus, setMailStatus] = useState([]);
  const [searchKeyword, setSearchKeyWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMailTemplate, setSelectedMailTemplate] = useState(null);
  const [sending, setSending] = useState(false);

  const fetchMailStatus = async (mailTemplateId = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}mailUserstatus/${mailTemplateId}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });

      const result = await res.json();
      if (result.status) {
        // Thêm property isSelected cho mỗi user
        const dataWithSelection = result.data.map(user => ({
          ...user,
          isSelected: false
        }));
        setMailStatus(dataWithSelection);
      } else {
        toast.error("Không lấy được danh sách");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMailStatus();
  }, []);

  // Toggle select một user
  const handleToggleSelect = (userId) => {
    setMailStatus(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isSelected: !user.isSelected }
          : user
      )
    );
  };

  // Chọn tất cả / bỏ chọn tất cả
  const handleSelectAll = () => {
    const unsentUsers = filteredData.filter(user => user.status !== 1);
    const allUnsentSelected = unsentUsers.every(user => user.isSelected);
    
    setMailStatus(prev => 
      prev.map(user => {
        // Chỉ thay đổi trạng thái của những user chưa gửi mail
        if (user.status !== 1) {
          return { ...user, isSelected: !allUnsentSelected };
        }
        return user;
      })
    );
  };

  // Gửi mail hàng loạt
  const handleSendMails = async () => {
    const selectedUsers = mailStatus.filter(user => user.isSelected && user.status !== 1);
    
    if (selectedUsers.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một người dùng để gửi mail");
      return;
    }

    if (!selectedMailTemplate) {
      toast.warning("Vui lòng chọn mẫu mail trước khi gửi");
      return;
    }

    setSending(true);
    try {
      const userIds = selectedUsers.map(user => user.id);
      
      const res = await fetch(`${apiUrl}mailUserstatus/send-bulk-mail`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({
          mail_template_id: selectedMailTemplate,
          user_ids: userIds
        })
      });

      const result = await res.json();
      
      if (result.status) {
        toast.success(`Đã gửi mail thành công cho ${selectedUsers.length} người dùng`);
        setMailStatus(prev => 
          prev.map(user => 
            selectedUsers.some(selected => selected.id === user.id)
              ? { ...user, status: 1, isSelected: false }
              : user
          )
        );
      } else {
        toast.error(result.message || "Có lỗi xảy ra khi gửi mail");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error.message);
    } finally {
      setSending(false);
    }
  };

  const filteredData = mailStatus.filter((item) =>
    item.name?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const selectedUnsentCount = filteredData.filter(user => user.isSelected && user.status !== 1).length;
  const unsentUsers = filteredData.filter(user => user.status !== 1);
  const allUnsentSelected = unsentUsers.length > 0 && unsentUsers.every(user => user.isSelected);

  return (
    <>
      <section className="sendEmail-section py-3 px-3">
        <BreadcrumbComponent />

        <Row className="align-items-stretch">
          <Col xs={12} md={5}>
            <FormViewMail 
              onChangeTemplate={(id, template) => {
                fetchMailStatus(id);
                setSelectedMailTemplate(id);
              }} 
            />
          </Col>

          {/* Danh sách người dùng */}
          <Col xs={12} md={7} className="mt-3 mt-md-0">
            <div className="table-box">
              <div className="table-title">
                <span className="title">Danh sách mẫu Mail</span>
              </div>
              
              <div className="table-controls d-flex justify-content-between align-items-center mb-3">
                <div className="table-search">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Tìm kiếm"
                    onChange={(e) => setSearchKeyWord(e.target.value)}
                  />
                </div>
                
                <div className="table-actions d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={handleSelectAll}
                    disabled={loading || unsentUsers.length === 0}
                  >
                    {allUnsentSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  </Button>
                  
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={handleSendMails}
                    disabled={sending || selectedUnsentCount === 0}
                  >
                    {sending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </span>
                        Đang gửi...
                      </>
                    ) : (
                      `Gửi Mail (${selectedUnsentCount})`
                    )}
                  </Button>
                </div>
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
                  <TableUserMail 
                    data={filteredData}
                    onToggleSelect={handleToggleSelect}
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

export default SendEmail;