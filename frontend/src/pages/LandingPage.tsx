
import HeroSectionOne from "@/components/hero-section-demo-1"
import HowToCards  from "@/components/HowToCards"
import WhyChooseUs from "@/components/why-choose-us"
import { useUser } from "@/context/UserProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
 
  const navigate = useNavigate()
  const {user} = useUser();

  useEffect(() => {
    if (user) {
      navigate("/chat")
    }
  }, [user, navigate])
 
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