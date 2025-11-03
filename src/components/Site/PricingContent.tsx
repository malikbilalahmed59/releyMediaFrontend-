import React from 'react';
import Link from "next/link";

function PricingContent() {
    const products = [
        [
            "64MB Custom USB flash drives as low as $1.50",
            "20 oz. Stainless steel tumblers as low as $6.50",
            "18 oz. Stainless steel water bottles as low as $7.30",
        ],
        [
            "1GB Custom USB flash drives as low as $1.90",
            "30 oz. Stainless steel tumblers as low as $7.10",
            "34 oz. Stainless steel water bottles as low as $8.95",
        ],
        [
            "32GB Custom USB flash drives as low as $2.60",
            "32GB Custom USB flash drives as low as $2.60",
            "32GB Custom USB flash drives as low as $2.60",
        ],
    ];
    return (
        <section className="md:pt-[60px] pt-[30px] md:pb-[80px] pb-[40px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <h2 className="2xl:text-[36px] xl:text-[32px] lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-bold  2xl:mb-[25px] mb-[20px] ">Pricing</h2>
                <p className="text-[#151515cc] mb-6 text-[16px] leading-[24px]">
                    <span className="font-bold">RELYmedia</span> is committed to
                    providing our customers with competitive pricing on all products and
                    services. Our pricing is straight-forward and based on your desired
                    quantity and specific requirements. With RELYmedia, there are no setup
                    or other hidden fees. Below is a sampling of our bulk rates. To get an
                    accurate price for your project,{" "}
                    <Link
                        href="#"
                        className="text-accent hover:underline font-black"
                    >
                        please request a quote
                    </Link>
                    .
                </p>

                <div className="grid md:grid-cols-3 gap-6 text-gray-800">
                    {products.map((col, i) => (
                        <ul key={i} className="list-disc list-inside space-y-2">
                            {col.map((item, j) => (
                                <li key={j}>{item}</li>
                            ))}
                        </ul>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PricingContent;