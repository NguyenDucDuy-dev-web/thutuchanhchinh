import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./News.scss";
import { Link } from "react-router-dom";
import anhphobien from "../../../assets/images/anhphobienn.png";
import { apiUrl, token } from "../../../components/common/Http";

const News = () => {
  const [news, setNews] = useState([]);

  const fetchNews = async () => {
    try {
      const res = await fetch(apiUrl + "news" + "/getNewsNoiBat", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });

      if (!res.ok) throw new Error("Server error");

      const result = await res.json();
      setNews(result.data);
    } catch (err) {
      console.error("Lỗi khi tải tin tức:", err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);
  const swiperRef = useRef(null);
  const [visibleSlides, setVisibleSlides] = useState(3);
  const [startIndex, setStartIndex] = useState(2);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1200);

  const getResponsiveSettings = () => {
    const width = window.innerWidth;

    if (width >= 1200) {
      return {
        slidesPerView: visibleSlides,
        allowTouchMove: false,
        spaceBetween: 30,
        centeredSlides: false,
        initialSlide: 2,
      };
    } else if (width >= 992) {
      return {
        slidesPerView: "auto",
        allowTouchMove: true,
        spaceBetween: 25,
        centeredSlides: false,
        initialSlide: 0,
        watchSlidesProgress: true,
      };
    } else if (width >= 768) {
      return {
        slidesPerView: "auto",
        allowTouchMove: true,
        spaceBetween: 20,
        centeredSlides: false,
        initialSlide: 0,
        watchSlidesProgress: true,
      };
    } else if (width >= 576) {
      return {
        slidesPerView: "auto",
        allowTouchMove: true,
        spaceBetween: 16,
        centeredSlides: false,
        initialSlide: 0,
        watchSlidesProgress: true,
      };
    } else {
      return {
        slidesPerView: "auto",
        allowTouchMove: true,
        spaceBetween: 12,
        centeredSlides: false,
        initialSlide: 0,
        watchSlidesProgress: true,
      };
    }
  };

  const [swiperSettings, setSwiperSettings] = useState(getResponsiveSettings());

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newIsDesktop = width >= 1200;
      setIsDesktop(newIsDesktop);
      setSwiperSettings(getResponsiveSettings());

      if (newIsDesktop) {
        setVisibleSlides(3);
        setStartIndex(2);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const canNext = visibleSlides < 5;
  const canPrev = visibleSlides > 3;

  useEffect(() => {
    if (swiperRef.current && isDesktop) {
      swiperRef.current.params.slidesPerView = visibleSlides;
      swiperRef.current.update();
      swiperRef.current.slideTo(startIndex, 500, true);
    }
  }, [visibleSlides, startIndex, isDesktop]);

  const handleNext = () => {
    if (canNext && isDesktop) {
      const newVisibleSlides = visibleSlides + 1;
      const newStartIndex = startIndex - 1;

      setVisibleSlides(newVisibleSlides);
      setStartIndex(newStartIndex);
    }
  };

  const handlePrev = () => {
    if (canPrev && isDesktop) {
      const newVisibleSlides = visibleSlides - 1;
      const newStartIndex = startIndex + 1;

      setVisibleSlides(newVisibleSlides);
      setStartIndex(newStartIndex);
    }
  };

  return (
    <section className="news-section">
      <div className="custom-container">
        <div className="news">
          <div className="news-title">
            <h5 className="fw-bold">Tin tức</h5>
            <Link>XEM TẤT CẢ</Link>
          </div>

          <div className="decoration-squares">
            <div className="white-square">
              <img src={anhphobien} alt="anh" />
            </div>
            <div className="blue-square"></div>
          </div>

          <Swiper
            ref={swiperRef}
            {...swiperSettings}
            className={`news-slider ${isDesktop ? "desktop" : "mobile"}`}
            style={{
              maxWidth: isDesktop ? `${visibleSlides * 290}px` : "100%",
              margin: isDesktop ? "0 0px 0 35px" : "0",
              overflow: "hidden",
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            speed={500}
            resistanceRatio={0.85}
            threshold={5}
            longSwipesRatio={0.5}
            longSwipesMs={300}
          >
            {news.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="news-card h-100">
                  <div className="news-card_image">
                    <img
                      src={
                        "http://localhost:8000/storage/news/thumb/" +
                        item.image.split("/").pop()
                      }
                      alt={item.title}
                    />
                  </div>
                  <div className="news-card_content">
                    <h6 className="news-card_content_title">{item.title}</h6>
                    <p className="news-card_content_desc">{item.short_desc}</p>
                    <p className="news-card_content_date">
                      {new Date(item.created_at).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="news-card_content_room">
                      <i className="bi bi-hospital"></i>
                      <span>{item.department}</span>
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {isDesktop && (
            <div className="custom-navigation">
              <button
                className="custom-prev"
                onClick={handlePrev}
                disabled={!canPrev}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              <button
                className="custom-next"
                onClick={handleNext}
                disabled={!canNext}
              >
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default News;
