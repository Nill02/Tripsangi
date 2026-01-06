import Hotel from '../../models/hotel.js';
import TouristSpot from '../../models/TouristSpot.js';
import Transport from '../../models/transport.js';

/**
 * 🧠 Intelligent User & Budget AI Engine
 * Purpose: Suggest optimized hotels, transport, and tourist spots based on budget, user age, and travel type.
 */
export const intelligentBudgetPlanner = async ({ user, place, days, budget }) => {
  // ----------------------------------
  // 🛑 AGE SAFETY RULE
  // ----------------------------------
  if (user.age < 18 && user.travelType === 'solo') {
    return {
      allowed: false,
      reason: 'Underage users are not allowed to travel alone',
      suggestion: 'Please travel with family or guardian',
    };
  }

  // ----------------------------------
  // 📍 FETCH DATA FROM DATABASE
  // ----------------------------------
  const hotels = await Hotel.find({ location: place });
  const transports = await Transport.find({ location: place });
  const spots = await TouristSpot.find({ location: place });

  if (!hotels.length || !transports.length || !spots.length) {
    return {
      allowed: false,
      reason: 'Insufficient data for this location',
    };
  }

  // ----------------------------------
  // 💰 COST CALCULATION LOGIC
  // ----------------------------------
  const cheapestHotel = hotels.reduce((min, h) => (h.price < min.price ? h : min));

  const cheapestTransport = transports.reduce((min, t) => (t.price < min.price ? t : min));

  const hotelCost = cheapestHotel.price * days;
  const transportCost = cheapestTransport.price;
  const foodCost = days * 500; // average food estimation
  const miscCost = days * 300; // buffer for safety

  const totalEstimatedCost = hotelCost + transportCost + foodCost + miscCost;

  if (totalEstimatedCost > budget) {
    return {
      allowed: false,
      reason: 'Budget insufficient',
      estimatedCost: totalEstimatedCost,
      suggestion: 'Reduce days, choose cheaper options, or increase budget',
    };
  }

  // ----------------------------------
  // 🗺️ SMART ROUTE PLANNING (Simple Greedy Algorithm)
  // ----------------------------------
  // Sort spots by distance from first spot (naive approach, can later integrate Google Maps / Geoapify)
  const sortedSpots = spots.sort((a, b) => {
    const distA = Math.hypot(
      a.coordinates.lat - cheapestHotel.coordinates.lat,
      a.coordinates.lng - cheapestHotel.coordinates.lng,
    );
    const distB = Math.hypot(
      b.coordinates.lat - cheapestHotel.coordinates.lat,
      b.coordinates.lng - cheapestHotel.coordinates.lng,
    );
    return distA - distB;
  });

  // Divide spots across days
  const spotsPerDay = Math.ceil(sortedSpots.length / days);
  const dailyPlan = [];
  for (let i = 0; i < days; i++) {
    dailyPlan.push(sortedSpots.slice(i * spotsPerDay, (i + 1) * spotsPerDay));
  }

  // ----------------------------------
  // ✅ AI DECISION OUTPUT
  // ----------------------------------
  return {
    allowed: true,
    summary: 'Trip is feasible under given budget',
    userType: user.travelType,
    budgetAnalysis: {
      budget,
      estimatedCost: totalEstimatedCost,
      remaining: budget - totalEstimatedCost,
    },
    selectedOptions: {
      hotel: {
        name: cheapestHotel.name,
        price: cheapestHotel.price,
        coordinates: cheapestHotel.coordinates,
      },
      transport: {
        type: cheapestTransport.type,
        price: cheapestTransport.price,
      },
    },
    touristCoverage: spots.length,
    dailyPlan,
    aiNotes: [
      'Cheapest hotel selected to optimize budget',
      'Minimum cost transport chosen',
      'Tourist spots sorted by proximity to hotel for convenience',
      'Extra buffer added for food and miscellaneous expenses',
    ],
  };
};

// -----------------------------
// 🟢 Default Export for Router
// -----------------------------
export default intelligentBudgetPlanner;
