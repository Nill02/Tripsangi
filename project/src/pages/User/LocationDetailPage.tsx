import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin,
  Star,
  HomeIcon,
  Camera,
  Hotel as HotelIcon,
  ArrowLeft,
  Loader2,
  Navigation,
  Info,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/* -------------------- Types -------------------- */
interface TouristSpot {
  _id: string;
  name: string;
  image: string;
}
interface Hotel {
  _id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
}
interface Transport {
  _id: string;
  name: string;
  type: string;
  price: number;
}

interface LocationDetails {
  _id: string;
  name: string;
  city: string;
  country: string;
  image?: string;
  images?: string[];
  description?: string;
  googleMapsLink?: string;
  touristSpots: TouristSpot[];
  hotels: Hotel[];
  transports: Transport[];
}

export default function LocationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [location, setLocation] = useState<LocationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    const fetchLocation = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<LocationDetails>(`${API_BASE}/api/locations/${id}`, {
          signal: controller.signal,
        });

        setLocation({
          ...data,
          touristSpots: data.touristSpots ?? [],
          hotels: data.hotels ?? [],
          transports: data.transports ?? [],
        });
      } catch (error: any) {
        if (error.name === 'CanceledError') return;
        toast.error('Failed to load location details');
        navigate('/locations');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
    return () => controller.abort();
  }, [id, navigate]);

  const heroImages = location?.images?.length ? location.images : [location?.image || ''];

  if (loading) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <Loader2 className='h-10 w-10 animate-spin text-blue-600 mb-4' />
        <p className='text-gray-500 animate-pulse'>Mapping your next adventure...</p>
      </div>
    );
  }

  if (!location) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='min-h-screen bg-gray-50 dark:bg-gray-950 pb-20'
    >
      {/* Hero Section */}
      <div className='relative h-[500px] w-full overflow-hidden'>
        <AnimatePresence mode='wait'>
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            src={heroImages[currentImageIndex]}
            alt={location.name}
            className='absolute inset-0 w-full h-full object-cover'
          />
        </AnimatePresence>

        <div className='absolute inset-0 bg-gradient-to-t from-gray-950 via-black/20 to-transparent' />

        {/* Floating Back Button */}
        <button
          onClick={() => navigate(-1)}
          className='absolute top-8 left-8 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl transition-all border border-white/20'
        >
          <ArrowLeft size={24} />
        </button>

        <div className='absolute bottom-16 left-0 w-full px-8 flex justify-between items-end'>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='text-white'
          >
            <span className='bg-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 inline-block'>
              Destination
            </span>
            <h1 className='text-6xl font-black tracking-tight mb-2'>{location.name}</h1>
            <div className='flex items-center gap-2 text-blue-200 text-lg'>
              <MapPin size={20} className='text-blue-400' />
              {location.city}, {location.country}
            </div>
          </motion.div>

          {location.googleMapsLink && (
            <a
              href={location.googleMapsLink}
              target='_blank'
              className='bg-white text-gray-900 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-xl'
            >
              <Navigation size={18} /> Open in Maps
            </a>
          )}
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 -mt-10 relative z-10'>
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* About Card */}
            <div className='bg-white dark:bg-gray-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800'>
              <h2 className='text-2xl font-bold mb-4 flex items-center gap-2 dark:text-white'>
                <Info className='text-blue-500' /> Overview
              </h2>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed text-lg'>
                {location.description ||
                  'Explore the breathtaking beauty and unique culture of this incredible destination.'}
              </p>
            </div>

            {/* Tourist Attractions */}
            <section>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold flex items-center gap-3 dark:text-white'>
                  <Camera className='text-blue-500' /> Must-Visit Spots
                </h2>
                <span className='text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full'>
                  {location.touristSpots.length} Places
                </span>
              </div>

              <div className='grid sm:grid-cols-2 gap-6'>
                {location.touristSpots.map((spot, idx) => (
                  <motion.div
                    whileHover={{ y: -5 }}
                    key={spot._id}
                    className='group relative h-64 rounded-[24px] overflow-hidden shadow-md'
                  >
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className='w-full h-full object-cover transition duration-500 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent' />
                    <div className='absolute bottom-5 left-5'>
                      <p className='text-blue-400 text-xs font-bold uppercase mb-1'>
                        Spot {idx + 1}
                      </p>
                      <h3 className='text-white text-xl font-bold'>{spot.name}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Hotels Card */}
            <div className='bg-white dark:bg-gray-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold flex items-center gap-2 dark:text-white'>
                  <HotelIcon size={20} className='text-blue-500' /> Stays
                </h2>
                <button
                  onClick={() => navigate(`/hotels?locationId=${id}`)}
                  className='text-blue-600 text-sm font-semibold hover:underline'
                >
                  View All
                </button>
              </div>

              <div className='space-y-4'>
                {location.hotels.slice(0, 3).map((hotel) => (
                  <div
                    key={hotel._id}
                    className='group flex gap-4 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition'
                  >
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className='h-20 w-20 rounded-xl object-cover shadow-sm'
                    />
                    <div className='flex-1'>
                      <h4 className='font-bold dark:text-white group-hover:text-blue-600 transition'>
                        {hotel.name}
                      </h4>
                      <div className='flex items-center text-yellow-500 text-sm gap-1 my-1'>
                        <Star className='h-3 w-3 fill-current' />
                        <span className='font-medium'>{hotel.rating || '4.5'}</span>
                      </div>
                      <p className='text-blue-600 dark:text-blue-400 font-bold'>
                        ₹{hotel.price.toLocaleString('en-IN')}{' '}
                        <span className='text-[10px] text-gray-400 font-normal'>/ night</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Card */}
            <div className='bg-blue-600 p-6 rounded-[32px] text-white shadow-lg shadow-blue-200 dark:shadow-none'>
              <h2 className='text-xl font-bold mb-6 flex items-center gap-2'>
                <HotelIcon size={20} /> Getting a room
              </h2>

              <div className='space-y-3'>
                {location.transports.map((t) => (
                  <div
                    key={t._id}
                    className='flex justify-between items-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10'
                  >
                    <div>
                      <p className='font-bold'>{t.name}</p>
                      <p className='text-[10px] uppercase opacity-70 tracking-widest'>{t.type}</p>
                    </div>
                    <div className='text-right'>
                      <p className='font-bold'>₹{t.price}</p>
                      <p className='text-[10px] opacity-70'>Avg. Fare</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate(`/hotels?location=${location.city}`)}
                className='w-full mt-6 py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition'
              >
                Book a Hotel
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
