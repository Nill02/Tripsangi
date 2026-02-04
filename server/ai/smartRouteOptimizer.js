import axios from 'axios';
import TouristSpot from '../models/TouristSpot.js';
import Hotel from '../models/hotel.js';

const GEOAPIFY_KEY = process.env.GEOAPIFY_API_KEY;

/**
 * Distance Calculator (Geoapify)
 */
const getDistance = async (from, to) => {
  const url = `https://api.geoapify.com/v1/routing?waypoints=${from.lat},${from.lng}|${to.lat},${to.lng}&mode=drive&apiKey=${GEOAPIFY_KEY}`;
  const res = await axios.get(url);
  return res.data.features[0].properties.distance; // meters
};

/**
 * CORE AI FUNCTION
 */
export const smartRouteOptimizer = async ({ locationId, days }) => {
  // ---------------------------------
  // Fetch DB Data
  // ---------------------------------
  const spots = await TouristSpot.find({ location: locationId });
  const hotels = await Hotel.find({ location: locationId });

  if (!spots.length) {
    return { success: false, message: 'No tourist spots found' };
  }

  // ---------------------------------
  // Start Point (City Center)
  // ---------------------------------
  let currentPoint = spots[0].coordinates;
  let unvisited = [...spots];
  let plan = [];

  // ---------------------------------
  // DAY-WISE PLANNING
  // ---------------------------------
  for (let day = 1; day <= days; day++) {
    let dayPlan = [];
    let distanceCovered = 0;

    while (unvisited.length && dayPlan.length < 3) {
      let nearestSpot = null;
      let minDistance = Infinity;

      for (const spot of unvisited) {
        const dist = await getDistance(currentPoint, spot.coordinates);
        if (dist < minDistance) {
          minDistance = dist;
          nearestSpot = spot;
        }
      }

      if (!nearestSpot) break;

      dayPlan.push(nearestSpot);
      currentPoint = nearestSpot.coordinates;
      distanceCovered += minDistance;

      unvisited = unvisited.filter((s) => s._id.toString() !== nearestSpot._id.toString());
    }

    // ---------------------------------
    // HOTEL SELECTION (Near Last Spot)
    // ---------------------------------
    let bestHotel = null;
    let minHotelDist = Infinity;

    for (const hotel of hotels) {
      const dist = await getDistance(currentPoint, hotel.coordinates);
      if (dist < minHotelDist) {
        minHotelDist = dist;
        bestHotel = hotel;
      }
    }

    plan.push({
      day,
      touristSpots: dayPlan.map((s) => s.name),
      nightStay: bestHotel?.name || 'Nearby Hotel',
      totalDistanceKm: (distanceCovered / 1000).toFixed(2),
    });
  }

  return {
    success: true,
    strategy: 'Greedy nearest-first with hotel proximity',
    plan,
  };
};
