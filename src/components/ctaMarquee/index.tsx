// "use client";

import React, { useState, useEffect } from "react";
import type { ComponentType, ReactNode } from "react";
import Marquee from "react-fast-marquee";
import Workplace from "../../../public/static/img/icons/workplace.svg";

interface MarqueeProps {
  children?: ReactNode;
  speed?: number;
  play?: boolean;
  gradient?: boolean;
  autoFill?: boolean;
}

const CtaMarquee: React.FC = () => {
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
    <div style={{ minHeight: "50px" }} className="w-full">
      {showMarquee && (
        <MarqueeComponent speed={50} autoFill={true} gradient={false}>
          <div className="flex gap-14 pr-14">
            <div className="flex gap-5 items-center">
              <img
                src={Workplace}
                alt="Ic-workplace"
                className="lg:w-auto w-10"
              />
              <span className="text-[var(--white-color)] lg:text-4xl text-3xl font-medium">
                Let's Talk Modern Workplace Performance
              </span>
            </div>
            <div className="flex gap-5 items-center">
              <img
                src={Workplace}
                alt="Ic-workplace"
                className="lg:w-auto w-10"
              />
              <span className="text-[var(--white-color)] lg:text-4xl text-3xl font-medium">
                Let's Talk Modern Workplace Performance
              </span>
            </div>
            <div className="flex gap-5 items-center">
              <img
                src={Workplace}
                alt="Ic-workplace"
                className="lg:w-auto w-10"
              />
              <span className="text-[var(--white-color)] lg:text-4xl text-3xl font-medium">
                Let's Talk Modern Workplace Performance
              </span>
            </div>
            <div className="flex gap-5 items-center">
              <img
                src={Workplace}
                alt="Ic-workplace"
                className="lg:w-auto w-10"
              />
              <span className="text-[var(--white-color)] lg:text-4xl text-3xl font-medium">
                Let's Talk Modern Workplace Performance
              </span>
            </div>
          </div>
        </MarqueeComponent>
      )}
    </div>
  );
};

export default CtaMarquee;
