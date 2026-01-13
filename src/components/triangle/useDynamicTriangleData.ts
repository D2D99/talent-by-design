import { useEffect, useState } from "react";
import type TriangleData from "./types";

const randomValue = () => Math.floor(40 + Math.random() * 60);

export function useDynamicTriangleData() {
  const [data, setData] = useState<TriangleData>({
    peoplePotential: 70,
    operationalSteadiness: 70,
    digitalFluency: 70,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        peoplePotential: randomValue(),
        operationalSteadiness: randomValue(),
        digitalFluency: randomValue(),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return data;
}
