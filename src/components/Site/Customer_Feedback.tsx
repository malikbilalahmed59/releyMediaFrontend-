"use client";

import React from "react";
import Image from "next/image";
import stars_5 from "../../../public/images/stars-5.svg";
import trustpilot from "../../../public/images/trustpilot.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft , ChevronRight } from 'lucide-react';


// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

function CustomerFeedback() {
    const testimonials = [
        {
            name: "Mike Larson",
            title: "Marketing Director, Apex Brands",
            rating: 4.5,
            text: "We are stunned with how quickly we received our order. It turned out perfect, and all of our interactions with staff have been fantastic. Thank you so much!",
            image: "/images/mike-larson.png",
        },
        {
            name: "Jana",
            title: "Procurement Manager, Nova Corp",
            rating: 4.5,
            text: "The sales staff had great suggestions and were very helpful in the process to, in the end, get exactly what was necessary for our use!",
            image: "/images/mike-larson.png",
        },
        {
            name: "Sarah",
            title: "Brand Strategist, BlueWave Marketing",
            rating: 4.5,
            text: "Everything went well as anticipated, and as planned. Service was superb & shipment was expedited in a speedy fashion! Thank you for your service!",
            image: "/images/mike-larson.png",
        },
        {
            name: "Sarah",
            title: "Brand Strategist, BlueWave Marketing",
            rating: 4.5,
            text: "Everything went well as anticipated, and as planned. Service was superb & shipment was expedited in a speedy fashion! Thank you for your service!",
            image: "/images/mike-larson.png",
        },
        {
            name: "Sarah",
            title: "Brand Strategist, BlueWave Marketing",
            rating: 4.5,
            text: "Everything went well as anticipated, and as planned. Service was superb & shipment was expedited in a speedy fashion! Thank you for your service!",
            image: "/images/mike-larson.png",
        },
    ];

    return (
        <section className="pb-[36px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <div className="sm:mb-[78px] mb-[68px] text-center">
                    <h2 className="2xl:text-[36px] xl:text-[32px] lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-bold sm:mb-[24px] mb-[14px] text-center">
                        Our Customer Feedback
                    </h2>
                    <figure className="mb-[12px]">
                        <Image src={stars_5} alt="stars_5" className="mx-auto md:w-auto w-[140px]" />
                    </figure>
                    <figure>
                        <Image src={trustpilot} alt="trustpilot" className="mx-auto" />
                    </figure>
                </div>

                <div className="w-full  mx-auto  relative px-[30px]">
                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        }}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="!overflow-y-visible !overflow-clip"
                    >
                        {testimonials.map((item, index) => (
                            <SwiperSlide key={index} className="!h-auto">
                                <div className="bg-white border border-[#0000001A] rounded-[24px] sm:px-[30px] px-[20px] py-[36px] text-center flex flex-col items-center h-full">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-[80px] h-[80px] mt-[-80px] rounded-full mb-[11px]"
                                    />
                                    <h3 className="font-bold text-[16px]">{item.name}</h3>
                                    <p className="sm:text-[15px] text-[14px]">{item.title}</p>
                                    <div className="flex items-center justify-center mt-2">
                                        <img
                                            src="/images/stars-5.svg"
                                            alt="Rating"
                                            className="w-[106px] h-[20px]"
                                        />
                                        <span className="ml-2 text-[16px]">({item.rating})</span>
                                    </div>
                                    <p className="mt-[11px] sm:text-[16px] text-[14px] italic leading-[24px]">{item.text}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation buttons */}
                    <div className="swiper-button-prev !text-[#959595] 2xl:!w-[50px] !w-[30px] !h-[30px] 2xl:!h-[50px] border border-[#959595] rounded-full hover:bg-accent hover:!text-white hover:border-accent 2xl:!left-[-50px] !left-[-10px]"> </div>
                    <div className="swiper-button-next !text-[#959595] 2xl:!w-[50px] !w-[30px] !h-[30px] 2xl:!h-[50px] border border-[#959595] rounded-full hover:bg-accent hover:!text-white hover:border-accent 2xl:!right-[-50px] !right-[-10px]"></div>
                </div>
            </div>
        </section>
    );
}

export default CustomerFeedback;
