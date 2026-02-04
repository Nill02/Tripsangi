import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Compass, Car, Route } from 'lucide-react';

type Place = {
  id: number;
  title: string;
  location: string;
  img: string;
  hotels: { name: string; price: number }[];
};

const places: Place[] = [
  {
    id: 1,
    title: 'Darjeeling Tea Gardens',
    location: 'Darjeeling, West Bengal, India',
    img: 'https://picsum.photos/seed/darjeeling/800/600',
    hotels: [
      { name: 'Hotel Pine View', price: 3500 },
      { name: 'Hilltop Residency', price: 4200 },
    ],
  },
  {
    id: 2,
    title: 'Sundarbans Mangrove Cruise',
    location: 'Sundarbans, West Bengal, India',
    img: 'https://picsum.photos/seed/sundarbans/800/600',
    hotels: [
      { name: 'Sunderban Lodge', price: 2800 },
      { name: 'Riverfront Cottages', price: 3200 },
    ],
  },
  {
    id: 3,
    title: 'Digha Beach',
    location: 'Digha, West Bengal, India',
    img: 'https://picsum.photos/seed/digha/800/600',
    hotels: [
      { name: 'Seaview Resort', price: 2600 },
      { name: 'Digha Beach Hotel', price: 2000 },
    ],
  },
  {
    id: 4,
    title: 'Shantiniketan',
    location: 'Shantiniketan, West Bengal, India',
    img: 'https://picsum.photos/seed/shantiniketan/800/600',
    hotels: [
      { name: 'Visva Bhavan Inn', price: 2200 },
      { name: 'Rathindra Homestay', price: 1800 },
    ],
  },
  {
    id: 5,
    title: 'Kolkata Heritage Walk',
    location: 'Kolkata, West Bengal, India',
    img: 'https://picsum.photos/seed/kolkata/800/600',
    hotels: [
      { name: 'Heritage Hotel Kolkata', price: 4100 },
      { name: 'Old Town Guesthouse', price: 1500 },
    ],
  },
  {
    id: 6,
    title: 'Mirik Lake',
    location: 'Mirik, West Bengal, India',
    img: 'https://picsum.photos/seed/mirik/800/600',
    hotels: [
      { name: 'Lakeview Hotel', price: 2400 },
      { name: 'Pinewood Retreat', price: 3000 },
    ],
  },
];

const HomePage: React.FC = () => {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors'>
      <header className='bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-900 dark:to-blue-800 text-white py-20'>
        <div className='max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8'>
          <div className='flex-1'>
            <h1 className='text-4xl md:text-5xl font-extrabold mb-4'>
              Discover beautiful places with TripSangi
            </h1>
            <p className='text-lg opacity-90 mb-6'>
              Plan trips, explore tourist spots, and book transport & hotels — all in one place.
            </p>

            <div className='flex items-center gap-3'>
              <input
                aria-label='Search'
                placeholder='Search destinations, activities or hotels...'
                className='flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-3 shadow-md focus:outline-none placeholder-gray-500 dark:placeholder-gray-400'
              />
              <Link to='/tourist-places' className='btn btn-primary'>
                Explore
              </Link>
            </div>

            <div className='mt-6 flex gap-4 text-sm'>
              <div className='flex items-center gap-2 bg-white/10 dark:bg-white/5 px-3 py-2 rounded-md'>
                <MapPin className='h-4 w-4' /> <span>Locations</span>
              </div>
              <div className='flex items-center gap-2 bg-white/10 dark:bg-white/5 px-3 py-2 rounded-md'>
                <Compass className='h-4 w-4' /> <span>Tourist Places</span>
              </div>
              <div className='flex items-center gap-2 bg-white/10 dark:bg-white/5 px-3 py-2 rounded-md'>
                <Car className='h-4 w-4' /> <span>Transport & Hotels</span>
              </div>
            </div>
          </div>

          <div className='w-full md:w-1/2'>
            <img
              src='https://picsum.photos/seed/hero/900/600'
              alt='Travel'
              className='rounded-xl shadow-xl w-full object-cover'
            />
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 -mt-12'>
        <section className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md'>
          <h2 className='text-2xl font-bold mb-2 text-gray-900 dark:text-white'>Popular places</h2>

          <div className='mb-4 text-sm text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded'>
            <strong>Note:</strong> TripSangi is an information-only directory. We do not process
            payments or bookings — prices shown are indicative. Please contact the hotel/provider
            directly to book.
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {places.map((p) => (
              <div
                key={p.id}
                className='rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 shadow hover:shadow-lg transition-shadow'
              >
                <img src={p.img} alt={p.title} className='w-full h-44 object-cover' />
                <div className='p-4'>
                  <h3 className='font-semibold text-lg text-gray-900 dark:text-white'>{p.title}</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>{p.location}</p>

                  <div className='mt-3 flex justify-between items-center'>
                    <div>
                      <div className='text-sm text-gray-600 dark:text-gray-400'>
                        Hotel:{' '}
                        <span className='font-medium text-gray-800 dark:text-gray-200'>
                          {p.hotels[0].name}
                        </span>
                      </div>
                      <div className='text-sm text-gray-500 dark:text-gray-400'>
                        Price:{' '}
                        <span className='font-medium text-gray-800 dark:text-gray-200'>
                          ₹{p.hotels[0].price}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/location/${p.id}`}
                      className='text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline'
                    >
                      More info
                    </Link>
                  </div>

                  <div className='mt-2 text-xs text-yellow-700 dark:text-yellow-300'>
                    Prices are indicative. TripSangi does not handle bookings or payments.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='mt-8 text-center'>
          <h2 className='text-2xl font-bold mb-2 text-gray-900 dark:text-white'>
            How TripSangi works
          </h2>
          <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6'>
            Search, choose, and plan. We'll simplify the rest.
          </p>

          <div className='flex flex-col md:flex-row gap-4 justify-center'>
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow sm:w-1/3 hover:shadow-lg transition-shadow'>
              <div className='flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mx-auto mb-3'>
                <Compass />
              </div>
              <h3 className='font-semibold text-gray-900 dark:text-white'>Explore</h3>
              <p className='text-sm text-gray-600 dark:text-gray-400'>Find places you'll love.</p>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow sm:w-1/3 hover:shadow-lg transition-shadow'>
              <div className='flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mx-auto mb-3'>
                <Route />
              </div>
              <h3 className='font-semibold text-gray-900 dark:text-white'>Plan</h3>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Build routes & itineraries easily.
              </p>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow sm:w-1/3 hover:shadow-lg transition-shadow'>
              <div className='flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mx-auto mb-3'>
                <Car />
              </div>
              <h3 className='font-semibold text-gray-900 dark:text-white'>Book</h3>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Reserve transport and hotels quickly.
              </p>
            </div>
          </div>
        </section>

        <section className='mt-10 text-center pb-10'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Want a custom route or group booking?{' '}
            <Link
              to='/route-planning'
              className='text-blue-600 dark:text-blue-400 font-medium hover:underline'
            >
              Try our Route Planning
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
