import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_BACKEND_SERVER;

interface Location {
  _id: string;
  name: string;
  country: string;
  image: string;
  description: string;
}

export default function LocationPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(`${API_BASE}/locations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      // ✅ FIX: Safety check for data structure
      // This ensures 'locations' is ALWAYS an array even if backend structure changes
      const incomingData = response.data;
      if (Array.isArray(incomingData)) {
        setLocations(incomingData);
      } else if (incomingData && typeof incomingData === 'object') {
        // Handle common wrappers like { data: [...] } or { locations: [...] }
        setLocations(incomingData.locations || incomingData.data || []);
      } else {
        setLocations([]);
      }
    } catch (error: any) {
      console.error('Error fetching locations:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired, please log in again.');
        navigate('/login');
      } else {
        toast.error('Failed to load locations');
      }
      setLocations([]); // Prevent filter crash on error
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // Use a fallback empty array to prevent "filter is not a function"
  const filteredLocations = (locations || []).filter(
    (location) =>
      location.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.country?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Discover Your Next Adventure</h1>
          <p className='text-xl text-gray-600'>Search for cities, countries, or landmarks</p>
        </div>

        <div className='max-w-3xl mx-auto mb-12'>
          <div className='relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search locations...'
              className='w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm'
            />
            <Search className='absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6' />
          </div>
        </div>

        {loading ? (
          <div className='flex justify-center py-20'>
            <p className='text-gray-600 animate-pulse text-lg font-medium'>Loading locations...</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <div
                  key={location._id}
                  className='bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 border border-gray-100'
                >
                  <img
                    src={location.image}
                    alt={location.name}
                    className='h-48 w-full object-cover'
                  />
                  <div className='p-6'>
                    <h3 className='text-xl font-semibold text-gray-900'>{location.name}</h3>
                    <p className='text-sm text-gray-600 mb-4'>{location.country}</p>
                    <p className='text-gray-700 line-clamp-3'>{location.description}</p>
                    <button
                      onClick={() => navigate(`/locations/${location._id}`)}
                      className='mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
                    >
                      Explore
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className='col-span-full text-center py-10'>
                <p className='text-gray-500 text-lg'>No locations found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
