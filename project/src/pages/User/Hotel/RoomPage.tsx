import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Tv,
  Wind,
  Coffee,
  CheckCircle2,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// 1. Define the TypeScript interface based on your API response
interface Room {
  _id: string; // or id
  name: string;
  category: string;
  price: number;
  image: string;
  features: string[];
  isAC: boolean;
  hotelId: string;
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availabilityStatus, setAvailabilityStatus] = useState<Record<string, string>>({});

  // Mock Hotel ID - In a real app, get this from URL params using useParams()
  const hotelId = '64f1a2b3c4d5e6f7g8h9i0j1';
  const API_BASE_URL = 'http://localhost:5000/api/hotels'; // Change to your actual backend URL

  // 2. Fetch all rooms (GET /:hotelId/rooms)
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/${hotelId}/rooms`);
        if (!response.ok) throw new Error('Failed to fetch rooms');
        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [hotelId]);

  // 3. Check Room Availability (GET /:hotelId/rooms/:roomId/availability)
  const checkRoomAvailability = async (roomId: string) => {
    setAvailabilityStatus((prev) => ({ ...prev, [roomId]: 'checking' }));
    try {
      const response = await fetch(`${API_BASE_URL}/${hotelId}/rooms/${roomId}/availability`);
      const data = await response.json();

      // Assuming API returns { available: true }
      setAvailabilityStatus((prev) => ({
        ...prev,
        [roomId]: data.available ? 'available' : 'booked',
      }));
    } catch (err) {
      setAvailabilityStatus((prev) => ({ ...prev, [roomId]: 'error' }));
    }
  };

  // --- LOADING STATE ---
  if (loading)
    return (
      <div className='h-screen flex flex-col items-center justify-center text-blue-600'>
        <Loader2 className='animate-spin mb-4' size={48} />
        <p className='font-bold'>Loading Luxury Rooms...</p>
      </div>
    );

  // --- ERROR STATE ---
  if (error)
    return (
      <div className='h-screen flex flex-col items-center justify-center text-red-500 px-6 text-center'>
        <AlertCircle size={48} className='mb-4' />
        <h2 className='text-2xl font-bold'>Oops! {error}</h2>
        <button
          onClick={() => window.location.reload()}
          className='mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg'
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className='bg-slate-50 min-h-screen pb-20'>
      <div className='bg-white border-b border-slate-200 py-12 px-6'>
        <div className='max-w-7xl mx-auto text-center'>
          <h1 className='text-4xl font-black text-slate-900 mb-2'>Available Rooms</h1>
          <p className='text-slate-500'>Live data from our booking engine</p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 mt-10'>
        {rooms.map((room) => (
          <div
            key={room._id}
            className='group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col'
          >
            {/* Room Image */}
            <div className='relative h-64 overflow-hidden'>
              <img
                src={room.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                alt={room.name}
              />
              <div className='absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-black uppercase text-blue-600 shadow-sm'>
                {room.category}
              </div>
            </div>

            {/* Room Content */}
            <div className='p-8 flex-grow flex flex-col'>
              <div className='flex justify-between items-start mb-4'>
                <h3 className='text-2xl font-bold text-slate-900'>{room.name}</h3>
                {room.isAC && (
                  <span className='bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1'>
                    <Wind size={12} /> AC
                  </span>
                )}
              </div>

              {/* Icons */}
              <div className='flex gap-4 mb-6 text-slate-400'>
                <Wifi size={18} />
                <Tv size={18} />
                <Coffee size={18} />
              </div>

              {/* Features List */}
              <ul className='space-y-2 mb-8 flex-grow'>
                {room.features.map((feat, idx) => (
                  <li key={idx} className='flex items-center gap-2 text-sm text-slate-600'>
                    <CheckCircle2 size={14} className='text-blue-500' /> {feat}
                  </li>
                ))}
              </ul>

              {/* Price & Actions */}
              <div className='pt-6 border-t border-slate-100 space-y-4'>
                <div className='flex justify-between items-end'>
                  <div>
                    <p className='text-xs text-slate-400 font-bold uppercase tracking-wider'>
                      Per Night
                    </p>
                    <p className='text-3xl font-black text-blue-700'>₹{room.price}</p>
                  </div>

                  {/* Availability Button */}
                  <button
                    onClick={() => checkRoomAvailability(room._id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                      availabilityStatus[room._id] === 'available'
                        ? 'bg-green-100 text-green-700'
                        : availabilityStatus[room._id] === 'booked'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {availabilityStatus[room._id] === 'checking'
                      ? 'Checking...'
                      : availabilityStatus[room._id] === 'available'
                      ? 'Available'
                      : availabilityStatus[room._id] === 'booked'
                      ? 'Full'
                      : 'Check Availability'}
                  </button>
                </div>

                <button className='w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200'>
                  Book Now <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
