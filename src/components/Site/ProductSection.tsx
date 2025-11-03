'use client'
import Link from "next/link"
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/thumbs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export default function ProductSection() {
    const [selectedColor, setSelectedColor] = useState('silver-black')
    const [selectedCapacity, setSelectedCapacity] = useState('50+ EA : $4.39')
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)

    const colors = [
        { name: 'Silver & Black', value: 'silver-black', hex: 'bg-[#F5F5F5]' },
        { name: 'Blue', value: 'blue', hex: 'bg-[#252525]' },
        { name: 'White', value: 'white', hex: 'bg-[#66BEDA]' },
        { name: 'Red', value: 'red', hex: 'bg-[#EB9B00]' },
        { name: 'Yellow', value: 'yellow', hex: 'bg-[#EB001B]' },
    ]

    const capacities = ['50+ EA : $4.39', '500+ EA : $3.42', '1000+ EA : $3.08','5000+ EA : $2.96','10,000+ EA : $2.03']
    const images = ['/images/flash_drive.png', '/images/flash_drive.png', '/images/flash_drive.png', '/images/flash_drive.png', '/images/flash_drive.png']

    return (
        <section className="py-[40px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
                <ul className="flex gap-[5px] items-center mb-[11px]">
                    <li className="flex items-center gap-1">
                        <Link href="" className="text-[16px] leading-[16px] font-semibold text-[#111111CC]  hover:text-accent">Home</Link> <span>-</span>
                    </li>
                    <li className="flex items-center gap-1 text-[#111111] font-black">Products</li>
                </ul>
                <div className="grid grid-cols-1 xl:grid-cols-[55.83%_40.6%] md:grid-cols-[51.83%_43.6%] lg:gap-[43px] gap-[20px]">
                    {/* Image Slider with Thumbnails */}
                    <div>
                        <Swiper
                            modules={[Thumbs]}
                            thumbs={{swiper: thumbsSwiper}}
                            spaceBetween={10}
                            slidesPerView={1}
                            className="2xl:h-[598px] sm:h-[400px] h-[300px] overflow-hidden border-[#E1E1E1] border rounded-[20px]"
                        >
                            {images.map((src, i) => (
                                <SwiperSlide key={i} className="!flex items-center justify-center">
                                    <img src={src} alt={`USB Drive ${i}`} className=""/>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <Swiper
                            modules={[Thumbs]}
                            onSwiper={setThumbsSwiper}
                            spaceBetween={8}
                            slidesPerView={5}
                            watchSlidesProgress
                            className="mt-3"
                        >
                            {images.map((src, i) => (
                                <SwiperSlide key={i}
                                             className="border border-[#E1E1E1] sm:rounded-[20px] rounded-[10px] lg:!h-[101px] !h-[80px] !flex items-center justify-center">
                                    <img
                                        src={src}
                                        alt={`thumb ${i}`}
                                        className=" cursor-pointer w-[80px]"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="mt-6">
                            <h3 className="text-[20px] leading-[20px] font-semibold sm:mb-[30px] mb-[10px]">What's in the box?</h3>
                            <ul className="list-disc pl-5 text-[16px]  space-y-2">
                                <li>1 × USB Flash Drive (chosen capacity & color)</li>
                                <li>Quick start insert</li>
                                <li>1-year replacement warranty card</li>
                            </ul>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        <span className="inline-block text-[16px] leading-[16px] text-[#252525E5] mb-[10px]">USB Flash Drive</span>
                        <h1 className="2xl:text-[40px] xl:text-[34px] sm:text-[28px] text-[26px] leading-[32px] xl:leading-[40px] 2xl:leading-[50px] font-semibold mb-[10px]">High-Speed USB Flash Drive
                            (Silver & Black)</h1>
                        <div className="flex items-center gap-1 text-yellow-500 mb-[10px]">
                            {[...Array(4)].map((_, i) => <Star key={i} size={16} fill="currentColor"/>)}
                            <Star size={16} className="text-gray-300"/>
                            <span className="ml-2 text-[15px] text-foreground">(4.5) 155 Reviews</span>
                        </div>

                        <p className="xl:text-[30px] sm:text-[28px] text-[24px] font-bold mb-0">$49.99 <span className="text-[16px] font-Regular">(Inclusive of taxes)</span>
                        </p>
                        <p className=" text-[16px] mb-[10px]">Available — Free returns within 7 days</p>
                        <div className="xl:mb-6 mb-4">
                            <label htmlFor="storage" className="block font-semibold mb-[8px] text-[16px] mb-1">Storage
                                Capacity</label>
                            <Select>
                                <SelectTrigger id="storage"
                                               className="w-full text-foreground text-[14px] rounded-[6px] border-[#2525251A] h-auto py-[8px] px-[19px] ocus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none">
                                    <SelectValue placeholder="64GB"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="64gb">64GB</SelectItem>
                                    <SelectItem value="128gb">128GB</SelectItem>
                                    <SelectItem value="256gb">256GB</SelectItem>
                                    <SelectItem value="512gb">512GB</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="xl:mb-6 mb-4">
                            <label className="block font-semibold mb-[8px] text-[16px] mb-1">Color</label>
                            <div className="flex gap-[10px]">
                                {colors.map((c) => (
                                    <button
                                        key={c.value}
                                        className={`w-[40px] h-[40px] rounded-[6px] border cursor-pointer ${c.hex} `}
                                        onClick={() => setSelectedColor(c.value)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="xl:mb-6 mb-4">
                            <label className="block font-semibold mb-[8px] text-[16px]">Pricing</label>
                            <div className="flex gap-[12px] flex-wrap">
                                {capacities.map((cap) => (
                                    <Button
                                        key={cap}
                                        variant={selectedCapacity === cap ? 'default' : 'outline'}
                                        onClick={() => setSelectedCapacity(cap)}
                                        className={`text-[16px] leading-[16px] bg-[#2525250D] rounded-[4px] cursor-pointer hover:bg-[#2525250D] hover:text-foreground
      ${selectedCapacity === cap ? 'border-[#000000B2] border text-foreground hover:bg-transparent' : 'border-transparent '}`
                                        }
                                    >
                                        {cap}
                                    </Button>
                                ))}
                            </div>
                        </div>


                        <div className="flex gap-3 xl:mb-6 mb-4">
                            <Button
                                className="flex-1 bg-foreground md:text-[16px] text-[14px] font-bold rounded-[12px] h-auto xl:py-[14px] sm:py-[10px] py-[8px] cursor-pointer"
                                variant="secondary">Add to Cart</Button>
                            <Button variant="outline"
                                    className="flex-1 md:text-[16px] text-[14px] font-bold rounded-[12px] h-auto xl:py-[14px] sm:py-[10px] py-[8px] cursor-pointer hover:text-white">Buy
                                Now</Button>
                        </div>

                        <div className="space-y-[25px]">
                            <div>
                                <h3 className="font-bold text-[20px] leading-[20px] mb-[10px]">Product Description</h3>
                                <p className="sm:text-[16px] text-[14px] leading-[24px]">Experience lightning-fast transfers and
                                    durable build with the High-Speed USB Flash Drive. Perfect for students,
                                    professionals and photographers who need fast, reliable storage on the go.</p>
                            </div>

                            <div>
                                <h3 className="font-bold text-[20px] leading-[20px] mb-[10px]">Key Features:</h3>
                                <ul className="list-disc pl-5 space-y-1 sm:text-[16px] text-[14px] font-Regular">
                                    <li>Available in 32GB / 64GB / 128GB options</li>
                                    <li>High-speed USB 3.0 interface</li>
                                    <li>Aluminum alloy body with protective cap</li>
                                    <li>Plug & Play — no software required</li>
                                    <li>Compatible with Windows, macOS, Linux</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-[20px] leading-[20px] mb-[10px]">Warranty & Support</h3>
                                <p className="sm:text-[16px] text-[14px] leading-[24px]">1-year replacement warranty. For support,
                                    email <Link href="#"
                                                className="text-accent underline italic font-semibold">support@relymedia.com</Link>
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-[10px]">
                                    <h3 className="font-bold text-[20px] leading-[20px] ">Customer Reviews </h3>
                                    <span className="font-semibold">(4.8/5 from 250 reviews)</span>
                                </div>
                                <div className="rounded-lg bg-gradient px-4 py-[8px] border-l-4 border-accent">
                                    <p className="sm:text-[16px] text-[14px] text-foreground font-Regular mb-1">
                                        “Excellent quality and super fast speed — totally worth the price!”
                                    </p>
                                    <p className="font-bold text-[15px] text-foreground">Ayesha R.</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-[20px] leading-[20px] mb-[10px]">Technical
                                    Specifications</h3>
                                <ul className="list-disc pl-5 space-y-1 sm:text-[16px] text-[14px] font-Regular">
                                    <li><strong>Interface:</strong> USB 3.0 (backward compatible with USB 2.0)</li>
                                    <li><strong>Material:</strong> Metal + ABS</li>
                                    <li><strong>Read Speed:</strong> Up to 120 MB/s</li>
                                    <li><strong>Write Speed:</strong> Up to 40 MB/s</li>
                                    <li><strong>Operating Temperature:</strong> 0°C to 60°C</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
