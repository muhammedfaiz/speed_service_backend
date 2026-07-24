import Footer from "../../components/user/Footer";
import CategoryCarousel from "../../components/user/CategoryCarousel";
import HowItWorks from "../../components/user/HowItWorks";
import Navbar from "../../components/user/Navbar";
import ServicesHome from "../../components/user/ServicesHome";
import Testimonials from "../../components/user/Testimonials";
import Hero from "../../components/user/sections/Hero";
import FeaturedProfessionals from "../../components/user/sections/FeaturedProfessionals";
import WhyChooseUs from "../../components/user/sections/WhyChooseUs";
import MobileAppPromo from "../../components/user/sections/MobileAppPromo";
import FAQ from "../../components/user/sections/FAQ";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <ServicesHome />
      <CategoryCarousel />
      <HowItWorks />
      <FeaturedProfessionals />
      <WhyChooseUs />
      <Testimonials />
      <MobileAppPromo />
      <FAQ />
      <Footer />
    </>
  );
};
export default HomePage;
