import React from 'react';
import 'swiper/css';
import 'swiper/css/autoplay';
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay} from "swiper/modules";

function ClientLogo() {
    const slides = [
        { src: '/images/client_logo1.png', width: '200px' },
        { src: '/images/client_logo2.png', width: '67px' },
        { src: '/images/client_logo3.png', width: '128px' },
        { src: '/images/client_logo4.jpg', width: '94px' },
        { src: '/images/client_logo1.png', width: '200px' },
        { src: '/images/client_logo2.png', width: '67px' },
        { src: '/images/client_logo3.png', width: '128px' },
        { src: '/images/client_logo4.jpg', width: '94px' },
        { src: '/images/client_logo4.jpg', width: '94px' },
        { src: '/images/client_logo4.jpg', width: '94px' },
        { src: '/images/client_logo4.jpg', width: '94px' },
        { src: '/images/client_logo4.jpg', width: '94px' },
    ];
    return (
        <section className="sm:py-[36px] pb-[36px]">
            <h2 className="2xl:text-[36px] xl:text-[32px] lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-bold  2xl:mb-[40px] lg:mb-[36px] sm:mb-[30px] mb-[20px] text-center">Trusted By</h2>
            <div className="2xl:w-[calc(100vw-((100vw-1238px)/2))] ml-auto 2xl:px-0 px-[15px]">
                <Swiper className="client_logo"
                        modules={[Autoplay]}
                        loop={true}
                        autoplay={{
                            delay: 0, // Continuous motion
                            disableOnInteraction: false,
                        }}
                        speed={3000} // Smooth transition speed (ms)
                        slidesPerView={8}
                        spaceBetween={48}
                        breakpoints={{
                            320: {
                                slidesPerView: 5,
                                spaceBetween: 16,
                            },
                            480: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                            640: {
                                slidesPerView: 6,
                                spaceBetween: 24,
                            },
                            768: {
                                slidesPerView: 6,
                                spaceBetween: 30,
                            },
                            1024: {
                                slidesPerView: 6,
                                spaceBetween: 36,
                            },
                            1280: {
                                slidesPerView: 8,
                                spaceBetween: 48,
                            },
                        }}
                        allowTouchMove={false} // Disable dragging (optional)
                >
                    {slides.map((slide, i) => (
                        <SwiperSlide key={i}>
                            <img src={slide.src} alt={`Slide ${i + 1}`} className="mx-auto" style={{ width: slide.width }}/>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

export default ClientLogo;