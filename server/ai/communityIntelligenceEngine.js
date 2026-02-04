import TouristSpot from '../models/TouristSpot.js';

/**
 * 🧠 Community Intelligence AI
 */
export const communityIntelligenceEngine = async ({ userId, location }) => {
  // ----------------------------
  // 📍 Fetch Spots for Location
  // ----------------------------
  const spots = await TouristSpot.find({ location });

  if (!spots.length) {
    return {
      success: false,
      message: 'No community data available',
    };
  }

  // ----------------------------
  // 📊 AI SCORING LOGIC
  // ----------------------------
  const scoredSpots = spots.map((spot) => {
    const popularityScore = spot.likes * 2 + spot.comments * 3 + spot.uploads * 2 + spot.rating * 5;

    const engagementRatio = spot.visits > 0 ? popularityScore / spot.visits : popularityScore;

    return {
      id: spot._id,
      name: spot.name,
      popularityScore,
      engagementRatio,
      visits: spot.visits,
      rating: spot.rating,
    };
  });

  // ----------------------------
  // 🔥 TRENDING SPOTS
  // ----------------------------
  const trendingSpots = [...scoredSpots]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 5);

  // ----------------------------
  // 💎 HIDDEN GEMS
  // ----------------------------
  const hiddenGems = scoredSpots
    .filter((spot) => spot.visits < 200 && spot.engagementRatio > 15)
    .sort((a, b) => b.engagementRatio - a.engagementRatio)
    .slice(0, 5);

  // ----------------------------
  // 🏆 CROWD FAVORITES
  // ----------------------------
  const crowdFavorites = scoredSpots
    .filter((spot) => spot.rating >= 4)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  // ----------------------------
  // 🤖 AI OUTPUT
  // ----------------------------
  return {
    success: true,
    aiSummary: 'Community-based intelligent recommendations generated',
    insights: {
      trendingSpots,
      hiddenGems,
      crowdFavorites,
    },
    aiNotes: [
      'Hidden gems detected using high engagement & low crowd',
      'Trending spots ranked by community activity',
      'Crowd favorites based on ratings',
    ],
  };
};
