import React from 'react';
import FilterSidebar from "@/components/Site/FilterSidebar";
import BuyCart from "@/components/Site/Buy_Cart";
import SortByFilter from "@/components/Site/SortByFilter";



function ProductGrid() {

    return (
        <div className="py-[50px] pb-[75px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <div className="grid xl:grid-cols-[24.5%_74%] lg:grid-cols-[30.5%_67.5%] sm:grid-cols-[41.5%_55.5%] gap-[17px]">
                    <div><FilterSidebar/></div>
                    <div className="">
                        <div className="mb-[30px]">
                            <SortByFilter/>
                        </div>
                        <BuyCart/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductGrid;