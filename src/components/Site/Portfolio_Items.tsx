import React from "react";
import Image from "next/image";
import Link from "next/link";

import portfolio_item1 from "../../../public/images/portfolio_item1.png";
import portfolio_item2 from "../../../public/images/portfolio_item2.png";
import portfolio_item3 from "../../../public/images/portfolio_item3.png";
import portfolio_item4 from "../../../public/images/portfolio_item4.png";
import portfolio_item5 from "../../../public/images/portfolio_item5.png";
import portfolio_item6 from "../../../public/images/portfolio_item6.png";
import portfolio_item7 from "../../../public/images/portfolio_item7.png";
import portfolio_item8 from "../../../public/images/portfolio_item8.png";
import portfolio_item9 from "../../../public/images/portfolio_item9.png";
import portfolio_item10 from "../../../public/images/portfolio_item10.png";
import portfolio_item11 from "../../../public/images/portfolio_item11.png";
import portfolio_item12 from "../../../public/images/portfolio_item12.png";

function Portfolio_Items() {
    const content = {
        title: "Flash Drive Portfolio",
        items: [
            { id: 1, img: portfolio_item1, link: "#" },
            { id: 2, img: portfolio_item2, link: "#" },
            { id: 3, img: portfolio_item3, link: "#" },
            { id: 4, img: portfolio_item4, link: "#" },
            { id: 5, img: portfolio_item5, link: "#" },
            { id: 6, img: portfolio_item6, link: "#" },
            { id: 7, img: portfolio_item7, link: "#" },
            { id: 8, img: portfolio_item8, link: "#" },
            { id: 9, img: portfolio_item9, link: "#" },
            { id: 10, img: portfolio_item10, link: "#" },
            { id: 11, img: portfolio_item11, link: "#" },
            { id: 12, img: portfolio_item12, link: "#" },
        ],
    };

    return (
        <section className="2xl:py-[80px] xl:py-[60px] sm:py-[50px] py-[40px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <h2 className="2xl:text-[36px] xl:text-[32px] lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-bold  2xl:mb-[25px] mb-[20px] ">
                    {content.title}
                </h2>
                <div className="grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-5  sm:grid-cols-4 grid-cols-2  gap-[20px] justify-between">
                    {content.items.map((item) => (
                        <div key={item.id} className="text-center">
                            <Link href={item.link}>
                                <figure className="bg-gradient h-[138px] p-[20px] xl:w-[138px] flex items-center justify-center rounded-[17px] mx-auto transition-transform hover:scale-105">
                                    <Image
                                        src={item.img}
                                        alt={`Portfolio item ${item.id}`}
                                        className="w-full h-full object-contain"
                                    />
                                </figure>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Portfolio_Items;
