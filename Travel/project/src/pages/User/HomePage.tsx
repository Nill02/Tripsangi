import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Compass, Car, Route, Star, ArrowRight, Search, Shield, Zap, Heart, Users } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#071028]">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e40af] text-white py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              Discover beautiful <br/> places with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">TripSangi</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-lg leading-relaxed">Plan trips, explore tourist spots, and book transport & hotels — all in one place.</p>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full shadow-2xl max-w-xl flex items-center transition-all focus-within:bg-white/20 focus-within:scale-105">
              <div className="pl-4 text-gray-400">
                <Search className="w-6 h-6 text-cyan-300" />
              </div>
              <input
                aria-label="Search"
                placeholder="Where do you want to go?"
                className="flex-1 bg-transparent text-white placeholder-blue-200 px-4 py-4 focus:outline-none text-lg font-medium"
              />
              <Link to="/tourist-places" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-cyan-500/30">
                Explore
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm font-medium text-blue-200">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-cyan-500/20 rounded-full"><Shield className="w-4 h-4 text-cyan-400" /></div> Safe & Secure
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-cyan-500/20 rounded-full"><Star className="w-4 h-4 text-cyan-400" /></div> Top Rated
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-cyan-500/20 rounded-full"><Zap className="w-4 h-4 text-cyan-400" /></div> Instant Booking
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="relative group perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              <img 
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80" 
                alt="Travel" 
                className="relative rounded-3xl shadow-2xl w-full object-cover border border-white/10 transform transition-transform duration-500 group-hover:rotate-1 group-hover:scale-[1.02]" 
              />
              
              {/* Floating Card 1 */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hidden md:block transform hover:scale-105 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Happy Travelers</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">10k+</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute -top-6 -right-6 bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hidden md:block transform hover:scale-105 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
                    <Heart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Destinations</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">500+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 -mt-24 relative z-20">
        {/* Popular Places Section */}
        <section className="bg-white dark:bg-[#111827] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">Top Rated</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">Popular Destinations</h2>
            </div>
            <Link to="/tourist-places" className="hidden md:flex text-blue-600 hover:text-blue-700 font-semibold items-center gap-2 transition-colors hover:translate-x-1">
              View all places <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((p) => (
              <div key={p.id} className="group bg-white dark:bg-[#1f2937] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 flex flex-col hover:-translate-y-2">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={p.img} 
                    alt={p.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/20">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">4.8</span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{p.title}</h3>
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                      <MapPin className="w-3 h-3" />
                      {p.location}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-6 mt-auto border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Starting from</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">₹{p.hotels[0].price}</span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      {p.hotels[0].name}
                    </div>
                  </div>

                  <Link to={`/destinations/${p.id}`} className="block w-full py-3.5 text-center bg-gray-900 dark:bg-white hover:bg-blue-600 dark:hover:bg-blue-500 text-white dark:text-gray-900 hover:text-white dark:hover:text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/tourist-places" className="inline-flex text-blue-600 hover:text-blue-700 font-semibold items-center gap-2 transition-colors">
              View all places <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* How it works Section */}
        <section className="mt-24 mb-24">
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">Easy Steps</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">How TripSangi Works</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">Search, choose, and plan. We'll simplify the rest for you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative bg-white dark:bg-[#111827] rounded-3xl p-8 shadow-xl hover:-translate-y-2 transition-transform duration-300 border border-gray-100 dark:border-gray-800 group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Explore</h3>
              <p className="text-gray-500 dark:text-gray-400">Discover new destinations and hidden gems curated just for you.</p>
            </div>

            <div className="relative bg-white dark:bg-[#111827] rounded-3xl p-8 shadow-xl hover:-translate-y-2 transition-transform duration-300 border border-gray-100 dark:border-gray-800 group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-50 dark:bg-purple-900/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Route className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Plan</h3>
              <p className="text-gray-500 dark:text-gray-400">Build your perfect itinerary with our easy-to-use route planning tools.</p>
            </div>

            <div className="relative bg-white dark:bg-[#111827] rounded-3xl p-8 shadow-xl hover:-translate-y-2 transition-transform duration-300 border border-gray-100 dark:border-gray-800 group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Book</h3>
              <p className="text-gray-500 dark:text-gray-400">Secure your transport and hotels instantly with our payment system.</p>
            </div>
          </div>
        </section>

        <section className="mt-10 mb-20">
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-16 text-white shadow-2xl overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready for your next adventure?</h2>
              <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-lg">Create custom routes for group bookings or solo trips with our advanced planner. Experience travel like never before.</p>
              <Link to="/route-planning" className="inline-block bg-white text-blue-600 font-bold py-4 px-10 rounded-full hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                Start Planning Now
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;