import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, Search, ExternalLink, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


/* -------------------- Types -------------------- */

interface Location {
  _id: string;
  name: string;
  city: string;
  country: string;
  image: string;
  googleMapsLink?: string;
}

/* -------------------- Component -------------------- */

export default function LocationsPage() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState<Location[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  /* -------------------- Fetch Locations -------------------- */
  useEffect(() => {
    const controller = new AbortController();

    const fetchLocations = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${API_BASE}/api/locations`, {
          params: search ? { search } : {},
          signal: controller.signal,
        });

        // 🔒 Runtime safety check
        if (Array.isArray(response.data)) {
          setLocations(response.data);
        } else {
          console.error('Invalid API response:', response.data);
          setLocations([]);
        }
      } catch (error) {
        toast.error('Failed to load locations');
        console.error('Error fetching locations:', error);
        setLocations([]); // 🔒 Always an array
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchLocations, 400);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [search]);

  /* -------------------- UI -------------------- */
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-10'>
          <h1 className='text-4xl font-extrabold mb-3 dark:text-white'>Explore Destinations</h1>
          <p className='text-gray-600 dark:text-gray-400'>Search by city, country, or place name</p>
        </div>

        {/* Search */}
        <div className='relative mb-8 max-w-lg'>
          <Search className='absolute left-4 top-3.5 text-gray-400' />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search destinations...'
            className='w-full pl-12 pr-4 py-3 rounded-xl border bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className='flex justify-center py-20'>
            <Loader2 className='h-10 w-10 animate-spin text-blue-600' />
          </div>
        )}

        {/* Empty State */}
        {!loading && locations.length === 0 && (
          <p className='text-gray-500 text-center py-20'>No locations found</p>
        )}

        {/* Locations Grid */}
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {locations.map((loc) => (
            <div
              key={loc._id}
              onClick={() => navigate(`/locations/${loc._id}`)}
              className='bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer'
            >

              
              <div className='h-48 overflow-hidden'>
                <img
                  src={loc.image || 'https://via.placeholder.com/400x300'}
                  alt={loc.name}
                  className='w-full h-full object-cover hover:scale-110 transition-transform'
                />
              </div>

              <div className='p-5'>
                <h3 className='text-xl font-bold dark:text-white'>{loc.name}</h3>

                <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1'>
                  <MapPin className='h-4 w-4' />
                  {loc.city}, {loc.country}
                </div>

                {loc.googleMapsLink && (
                  <a
                    href={loc.googleMapsLink}
                    target='_blank'
                    rel='noreferrer'
                    onClick={(e) => e.stopPropagation()}
                    className='inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:underline'
                  >
                    View on Map <ExternalLink className='h-4 w-4' />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
