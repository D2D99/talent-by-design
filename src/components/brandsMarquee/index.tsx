// "use client";

import React, { useState, useEffect } from "react";
import type { ComponentType, ReactNode } from "react";
import Marquee from "react-fast-marquee";

interface MarqueeProps {
  children?: ReactNode;
  speed?: number;
  play?: boolean;
  gradient?: boolean;
  autoFill?: boolean;
}

const SafeMarquee: React.FC = () => {
  const [showMarquee, setShowMarquee] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMarquee(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const MarqueeComponent =
    (Marquee as unknown as { default: ComponentType<MarqueeProps> }).default ||
    (Marquee as ComponentType<MarqueeProps>);

  return (
    <div style={{ minHeight: "50px" }} className="lg:w-8/12 w-full">
      {showMarquee && (
        <MarqueeComponent speed={50} autoFill={true} gradient={false}>
          <div className="lg:mt-0 mt-5 flex gap-14 pr-14">
            <img src="../static/img/home/ic-marquee-1.svg" alt="Logo 1" />
            <img src="../static/img/home/ic-marquee-2.svg" alt="Logo 2" />
            <img src="../static/img/home/ic-marquee-3.svg" alt="Logo 3" />
            <img src="../static/img/home/ic-marquee-4.svg" alt="Logo 4" />
            <img src="../static/img/home/ic-marquee-5.svg" alt="Logo 5" />
            <img src="../static/img/home/ic-marquee-6.svg" alt="Logo 6" />
          </div>
        </MarqueeComponent>
      )}
    </div>
  );
};

export default SafeMarquee;
