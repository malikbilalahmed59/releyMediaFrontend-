'use client';
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
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
                { label: "Invoice Payment", url: "/invoice-payment" },
                { label: "Terms of Use", url: "/terms-of-use" },
                { label: "Privacy Policy", url: "/privacy-policy" },
                { label: "Sitemap", url: "/site-map" },
            ],
        },
        {
            title: "Services",
            links: [
                { label: "ASI Distributors", url: "/asi-distributors-resellers" },
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
                                            <span className="whitespace-nowrap">1170 Eagan Industrial Rd</span> <br />
                                            Suite 1 <br />
                                            Eagan, MN 55121
                                        </>
                                    ),
                                    url: "https://maps.app.goo.gl/5c5DXyDJN4BqW3sV9",
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
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();
    
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    
    return (
        <footer className="bg-[url(/images/footer_bg.jpg)] bg-center bg-cover bg-no-repeat xl:pt-[68px] pt-[58px] relative black_layers">
            <div className="wrapper relative z-10 2xl:px-0 px-[15px]">
                <div className="mb-[35px] grid 2xl:[grid-template-columns:33%_17%_18%_31.9%] xl:[grid-template-columns:26%_17%_18%_33.9%] gap-y-[20px] lg:[grid-template-columns:24%_11%_16%_39.9%]
                 sm:[grid-template-columns:14%_24%_34%] [grid-template-columns:38%_43%]
                 sm:justify-between justify-around gird_items_con">
                    {/* Logo + tagline + social */}
                    <div className="lg:col-auto col-span-full lg:text-left text-center lg:mb-0 mb-[20px]">
                        <Link href="/" className="sm:mb-[20px] mb-[10px] inline-block">
                            <figure>
                                <Image src={footer_logo} alt="footer_logo" className="sm:w-auto w-[120px]"/>
                            </figure>
                        </Link>
                        <span className="block text-[15px] leading-[15px] text-[#FFFFFFCC] lg:mb-[33px] sm:mb-[20px] mb-[10px]">{footerData.tagline}</span>
                        <ul className="flex gap-[8px] lg:justify-start justify-center mb-[20px]">
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
                        <div className="grid [grid-template-columns:50%_50%] gap-x-0 gap-y-[10px] plusJakarta-font lg:text-left text-center">
                            <Link href="/cart" className="flex gap-[10px] items-center text-white lg:text-[15px] text-[12px] leading-[18px] hover:text-accent transition-colors">
                                <ShoppingCart size={20} />
                                <span>View Cart</span>
                            </Link>
                            <Link href="/checkout" className="flex gap-[10px] items-center text-white lg:text-[15px] text-[12px] leading-[18px] hover:text-accent transition-colors">
                                <CreditCard size={20} />
                                <span>Proceed to Checkout</span>
                            </Link>
                            <Link 
                                href="/profile" 
                                onClick={(e) => {
                                    if (!isAuthenticated) {
                                        e.preventDefault();
                                        router.push(`/signin?returnUrl=${encodeURIComponent('/profile')}`);
                                    }
                                }}
                                className="flex gap-[10px] items-center text-white lg:text-[15px] text-[12px] leading-[18px] hover:text-accent transition-colors"
                            >
                                <UserCircle size={20} />
                                <span>My Account</span>
                            </Link>
                            {isAuthenticated ? (
                                <button 
                                    onClick={handleLogout}
                                    className="flex gap-[10px] items-center text-white lg:text-[15px] text-[12px] leading-[18px] hover:text-accent transition-colors lg:text-left text-center"
                                >
                                    <LogOut size={20} />
                                    <span>Sign Out</span>
                                </button>
                            ) : (
                                <Link href="/signin" className="flex gap-[10px] items-center text-white lg:text-[15px] text-[12px] leading-[18px] hover:text-accent transition-colors">
                                    <LogIn size={20} />
                                    <span>Sign In</span>
                                </Link>
                            )}
                            {!isAuthenticated && (
                                <Link href="/signup" className="flex gap-[10px] items-center text-white lg:text-[15px] text-[12px] leading-[18px] hover:text-accent transition-colors col-span-2">
                                    <UserPlus size={20} />
                                    <span>Create an Account</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Sections */}
                    {footerData.sections.map((section, index) => {
                        // For Contact section on mobile, split into two columns
                        const isContactSection = section.title === "Contact";
                        const contactLeftLinks = isContactSection ? section.links.slice(0, 3) : []; // Phone numbers and hours
                        const contactRightLinks = isContactSection ? section.links.slice(3) : []; // Email and address
                        
                        return (
                            <div key={index} className="text-white last:sm:col-auto last:col-span-full">
                                <h5 className="sm:text-[20px] text-[18px] leading-[20px] font-bold mb-[15px]">
                                    {section.title}
                                </h5>
                                {isContactSection ? (
                                    <div className="sm:block flex gap-[20px]">
                                        {/* Left column - Phone numbers and hours */}
                                        <ul className="lg:space-y-[19px] space-y-[10px] plusJakarta-font flex-1">
                                            {contactLeftLinks.map((link, i) => {
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
                                        {/* Right column - Email and address */}
                                        <ul className="lg:space-y-[19px] space-y-[10px] plusJakarta-font flex-1 lg:mt-[19px] mt-0">
                                            {contactRightLinks.map((link, i) => {
                                                const Icon = 'icon' in link ? link.icon : null;
                                                const isActive = link.url && pathname === link.url;
                                                const hasUrl = link.url && link.url !== '#';
                                                const isExternal = hasUrl && (link.url.startsWith('http://') || link.url.startsWith('https://'));
                                                
                                                return (
                                                    <li key={i} className="lg:text-[15px] text-[12px] leading-[18px]">
                                                        {hasUrl ? (
                                                            isExternal ? (
                                                                <a 
                                                                    href={link.url} 
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`flex gap-[10px] transition-colors ${
                                                                        isActive 
                                                                            ? 'font-bold text-accent' 
                                                                            : 'hover:text-accent'
                                                                    }`}
                                                                >
                                                                    {Icon && <Icon size={20} />}
                                                                    {link.label}
                                                                </a>
                                                            ) : (
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
                                                            )
                                                        ) : (
                                                            <span className="flex items-start gap-[10px] sm:w-auto min-w-[180px]">
                                                                {Icon && <Icon size={20} className="mt-0.5 flex-shrink-0" />}
                                                                <span className="block">{link.label}</span>
                                                            </span>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ) : (
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
                                )}
                            </div>
                        );
                    })}
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
