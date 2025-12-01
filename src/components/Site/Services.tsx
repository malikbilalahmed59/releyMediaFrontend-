import React from 'react';
import Image from "next/image";
import Link from "next/link";
import services_img1 from "../../../public/images/hero-section/services_img1.jpg";
import group_people from "../../../public/images/hero-section/group people.jpg";
import ecommerce_store from "../../../public/images/hero-section/ecommerce store owner.jpg";

function Services() {
    const content = [
        {
            image: services_img1,
            title: "Too busy to shop around?",
            description: "Have a tight budget or deadline? Save time and let RELYmedia provide options to meet your exact needs.",
        },
        {
            image: group_people,
            title: "Missing artwork?",
            description: "We have graphic designers on staff and provide free proofs on every order.",
        },
        {
            image: ecommerce_store,
            title: "Need a sample?",
            description: "Contact us today and get a free sample on any item.",
        },
    ];

    return (
        <section className="2xl:pb-[80px] xl:pb-[60px] sm:pb-[50px] pb-[40px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-[20px]">
                    {content.map((item, index) => (
                        <Link
                            key={index}
                            href="/contact-us"
                            className="border border-[#25252533] py-[10px] pl-[12px] pr-[18px] flex xl:flex-row flex-col gap-[18px] rounded-[12px] hover:border-accent transition-colors cursor-pointer"
                        >
                            <figure className="rounded-[8px] overflow-hidden xl:w-[180px] shrink-0">
                                <Image src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </figure>
                            <div>
                                <h3 className="lg:text-[22px] text-[20px] leading-[24px] lg:leading-[30px] font-bold mb-[4px]">{item.title}</h3>
                                <p className="sm:text-[16px] text-[14px] leading-[20px] sm:leading-[24px]">{item.description}</p>
                            </div>
                        </Link>
                    ))}

                </div>
            </div>
        </section>
    );
}

export default Services;
