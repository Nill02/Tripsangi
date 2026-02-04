import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_BACKEND_SERVER;

// Matches the backend 'Location' model
interface Location {
  _id: string;
  name: string;
  country: string;
  city: string;
  image: string;
  description: string;
  googleMapsLink?: string;
}

// Matches the backend 'TouristSpot' model
interface TouristSpot {
  _id: string;
  name: string;
  image: string;
  description: string;
}

export default function ExplorePage() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [touristSpots, setTouristSpots] = useState<TouristSpot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);

    try {
      // We run these in parallel for better performance
      const [locResponse, spotsResponse] = await Promise.all([
        axios.get(`${API_BASE}/locations/${id}`, { withCredentials: true }),
        axios.get(`${API_BASE}/locations/${id}/tourist-spots`), // Updated route
      ]);

      setLocation(locResponse.data);
      setTouristSpots(spotsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Could not load destination details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className='flex flex-col justify-center items-center min-h-[60vh]'>
        <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4'></div>
        <p className='text-gray-500 font-medium animate-pulse'>Loading amazing places...</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className='text-center py-20'>
        <p className='text-red-500 text-xl font-semibold'>Location not found!</p>
        <Link to='/' className='text-blue-600 underline mt-4 inline-block'>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 pb-12'>
      {/* Hero Section - Optimized for Mobile */}
      <div className='relative w-full h-[30vh] md:h-[50vh] lg:h-[60vh] overflow-hidden'>
        <img src={location.image} alt={location.name} className='w-full h-full object-cover' />
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
        <div className='absolute bottom-0 left-0 p-6 md:p-12 text-white'>
          <p className='text-blue-400 font-bold uppercase tracking-widest text-sm mb-2'>
            {location.city}, {location.country}
          </p>
          <h1 className='text-3xl md:text-5xl lg:text-6xl font-extrabold'>{location.name}</h1>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-4 md:px-6 -mt-8 relative z-10'>
        {/* Description Card */}
        <div className='bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-12'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>About the Destination</h2>
          <p className='text-gray-700 leading-relaxed text-base md:text-lg'>
            {location.description}
          </p>
          {location.googleMapsLink && (
            <a
              href={location.googleMapsLink}
              target='_blank'
              rel='noopener noreferrer'
              className='mt-6 inline-flex items-center text-blue-600 font-medium hover:underline'
            >
              📍 View on Google Maps
            </a>
          )}
        </div>

        {/* Tourist Spots Grid */}
        <section>
          <div className='flex items-baseline justify-between mb-8'>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-900'>Must-Visit Spots</h2>
            <span className='text-gray-500 text-sm font-medium'>{touristSpots.length} places</span>
          </div>

          {touristSpots.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
              {touristSpots.map((spot) => (
                <div
                  key={spot._id}
                  className='group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300'
                >
                  <div className='relative overflow-hidden h-52'>
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                  </div>
                  <div className='p-5'>
                    <h3 className='text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors'>
                      {spot.name}
                    </h3>
                    <p className='text-gray-600 mt-2 line-clamp-2 text-sm md:text-base leading-relaxed'>
                      {spot.description}
                    </p>
                    <Link
                      to={`/place/${spot._id}`}
                      className='mt-4 w-full text-center py-2.5 rounded-lg bg-blue-50 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-colors block'
                    >
                      Explore Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='bg-white rounded-xl p-10 text-center border-2 border-dashed border-gray-200'>
              <p className='text-gray-500 italic'>
                No tourist spots have been added for this location yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
