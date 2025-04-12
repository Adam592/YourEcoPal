import { useMemo } from 'react';
import useCO2Calculator from './useCO2Calculator';

const useJourneyStats = (completedJourneys) => {
  const { calculateCO2Saved } = useCO2Calculator();

  const stats = useMemo(() => {
    if (!completedJourneys.length) {
      return {
        totalJourneys: 0,
        co2SavedMonth: 0,
        mostUsedTransport: 'None'
      };
    }

    const totalJourneys = completedJourneys.length;
    
    // Get the current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filter journeys from current month
    const thisMonthJourneys = completedJourneys.filter(journey => {
      const journeyDate = journey.timestamp.toDate();
      return journeyDate.getMonth() === currentMonth && 
             journeyDate.getFullYear() === currentYear;
    });
    
    // Calculate total CO2 saved this month
    const co2SavedMonth = thisMonthJourneys.reduce((total, journey) => {
      const co2Saved = journey.co2Saved || calculateCO2Saved(journey.transportMode, parseFloat(journey.distance));
      return total + parseFloat(co2Saved);
    }, 0).toFixed(1);
    
    // Find most used transport
    const transportCounts = {};
    completedJourneys.forEach(journey => {
      transportCounts[journey.transportMode] = (transportCounts[journey.transportMode] || 0) + 1;
    });
    
    let mostUsedTransport = 'None';
    let maxCount = 0;
    
    Object.keys(transportCounts).forEach(transport => {
      if (transportCounts[transport] > maxCount) {
        maxCount = transportCounts[transport];
        mostUsedTransport = transport;
      }
    });
    
    const percentage = Math.round((maxCount / totalJourneys) * 100);
    
    return {
      totalJourneys,
      co2SavedMonth,
      mostUsedTransport: `${mostUsedTransport.charAt(0).toUpperCase() + mostUsedTransport.slice(1)} (${percentage}%)`
    };
  }, [completedJourneys, calculateCO2Saved]);

  return stats;
};

export default useJourneyStats;