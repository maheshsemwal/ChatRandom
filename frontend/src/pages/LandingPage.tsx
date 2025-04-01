
import HeroSectionOne from "@/components/hero-section-demo-1"
import HowToCards  from "@/components/HowToCards"
import WhyChooseUs from "@/components/why-choose-us"
const LandingPage = () => {
  return (
    <>
        <HeroSectionOne/>
        <div className="">
          <HowToCards/>
        </div>
        <WhyChooseUs/>
    </>
  )
}

export default LandingPage