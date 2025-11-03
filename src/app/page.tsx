'use client';
import Header from "@/components/Site/Header";
import MainBanner from "@/components/Site/Main_Banner";
import Product_Categories from "@/components/Site/Product_Categories";
import BestSelling from "@/components/Site/Best_Selling";
import Services from "@/components/Site/Services";
import Search_Terms from "@/components/Site/Search_Terms";
import Customer_Feedback from "@/components/Site/Customer_Feedback";
import Client_Logo from "@/components/Site/Client_Logo";
import Footer from "@/components/Site/Footer";
export default function Home() {
  return (
      <>
          <Header/>
          <MainBanner/>
          <Product_Categories/>
          <BestSelling/>
          <Services/>
          <Search_Terms/>
          <Customer_Feedback/>
          <Client_Logo/>
          <Footer/>
      </>
  );
}

