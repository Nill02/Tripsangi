import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// Use the environment variable for all requests
const API_BASE = import.meta.env.VITE_BACKEND_SERVER;

interface Location {
  _id: string;
  name: string;
  country: string;
  image: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Place {
  _id: string;
  name: string;
  image: string;
  description: string;
}

export default function ExplorePage() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Wrap fetch in useCallback to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      // 1. Fetch Main Location Details
      const locResponse = await axios.get(`${API_BASE}/locations/${id}`, {
        withCredentials: true,
      });
      setLocation(locResponse.data);

      // 2. Fetch Nearby Places using the ID from the URL
      // Changed from localhost:5000 to API_BASE for consistency
      const nearbyResponse = await axios.get(`${API_BASE}/locations/nearby/${id}`);
      setNearbyPlaces(nearbyResponse.data);
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
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-gray-600 animate-pulse'>Loading amazing places...</p>
      </div>
    );
  }

  if (!location) {
    return <p className='text-center text-red-500 mt-10'>Location not found!</p>;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        {/* Main Location Hero Section */}
        <div className='bg-white rounded-2xl shadow-sm overflow-hidden mb-12'>
          <img src={location.image} alt={location.name} className='w-full h-[400px] object-cover' />
          <div className='p-8'>
            <h1 className='text-4xl font-bold text-gray-900'>{location.name}</h1>
            <p className='text-xl text-blue-600 font-medium mb-4'>{location.country}</p>
            <p className='text-gray-700 leading-relaxed text-lg'>{location.description}</p>
          </div>
        </div>

        {/* Nearby Tourist Spots Grid */}
        <div className='mt-8'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>Nearby Tourist Places</h2>

          {nearbyPlaces.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {nearbyPlaces.map((place) => (
                <div
                  key={place._id}
                  className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow'
                >
                  <img src={place.image} alt={place.name} className='w-full h-48 object-cover' />
                  <div className='p-5'>
                    <h3 className='text-xl font-bold text-gray-900'>{place.name}</h3>
                    <p className='text-gray-600 mt-2 line-clamp-2'>{place.description}</p>
                    <Link
                      to={`/place/${place._id}`}
                      className='mt-4 inline-block text-blue-600 font-semibold hover:text-blue-800'
                    >
                      Explore Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 italic'>No nearby places found for this location.</p>
          )}
        </div>
      </div>
    </div>
  );
}
