import React from 'react';
import 'swiper/css';
import 'swiper/css/autoplay';
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay} from "swiper/modules";

function ClientLogo() {
    const slides = [
        { src: '/images/trusted-by/verizon-wireless.png', alt: 'Verizon Wireless' },
        { src: '/images/trusted-by/toyota.png', alt: 'Toyota' },
        { src: '/images/trusted-by/hp.png', alt: 'Hewlett-Packard' },
        { src: '/images/trusted-by/microsoft.png', alt: 'Microsoft' },
        { src: '/images/trusted-by/alcoa.png', alt: 'Alcoa' },
        { src: '/images/trusted-by/ebay.png', alt: 'eBay' },
        { src: '/images/trusted-by/best-buy.png', alt: 'Best Buy' },
        { src: '/images/trusted-by/procter-gamble.png', alt: 'Procter & Gamble' },
        { src: '/images/trusted-by/coca-cola.png', alt: 'Coca-Cola' },
        { src: '/images/trusted-by/dell.png', alt: 'Dell' },
        { src: '/images/trusted-by/kroger.png', alt: 'Kroger' },
        { src: '/images/trusted-by/mcdonalds.png', alt: 'McDonalds' },
    ];
    return (
        <section className="sm:py-[36px] pb-[36px] bg-[#E8E8E8]">
            <h2 className="2xl:text-[36px] xl:text-[32px] lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-bold  2xl:mb-[40px] lg:mb-[36px] sm:mb-[30px] mb-[20px] text-center">Trusted By</h2>
            <div className="w-full overflow-hidden">
                <div className="w-full pl-0 pr-[15px] sm:px-[15px] 2xl:px-0">
                    <Swiper className="client_logo"
                        modules={[Autoplay]}
                        loop={true}
                        autoplay={{
                            delay: 0, // Continuous motion
                            disableOnInteraction: false,
                        }}
                        speed={3000} // Smooth transition speed (ms)
                        slidesPerView={8}
                        spaceBetween={64}
                        breakpoints={{
                            320: {
                                slidesPerView: 5,
                                spaceBetween: 24,
                            },
                            480: {
                                slidesPerView: 4,
                                spaceBetween: 32,
                            },
                            640: {
                                slidesPerView: 6,
                                spaceBetween: 40,
                            },
                            768: {
                                slidesPerView: 6,
                                spaceBetween: 48,
                            },
                            1024: {
                                slidesPerView: 6,
                                spaceBetween: 56,
                            },
                            1280: {
                                slidesPerView: 8,
                                spaceBetween: 64,
                            },
                        }}
                        allowTouchMove={false} // Disable dragging (optional)
                >
                    {slides.map((slide, i) => {
                        // Microsoft logo gets a larger container
                        const isMicrosoft = slide.alt === 'Microsoft';
                        return (
                            <SwiperSlide key={i} className="flex items-center justify-center">
                                <div className={`${isMicrosoft ? 'w-[220px] h-[120px]' : 'w-[180px] h-[100px]'} flex items-center justify-center`}>
                                    <img src={slide.src} alt={slide.alt || `Client logo ${i + 1}`} className="max-w-full max-h-full w-auto h-auto object-contain" />
                                </div>
                            </SwiperSlide>
                        );
                    })}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

export default ClientLogo;