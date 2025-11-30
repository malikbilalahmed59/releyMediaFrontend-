"use client";

import React from "react";
import Image from "next/image";
import stars_5 from "../../../public/images/stars-5.svg";
import trustpilot from "../../../public/images/trustpilot.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft , ChevronRight } from 'lucide-react';


// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

function CustomerFeedback() {
    const testimonials = [
        {
            name: "Margaret Bendis",
            title: "",
            rating: 5,
            header: "HIGHLY Recommend",
            text: "Ordered 200 personalized fidget spinners from RELYmedia. I worked with Stuart, he was very responsive and kept me informed of every stage in the process from ordering to shipping. He gave me a great rate that included printing and shipping. He sent images at every stage for confirmation and the tracking number for my order once they shipped. The spinners themselves look fantastic; the logo on the center is printed (not a sticker or anything like that) so there's no chance of it coming off. High quality, great service - thoroughly impressed!",
        },
        {
            name: "Mike Larson",
            title: "",
            rating: 5,
            header: "Unbelievable Turn-around",
            text: "We are stunned with how quickly we received our order. It turned out perfect, and all of our interactions with staff have been fantastic. Thank you so much!",
        },
        {
            name: "Joel",
            title: "",
            rating: 5,
            header: "Thumbs",
            text: "Great Work. The thumb drives look great.",
        },
        {
            name: "Jana",
            title: "",
            rating: 5,
            header: "Great customer service and on-time delivery with product as advertised!",
            text: "The product arrived exactly as advertised and on time. This company was very easy to work with, and the price was great!",
        },
        {
            name: "Sarah",
            title: "",
            rating: 5,
            header: "Quick Turn-Around and Immediate Communisaton",
            text: "I've ordered a couple times from RELY. My initial order was not time sensitive so we had time to get it correct. We went back and forth with proofs until I felt comfortable. When I had a question, the sales team was very responsive. When it came to my re-order, I needed it fast. They responded and got it to me right on time.",
        },
        {
            name: "Ken",
            title: "",
            rating: 5,
            header: "Delivered as promised - no complaints",
            text: "Good pricing and quality. No complaints.",
        },
        {
            name: "Rob",
            title: "",
            rating: 5,
            header: "Fabulous experience, great suggestions from the staff!",
            text: "The sales staff had great suggestions and were very helpful in the process to, in the end, get exactly what was necessary for our use!",
        },
        {
            name: "Emily",
            title: "",
            rating: 5,
            header: "Great service!",
            text: "Everything went well as anticipated, and as planned. Service was superb & shipment was expedited in a speedy fashion! Thank you for your service!",
        },
        {
            name: "David",
            title: "",
            rating: 5,
            header: "Excellent Customer Service",
            text: "Excellent customer service. We encountered some issues with the items we had originally ordered but Relymedia was quick to offer a solution and was able to get us replacements in time to meet our event!",
        },
        {
            name: "Andrew",
            title: "",
            rating: 5,
            header: "Overall great experience.",
            text: "They are friendly and knowledgeable. They are well priced, and ship fast.",
        },
        {
            name: "Michelle",
            title: "",
            rating: 5,
            header: "Quality product - Friendly service.",
            text: "Worth the wait. Delivered as promised. Great advertisement pieces.",
        },
        {
            name: "Mark",
            title: "",
            rating: 5,
            header: "Outcomes",
            text: "To me, outcomes are most important. I had some initial issues with the person I worked with in terms of communication. But in the end, I got my drives, I got them on time, the data downloads were all perfect, and of equal importance, got them at a great price (we're a non-profit so cost was the primary factor in choosing RelyMedia in the first place). I'm happy to say we will buy from RelyMedia again this year.",
        },
        {
            name: "Freddy",
            title: "",
            rating: 5,
            header: "Thumbdrives",
            text: "2nd time I have ordered from these guys and they have a good product for the price. The delivery time was as said with no troubles. Would recommend and will be reordering again.",
        },
        {
            name: "Joe, President, SmartDaddy.info",
            title: "",
            rating: 5,
            header: "Great Pricing, Great Service!",
            text: "A very good bargain with people who follow up and care about their service. Ask for Andrew!",
        },
        {
            name: "Dave",
            title: "",
            rating: 5,
            header: "excellent",
            text: "as described. quick delivery",
        },
        {
            name: "Stacie",
            title: "",
            rating: 5,
            header: "Great customer service",
            text: "We had a LONG lead time until we were ready to place our order and they never made us feel pressured, or anxious about the multiple questions, etc. they assisted with. Great customer service.",
        },
        {
            name: "Barbara",
            title: "",
            rating: 5,
            header: "Excellent Work",
            text: "I really appreciate Andrew Randall at RELYMedia for his quick response and work to get our flash drive completed on time. I also appreciate RELYMedia working with us as a community college district and all the hoops and processes we have to jump through.",
        },
        {
            name: "Patty",
            title: "",
            rating: 5,
            header: "This is a top notch company. Awesome as what they do. Highly recommend.",
            text: "If you are looking for a company that says what they do and then do what they say - RELYmedia is for you!!! We have done a couple critical orders with RELYmedia and they were ahead of schedule and the items were perfect. We will be utilizing their talents again!!!",
        },
        {
            name: "Blanca",
            title: "",
            rating: 5,
            header: "Very responsive,",
            text: "All my inquiries were handled in a very timely fashion. My contact was courteous and helpful. Items ordered were received very quickly. Thanks for the superior service!",
        },
        {
            name: "Monique",
            title: "",
            rating: 5,
            header: "Great pricing and quick service for USB drives",
            text: "Everything went very well, from the time we requested the quote to when we received our order. Alex did a great job on follow up making sure the price and timing were right. I would order USB drives anytime from RELYmedia.",
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
                        <a 
                            href="https://www.trustpilot.com/review/relymedia.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block"
                        >
                            <Image src={trustpilot} alt="trustpilot" className="mx-auto cursor-pointer hover:opacity-80 transition-opacity" />
                        </a>
                    </figure>
                </div>

                <div className="w-full  mx-auto  relative px-[30px]">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        navigation={{
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="!overflow-y-visible !overflow-clip"
                        loop={true}
                    >
                        {testimonials.map((item, index) => (
                            <SwiperSlide key={index} className="!h-auto">
                                <a 
                                    href="https://www.trustpilot.com/review/relymedia.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <div className="bg-white border border-[#0000001A] rounded-[24px] sm:px-[30px] px-[20px] py-[36px] text-center flex flex-col items-center h-full cursor-pointer hover:shadow-lg transition-shadow min-h-[300px] max-h-[300px]">
                                        <h3 className="font-bold text-[16px] line-clamp-1">{item.name}</h3>
                                        {item.title && <p className="sm:text-[15px] text-[14px] line-clamp-1">{item.title}</p>}
                                        <div className="flex items-center justify-center mt-2">
                                            <img
                                                src="/images/stars-5.svg"
                                                alt="Rating"
                                                className="w-[106px] h-[20px]"
                                            />
                                            <span className="ml-2 text-[16px]">({item.rating})</span>
                                        </div>
                                        {item.header && (
                                            <h4 className="mt-[11px] font-semibold text-[16px] text-foreground line-clamp-2">
                                                {item.header}
                                            </h4>
                                        )}
                                        <p className="mt-[11px] sm:text-[16px] text-[14px] italic leading-[24px] line-clamp-4">{item.text}</p>
                                    </div>
                                </a>
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
