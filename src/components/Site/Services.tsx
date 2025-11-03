import React from 'react';
import Image from "next/image";
import services_img1 from "../../../public/images/hero-section/services_img1.jpg";
import group_people from "../../../public/images/hero-section/group people.jpg";
import ecommerce_store from "../../../public/images/hero-section/ecorce store owner.jpg";

function Services() {
    const content = [
        {
            image: services_img1,
            title: "Too busy to shop around?",
            description: "Have a tight budget or deadline? Save time and let RELYmedia provide options to meet your exact needs.",
        },
        {
            image: group_people,
            title: "Need creative marketing materials?",
            description: "From concept to delivery, our team designs engaging print and digital assets tailored for your brand.",
        },
        {
            image: ecommerce_store,
            title: "Looking for reliable fulfillment?",
            description: "We handle storage, kitting, and shipping so you can focus on growing your business stress-free.",
        },
    ];

    return (
        <section className="2xl:pb-[80px] xl:pb-[60px] sm:pb-[50px] pb-[40px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-[20px]">
                    {content.map((item, index) => (
                        <div
                            key={index}
                            className="border border-[#25252533] py-[10px] pl-[12px] pr-[18px] flex xl:flex-row flex-col gap-[18px] rounded-[12px]"
                        >
                            <figure className="rounded-[8px] overflow-hidden xl:w-[180px] shrink-0">
                                <Image src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </figure>
                            <div>
                                <h3 className="lg:text-[22px] text-[20px] leading-[24px] lg:leading-[30px] font-bold mb-[4px]">{item.title}</h3>
                                <p className="sm:text-[16px] text-[14px] leading-[20px] sm:leading-[24px]">{item.description}</p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}

export default Services;
