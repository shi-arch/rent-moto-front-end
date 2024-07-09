import { useEffect, useState } from "react";
import Image from "next/image";

import Logo from "../utils/assets/logo.png";
import Logo1 from "../utils/assets/Road-Trips-Cabot-Trail.jpg";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export const getWindowSize = () => {
    const [screenWidth, setScreenWidth] = useState(0);

    useEffect(() => {
        // Function to update the screen width
        const updateWidth = () => {
            setScreenWidth(window.innerWidth);
        };

        // Initial setting of the screen width
        updateWidth();

        // Event listener for window resize
        window.addEventListener('resize', updateWidth);

        // Cleanup the event listener on component unmount
        return () => window.removeEventListener('resize', updateWidth);
    }, []);
    return screenWidth
};

export const customHook = (data) => {
    const [test, setTest] = useState(0);
    useEffect(() => {
        setTest(data + 5)
    }, []);
    return test
};

export const MyCarousel = () => {
    return (
      <Carousel showArrows={true} autoPlay={true} infiniteLoop={true}>
        <div>
        <Image src={Logo1} width={40} height={40} alt="Slide 2"/>
          <p className="legend">Slide 1</p>
        </div>
        <div>
          <img src={Logo} alt="Slide 2" />
          <p className="legend">Slide 2</p>
        </div>
        <div>
          <img src={Logo} alt="Slide 3" />
          <p className="legend">Slide 3</p>
        </div>
      </Carousel>
    );
}