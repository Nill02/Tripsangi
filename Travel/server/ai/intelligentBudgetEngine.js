import Hotel from '../models/hotel.js';
import Transport from '../models/transport.js';

/**
 * MAIN AI FUNCTION
 */
export const intelligentBudgetPlanner = async ({ user, place, days, budget }) => {
  // -----------------------------
  // 1️⃣ AGE & SAFETY CHECK
  // -----------------------------
  if (user.age < 18 && user.travelType === 'solo') {
    return {
      allowed: false,
      reason: 'Under 18 users are not allowed to travel solo',
    };
  }

  // -----------------------------
  // 2️⃣ FETCH HOTELS (Runtime)
  // -----------------------------
  const hotels = await Hotel.find({
    location: place,
  }).sort({ pricePerNight: 1 }); // cheapest first

  if (!hotels.length) {
    return { allowed: false, reason: 'No hotels found' };
  }

  // -----------------------------
  // 3️⃣ FETCH TRANSPORT (Runtime)
  // -----------------------------
  const transports = await Transport.find({
    to: place,
  }).sort({ price: 1 }); // cheapest first

  if (!transports.length) {
    return { allowed: false, reason: 'No transport available' };
  }

  // -----------------------------
  // 4️⃣ AI SELECTION LOGIC
  // -----------------------------

  let selectedHotel = null;
  let selectedTransport = null;

  for (let hotel of hotels) {
    for (let transport of transports) {
      const totalCost = hotel.pricePerNight * days + transport.price;

      if (totalCost <= budget) {
        selectedHotel = hotel;
        selectedTransport = transport;
        break;
      }
    }
    if (selectedHotel) break;
  }

  // -----------------------------
  // 5️⃣ BUDGET FAIL CASE
  // -----------------------------
  if (!selectedHotel || !selectedTransport) {
    return {
      allowed: false,
      reason: 'Budget too low for this destination',
      suggestion: 'Increase budget or reduce days',
    };
  }

  // -----------------------------
  // 6️⃣ INTELLIGENCE ENHANCEMENTS
  // -----------------------------
  let safetyScore = 100;

  if (user.travelType === 'solo') safetyScore -= 10;
  if (selectedTransport.type === 'night-bus') safetyScore -= 15;
  if (selectedHotel.rating < 3) safetyScore -= 10;

  // -----------------------------
  // 7️⃣ FINAL RESPONSE
  // -----------------------------
  return {
    allowed: true,
    aiDecision: {
      userType: user.travelType,
      destination: place,
      days,
      budget,
      totalCost: selectedHotel.pricePerNight * days + selectedTransport.price,
      safetyScore,
    },
    hotel: selectedHotel,
    transport: selectedTransport,
  };
};
