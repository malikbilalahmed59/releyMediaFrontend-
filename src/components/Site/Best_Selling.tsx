import React from 'react';
import BuyCart from "@/components/Site/Buy_Cart";

function BestSelling() {
    return (
        <section className="2xl:pb-[80px] xl:py-[60px] sm:py-[50px] py-[40px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <h2 className="2xl:text-[36px] xl:text-[32px] lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-bold  2xl:mb-[40px] lg:mb-[36px] sm:mb-[30px] mb-[20px] text-center">Best Selling</h2>
                <BuyCart/>
            </div>
        </section>
    );
}

export default BestSelling;