import styles from 'app/routes/style.js'
import React, { FC } from 'react';

import discount from "app/assets/Discount.svg";
import robot from "app/assets/robot.png";
import vandy from "app/assets/vandy.png";
import GetStarted from "app/components/GetStarted";
import newlogo from "app/assets/newlogo.png";
import byte from "app/assets/byte.png";
import friends from "app/assets/friends.webp";
import CSS from 'csstype';

const h1Styles: CSS.Properties = {
    fontFamily: 'Montserrat',
    fontSize: '4.5rem',
    color: 'gold',
  };

  const h2Styles: CSS.Properties = {
    fontFamily: 'roboto',
    fontSize: '4.5rem',
    color: 'red',
  };

  const h3Styles: CSS.Properties = {
    fontFamily: 'roboto',
    fontSize: '4.5rem',
    color: 'blue',
  };

  export function Heading({ title } : { title: string} ) {
    return <h1 style={h1Styles}>{title}</h1>;
  }
  
const Hero = () => {
  return (
    <section id="home" className={`flex md:flex-row top-0 flex-col ${styles.paddingY}`}>
      <div className={`flex-1 ${styles.flexStart} top-0 flex-col xl:px-0 sm:px-16 px-6`}>
        <div className="flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <img src={vandy} alt="vandy" className="w-[32px] h-[32px]" />
          <p className={`${styles.paragraph} ml-2`}>
            <span className="text-white">Limited to Vanderbilt Students</span> 
          </p>
        </div>

        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[42px] text-white ss:leading-[100.8px] leading-[75px]" style = {h1Styles}>
            Dine. Socialize.
             <br className="sm:block hidden" />{" "}
          </h1>
          <div className="ss:flex hidden md:mr-4 mr-0">
            {/* <GetStarted /> */}
          </div>
        </div>

        <h1 className="font-poppins font-semibold ss:text-[68px] text-[42px] text-white ss:leading-[100.8px] leading-[75px] w-full" style = {h3Styles}>
          Meet New Friends. 
        </h1>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Sign up and enter your food preferences. We'll match you with someone from your school to go try it out!
        </p>
      </div>

      <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}>
        <img src={friends} alt="billing" className="w-[95%] h-[100%] relative z-[5]" />

        {/* gradient start */}
        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
        {/* gradient end */}
      </div>

      <div className={`ss:hidden ${styles.flexCenter}`}>
        {/* <GetStarted /> */}
      </div>
    </section>
  );
};

export default Hero;