import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import { Row, Col } from "react-bootstrap";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./HighlightedEvent.scss";
import anhphobien from "../../../assets/images/anhphobienn.png";
import anhphobien1 from "../../../assets/images/anhphobien1.png";
import anhphobien2 from "../../../assets/images/anhphobien2.png";

const HighlightedEvent = () => {
  const events = [
    {
      id: 1,
      title: "Đăng ký xin giấy tạm hoãn nghĩa vụ quân sự",
      content:
        "Sinh viên đang theo học chính quy tại trường đại học được xem xét tạm hoãn nghĩa vụ quân sự theo quy định. Giúp sinh viên làm đơn xin xác nhận.",
      image: anhphobien,
    },
    {
      id: 2,
      title: "Đăng ký học phần học kỳ 2",
      content:
        "Sinh viên đang theo học chính quy tại trường đại học được xem xét tạm hoãn nghĩa vụ quân sự theo quy định. Giúp sinh viên làm đơn xin xác nhận.",
      image: anhphobien1,
    },
    {
      id: 3,
      title: "Nộp hồ sơ xét học bổng",
      content:
        "Sinh viên đang theo học chính quy tại trường đại học được xem xét tạm hoãn nghĩa vụ quân sự theo quy định. Giúp sinh viên làm đơn xin xác nhận.",
      image: anhphobien2,
    },
  ];
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="highlighted-event-section p-0">
      <div className="custom-container">
        <Swiper
          modules={[Navigation, Pagination, EffectFade]}
          effect={isMobile ? "fade" : "slide"}
          fadeEffect={{ crossFade: true }}
          speed={isMobile ? 1000 : 1200}
          spaceBetween={20}
          slidesPerView={1}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          loop={false}
          className="event-slider"
          pagination={{
            clickable: true,
            el: ".swiper-pagination-custom",
          }}
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <div className="highlighted-event">
                {/* Desktop Layout */}
                <Row className="align-items-stretch d-none d-xl-flex">
                  <Col
                    xs={12}
                    md={6}
                    lg={6}
                    className="d-flex flex-column justify-content-between"
                  >
                    <div className="event-info-wrapper h-100 d-flex flex-column justify-content-between w-100">
                      <div className="event-info text-break">
                        <h5 className="fw-bold">{event.title}</h5>
                        <p className="content-popular mb-1">{event.content}</p>

                        <div className="btn-group">
                          <button className="button_xemchitiet">
                            XEM CHI TIẾT
                          </button>
                          <button className="button_thuchien">THỰC HIỆN</button>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col
                    xs={12}
                    md={6}
                    lg={6}
                    className="d-flex align-items-center"
                  >
                    <div className="event-image w-100 text-center text-md-end mt-3 mt-md-0 w-100">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="event-img img-fluid rounded-3"
                      />
                    </div>
                  </Col>
                </Row>

                {/* Tablet & Mobile Layout */}
                <div className="tablet-mobile-layout d-xl-none">
                  <div className="event-content-center">
                    <h5 className="fw-bold text-center">{event.title}</h5>
                    <p className="content-popular text-center mb-3">
                      {event.content}
                    </p>
                    <div className="btn-group-center">
                      <button className="button_xemchitiet">
                        XEM CHI TIẾT
                      </button>
                      <button className="button_thuchien">THỰC HIỆN</button>
                    </div>
                    <div className="event-image-center">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="event-img-tablet img-fluid rounded-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination dots */}
        <div className="swiper-pagination-custom"></div>

        {/* Tab điều khiển - Ẩn trên tablet và mobile */}
        <div className="event-tabs d-none d-xl-flex">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`event-tab px-3 py-2  ${
                index === activeIndex ? "active" : ""
              }`}
              onClick={() => swiperRef.current?.slideTo(index)}
            >
              <h6>{event.title}</h6>
              <p>{event.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightedEvent;
