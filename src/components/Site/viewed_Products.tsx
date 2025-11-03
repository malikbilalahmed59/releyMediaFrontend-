import React from 'react';
import BuyCart from "@/components/Site/Buy_Cart";

function ViewedProducts() {
    return (
        <div className="bg-gradient py-[80px] mb-[80px] recently-viewed-con">
            <div className="wrapper">
                <h2 className="text-[36px] leading-[36px] font-bold  mb-[40px] text-center">Recently viewed products</h2>
                <BuyCart/>
            </div>
        </div>
    );
}

export default ViewedProducts;