import React from 'react';
import Link from "next/link";

interface PortfolioData {
    title: string;
    descriptionLeft: string;
    descriptionRight?: string;
    fullContent?: string; // For single column full content
    buttonText?: string;
    buttonLink?: string;
}

interface PortfolioSectionProps {
    data: PortfolioData;
}

const PortfolioDataSection: React.FC<PortfolioSectionProps> = ({ data }) => {
    return (
        <section className="md:pt-[60px] pt-[30px] md:pb-[80px] pb-[40px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <div>
                    <h2 className="2xl:text-[36px] xl:text-[32px] lg:text-[30px] sm:text-[28px] text-[24px] leading-[30px] lg:leading-[34px] xl:leading-[36px] font-bold 2xl:mb-[25px] mb-[20px] text-center">
                        {data.title}
                    </h2>

                    <div className="max-w-4xl mx-auto text-[16px] leading-[24px] text-[#151515cc] [&>div>p]:mb-4 [&>div>p:last-child]:mb-0">
                        {/* ✅ Render HTML safely - single column */}
                        <div dangerouslySetInnerHTML={{ __html: data.fullContent || (data.descriptionLeft + (data.descriptionRight ? ' ' + data.descriptionRight : '')) }} />
                    </div>

                    {/* ✅ Only render button if text is provided */}
                    {data.buttonText && data.buttonLink && (
                        <div className="mt-[25px]">
                            <Link
                                href={data.buttonLink}
                                className="inline-block bg-accent hover:bg-accent/80 text-white font-medium md:py-[13px] py-[8px] md:px-[59px] px-[39px] text-[16px] rounded-[12px] transition"
                            >
                                {data.buttonText}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PortfolioDataSection;
