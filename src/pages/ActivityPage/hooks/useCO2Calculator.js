import { useMemo } from 'react';

// CO2 emission factors by transport mode (kg CO2 per km)
export const CO2_FACTORS = {
  driving: 0.192,  // Average car emissions per km
  walking: 0,      // No direct emissions
  running: 0,      // No direct emissions
  cycling: 0,      // No direct emissions
  bus: 0.105,      // Average bus emissions per km per passenger
  default: 0.192   // Default to car emissions if mode not specified
};

const useCO2Calculator = () => {
  const calculateCO2Saved = useMemo(() => (transportMode, distance) => {
    // If transport mode is driving, no CO2 is saved
    if (transportMode === 'driving') {
      return 0;
    }
    
    // Calculate CO2 saved compared to if the journey was made by car
    const carEmissions = CO2_FACTORS.default * distance;
    const actualEmissions = (CO2_FACTORS[transportMode] || 0) * distance;
    
    // CO2 saved is the difference between car emissions and actual emissions
    return (carEmissions - actualEmissions).toFixed(1);
  }, []);

  return { calculateCO2Saved };
};

export default useCO2Calculator;