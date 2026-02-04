import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function HotelsPage() {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(10000);

  // Function to fetch hotels (can fetch all or by location)
  const fetchHotels = async (location = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const url = location
        ? `${API_BASE}/api/hotels/location/${encodeURIComponent(location)}`
        : `${API_BASE}/api/hotels`;

      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });

      // Ensure response.data is an array
      const hotelData = Array.isArray(response.data) ? response.data : response.data?.hotels || [];

      setHotels(hotelData);
      if (location && hotelData.length > 0) {
        toast.success(`Found ${hotelData.length} hotels`);
      } else if (location && hotelData.length === 0) {
        toast.info('No hotels found for this location');
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setHotels([]); // Reset to empty array on error
      toast.error(error.response?.data?.message || 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  // Initial load (All hotels or filtered by location)
  useEffect(() => {
    const locationParam = searchParams.get('location');
    if (locationParam) {
      setSearchTerm(locationParam);
      fetchHotels(locationParam);
    } else {
      fetchHotels();
    }
  }, [searchParams]);

  // Trigger search when button is clicked or "Enter" is pressed
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchHotels();
      return;
    }
    fetchHotels(searchTerm);
  };

  // Price filtering remains client-side for immediate UI feedback
  const displayedHotels = Array.isArray(hotels)
    ? hotels.filter((h) => h.price && h.price <= priceRange)
    : [];

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 pb-12'>
      {/* Hero Section */}
      <div className='relative bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-900 dark:to-blue-800 py-20 mb-8'>
        <div className='absolute inset-0 overflow-hidden opacity-20'>
          <img
            src='https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80'
            alt='Hero'
            className='w-full h-full object-cover'
          />
        </div>
        <div className='relative max-w-7xl mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-6xl font-extrabold text-white mb-6'>
            Find Your Perfect <span className='text-yellow-300'>Stay</span>
          </h1>

          {/* Search Bar with Submit Handler */}
          <form
            onSubmit={handleSearchSubmit}
            className='max-w-3xl mx-auto bg-white dark:bg-gray-800 p-2 rounded-full shadow-2xl flex items-center'
          >
            <div className='pl-4 text-gray-400 dark:text-gray-500'>
              <Search className='h-6 w-6' />
            </div>
            <input
              type='text'
              placeholder='Where do you want to go? (e.g. Darjeeling)'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-3 rounded-full bg-transparent text-gray-900 dark:text-white focus:outline-none placeholder-gray-500 dark:placeholder-gray-400'
            />
            <button
              type='submit'
              className='bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 py-2 rounded-full transition-all font-semibold mr-1'
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4'>
        {/* Filters and Header */}
        <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
          <div className='flex items-center gap-4 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700'>
            <span className='text-sm text-gray-600 dark:text-gray-400 font-medium'>
              Max Price:{' '}
              <span className='text-blue-600 dark:text-blue-400 font-bold'>
                ₹{priceRange.toLocaleString('en-IN')}
              </span>
            </span>
            <input
              type='range'
              min='1000'
              max='50000'
              step='1000'
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className='w-48 accent-blue-600'
            />
          </div>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            {loading
              ? 'Loading hotels...'
              : `Found ${displayedHotels.length} hotel${displayedHotels.length !== 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Hotel Grid */}
        {loading ? (
          <div className='flex justify-center py-20'>
            <Loader2 className='animate-spin h-12 w-12 text-blue-600 dark:text-blue-400' />
          </div>
        ) : displayedHotels.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-gray-600 dark:text-gray-400 text-lg mb-4'>No hotels found</p>
            <button
              onClick={() => {
                setSearchTerm('');
                fetchHotels();
              }}
              className='px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors'
            >
              View All Hotels
            </button>
          </div>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {displayedHotels.map((hotel) => (
              <div
                key={hotel._id}
                className='bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 flex flex-col h-full group'
              >
                <div className='relative h-64 overflow-hidden'>
                  <img
                    src={hotel.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={hotel.name}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                  />
                  <div className='absolute top-4 right-4 bg-white dark:bg-gray-900 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 shadow-lg'>
                    <Star className='h-4 w-4 text-yellow-500 fill-current' />
                    <span className='text-gray-900 dark:text-white'>{hotel.rating || 'New'}</span>
                  </div>
                </div>

                <div className='p-5 flex flex-col flex-grow'>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-1'>
                    {hotel.name}
                  </h3>
                  <div className='flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-4'>
                    <MapPin className='h-4 w-4' /> {hotel.location || 'Location not specified'}
                  </div>

                  <p className='text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4'>
                    {hotel.description || 'No description available'}
                  </p>

                  <div className='flex items-end justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto'>
                    <div>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                        Price per night
                      </p>
                      <span className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                        ₹{hotel.price?.toLocaleString('en-IN') || '0'}
                      </span>
                    </div>
                    <button className='bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors'>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
