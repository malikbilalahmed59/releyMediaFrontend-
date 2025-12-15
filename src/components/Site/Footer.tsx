'use client';
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import footer_logo from "../../../public/images/footer_logo.svg";
import {
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    PhoneCall,
    Timer,
    ShoppingCart,
    CreditCard,
    UserCircle,
    LogIn,
    LogOut,
    UserPlus,
} from "lucide-react";

// Custom X (Twitter) logo component
const XLogo = ({ size = 16 }: { size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const footerData = {
    tagline: "Innovative Solutions. Exceptional Service",
    socialLinks: [
        { icon: Facebook, url: "https://www.facebook.com/profile.php?id=100076356070878", label: "Facebook" },
        { icon: Instagram, url: "https://www.instagram.com/rely.media/", label: "Instagram" },
        { icon: Linkedin, url: "https://www.linkedin.com/company/relymedia/", label: "LinkedIn" },
        { icon: XLogo, url: "https://x.com/relymedia", label: "X" },
    ],
    sections: [
        {
            title: "Corporate",
            links: [
                { label: "About Us", url: "/about-us" },
                { label: "Contact Us", url: "/contact-us" },
                { label: "Terms of Use", url: "/terms-of-use" },
                { label: "Privacy Policy", url: "/privacy-policy" },
                { label: "Sitemap", url: "/site-map" },
            ],
        },
        {
            title: "Services",
            links: [
                { label: "ASI Distributors & Other Resellers", url: "/asi-distributors-resellers" },
                { label: "Custom Colors", url: "/custom-colors" },
                { label: "Custom Flash Drives", url: "/custom-flash-drives" },
                { label: "Data Services", url: "/custom-data-services" },
                { label: "Imprint Options", url: "/custom-imprint-options" },
                { label: "Packaging and Distribution", url: "/packaging-and-distribution" },
                { label: "24 Hour Rush Service", url: "/24-hour-rush-service" },
            ],
        },
        {
            title: "Contact",
            links: [
                {
                    icon: PhoneCall,
                    label: "(952) 476-2094",
                    url: "tel:(952)476-2094",
                },
                {
                    icon: PhoneCall,
                    label: "(866) 476-2095",
                    url: "tel:(866)476-2095",
                },
                                {
                                    icon: Timer,
                                    label: (
                                        <>
                                            {/*8:00 am to 5:00 pm CST — <strong>Monday through Friday</strong>*/}
                                            <div className="flex flex-col">
                                                <span>8am - 5pm CST</span>
                                                <strong>Mon - Fri</strong>
                                            </div>
                                        </>
                                    ),
                                    url: null,
                                },
                {
                    icon: Mail,
                    label: "sales@relymedia.com",
                    url: "mailto:sales@relymedia.com",
                },
                                {
                                    icon: MapPin,
                                    label: (
                                        <>
                                            RELYmedia <br />
                                            1170 Eagan Industrial Road <br />
                                            Suite 1 <br />
                                            Eagan MN 55121
                                        </>
                                    ),
                                    url: null,
                                },
            ],
        },
    ],
    bottomBar: {
        copyright:
            "© Copyright 2002–2025 RELYmedia. All Rights Reserved",
        callToAction: {
            label: "Call Now!",
            phone: "1.866.476.2095",
            phoneUrl: "tel:1.866.476.2095",
            email: "sales@relymedia.com",
        },
    },
};

function Footer() {
    const pathname = usePathname();
    
    return (
        <footer className="bg-[url(/images/footer_bg.jpg)] bg-center bg-cover bg-no-repeat xl:pt-[68px] pt-[58px] relative black_layers">
            <div className="wrapper relative z-10 2xl:px-0 px-[15px]">
                <div className="mb-[35px] grid 2xl:[grid-template-columns:33%_17%_18%_31.9%] xl:[grid-template-columns:26%_17%_18%_33.9%] gap-y-[20px] lg:[grid-template-columns:24%_11%_16%_39.9%]
                 sm:[grid-template-columns:14%_24%_34%] [grid-template-columns:50%_50%]
                 justify-between">
                    {/* Logo + tagline + social */}
                    <div className="lg:col-auto col-span-full lg:text-left text-center lg:mb-0 mb-[20px]">
                        <Link href="/" className="sm:mb-[20px] mb-[10px] inline-block">
                            <figure>
                                <Image src={footer_logo} alt="footer_logo" className="sm:w-auto w-[120px]"/>
                            </figure>
                        </Link>
                        <span className="block text-[15px] leading-[15px] text-[#FFFFFFCC] lg:mb-[33px] sm:mb-[20px] mb-[10px]">{footerData.tagline}</span>
                        <ul className="flex gap-[8px] lg:justify-start justify-center">
                            {footerData.socialLinks.map((social, index) => (
                                <li key={index}>
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-[34px] h-[34px] flex items-center justify-center bg-[#FFFFFF33] rounded-full text-white hover:bg-[#FFFFFF66] transition-colors"
                                        aria-label={social.label}
                                    >
                                        {social.label === "X" ? (
                                            <XLogo size={16} />
                                        ) : (
                                            <social.icon size={16} />
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sections */}
                    {footerData.sections.map((section, index) => (
                        <div key={index} className="text-white">
                            <h5 className="sm:text-[20px] text-[18px] leading-[20px] font-bold mb-[15px]">
                                {section.title}
                            </h5>
                            <ul className="lg:space-y-[19px] space-y-[10px] plusJakarta-font">
                                {section.links.map((link, i) => {
                                    const Icon = 'icon' in link ? link.icon : null;
                                    const isActive = link.url && pathname === link.url;
                                    const hasUrl = link.url && link.url !== '#';
                                    
                                    return (
                                        <li key={i} className="lg:text-[15px] text-[12px] leading-[18px]">
                                            {hasUrl ? (
                                                <Link 
                                                    href={link.url} 
                                                    className={`flex gap-[10px] transition-colors ${
                                                        isActive 
                                                            ? 'font-bold text-accent' 
                                                            : 'hover:text-accent'
                                                    }`}
                                                >
                                                    {Icon && <Icon size={20} />}
                                                    {link.label}
                                                </Link>
                                            ) : (
                                                <span className="flex gap-[10px]">
                                                    {Icon && <Icon size={20} />}
                                                    {link.label}
                                                </span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#ffffff33] flex lg:py-[18px] py-[10px] text-white items-center sm:justify-between justify-center">
                    <div className="lg:text-[15px] text-[14px] leading-[14px] lg:leading-[15px]">
                        {footerData.bottomBar.copyright}
                    </div>
                    <ul className="sm:flex items-center gap-[5px] hidden">
                        <li className="lg:text-[15px] text-[14px] leading-[14px] lg:leading-[15px] font-bold border-r border-white pr-[5px]">
                            {footerData.bottomBar.callToAction.label}{" "}
                            <Link
                                href={footerData.bottomBar.callToAction.phoneUrl}
                                className="lg:text-[15px] text-[14px] leading-[14px] lg:leading-[15px] font-bold"
                            >
                                {footerData.bottomBar.callToAction.phone}
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`mailto:${footerData.bottomBar.callToAction.email}`}
                                className="lg:text-[15px] text-[14px] leading-[14px] lg:leading-[15px]"
                            >
                                {footerData.bottomBar.callToAction.email}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
