import { useState, useEffect } from 'react';
import { Search, Bus, Train, Plane, ArrowRight, MapPin, Crosshair, Navigation, Car, Zap, Calendar, Users, Filter, Star, Clock } from 'lucide-react';

// Mock Data
const transports = [
  { id: 1, type: 'Bus', name: 'GreenLine Paribahan', from: 'Kolkata', fromCoords: { lat: 22.5726, lng: 88.3639 }, to: 'Darjeeling', departure: '20:00', arrival: '08:00', duration: '12h', price: 1500, rating: 4.2, amenities: ['AC', 'Sleeper', 'Snacks'], seats: 12 },
  { id: 2, type: 'Train', name: 'Vande Bharat Express', from: 'Howrah', fromCoords: { lat: 22.5958, lng: 88.2636 }, to: 'New Jalpaiguri', departure: '05:55', arrival: '13:25', duration: '7h 30m', price: 2500, rating: 4.8, amenities: ['AC', 'Meals', 'Wifi'], seats: 45 },
  { id: 3, type: 'Flight', name: 'IndiGo 6E-534', from: 'Kolkata', fromCoords: { lat: 22.6548, lng: 88.4467 }, to: 'Bagdogra', departure: '10:00', arrival: '11:10', duration: '1h 10m', price: 4500, rating: 4.5, amenities: ['Economy', 'Fastest'], seats: 8 },
  { id: 4, type: 'Bus', name: 'Shyamoli Yatri Paribahan', from: 'Kolkata', fromCoords: { lat: 22.5726, lng: 88.3639 }, to: 'Digha', departure: '07:00', arrival: '11:30', duration: '4h 30m', price: 500, rating: 4.0, amenities: ['AC', 'Seater'], seats: 20 },
  { id: 5, type: 'Train', name: 'Tamralipta Express', from: 'Howrah', fromCoords: { lat: 22.5958, lng: 88.2636 }, to: 'Digha', departure: '06:40', arrival: '10:00', duration: '3h 20m', price: 180, rating: 4.1, amenities: ['Chair Car'], seats: 120 },
  { id: 6, type: 'Auto', name: 'City Auto Service', from: 'Ultadanga', fromCoords: { lat: 22.5965, lng: 88.3976 }, to: 'Salt Lake', departure: 'Frequent', arrival: '20m later', duration: '20m', price: 20, rating: 4.0, amenities: ['Shared'], seats: 3 },
  { id: 7, type: 'E-Rickshaw', name: 'Local Toto', from: 'Howrah Station', fromCoords: { lat: 22.5838, lng: 88.3426 }, to: 'Nearby Market', departure: 'Anytime', arrival: '10m later', duration: '10m', price: 10, rating: 4.3, amenities: ['Eco-friendly'], seats: 4 },
];

// Helper: Calculate distance
const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
const deg2rad = (deg: number) => deg * (Math.PI / 180);

export default function TransportPage() {
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  let filteredTransport = transports.filter(t => 
    (selectedType === 'All' || t.type === selectedType) &&
    t.from.toLowerCase().includes(fromSearch.toLowerCase()) &&
    t.to.toLowerCase().includes(toSearch.toLowerCase())
  );

  // Sort by distance from user location
  if (userLocation) {
    filteredTransport = [...filteredTransport].sort((a, b) => {
      const distA = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, a.fromCoords.lat, a.fromCoords.lng);
      const distB = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, b.fromCoords.lat, b.fromCoords.lng);
      return distA - distB;
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#071028] pb-12">
      {/* Hero Section with Background */}
      <div className="relative h-[400px] w-full bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80" 
          alt="Travel Background" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Journey to Your <span className="text-primary">Destination</span>
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            Compare and book the best transport options across buses, trains, flights, and local rides.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10">
        {/* Search Widget */}
        <div className="bg-white dark:bg-[#061122] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 mb-10">
            {/* Transport Type Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-gray-100 dark:border-gray-800 no-scrollbar">
              {['All', 'Bus', 'Train', 'Flight', 'Auto', 'E-Rickshaw'].map(type => (
                  <button 
                    key={type} 
                    onClick={() => setSelectedType(type)} 
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                      selectedType === type 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                      {type === 'Bus' && <Bus className="h-4 w-4" />}
                      {type === 'Train' && <Train className="h-4 w-4" />}
                      {type === 'Flight' && <Plane className="h-4 w-4" />}
                      {type === 'Auto' && <Car className="h-4 w-4" />}
                      {type === 'E-Rickshaw' && <Zap className="h-4 w-4" />}
                      {type === 'All' && <Search className="h-4 w-4" />}
                      {type}
                  </button>
              ))}
            </div>
            
            {/* Search Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4 relative">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">From</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input type="text" placeholder="City or Station" value={fromSearch} onChange={e => setFromSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#030b17] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none font-medium" />
                    </div>
                </div>
                <div className="hidden md:flex md:col-span-1 items-center justify-center pb-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
                <div className="md:col-span-4 relative">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">To</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input type="text" placeholder="City or Station" value={toSearch} onChange={e => setToSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#030b17] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none font-medium" />
                    </div>
                </div>
                <div className="md:col-span-3">
                  <button className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-primary/40 flex items-center justify-center gap-2">
                    <Search className="h-5 w-5" /> Search
                  </button>
                </div>
            </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Available Transport</h2>
          <div className="flex items-center gap-4 text-sm">
            {userLocation && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                <Crosshair className="h-3 w-3" /> 
                <span>Near You</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-gray-500 cursor-pointer hover:text-primary">
              <Filter className="h-4 w-4" /> Filter
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
            {filteredTransport.map(item => {
                const distance = userLocation ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, item.fromCoords.lat, item.fromCoords.lng).toFixed(1) : null;
                return (
                <div key={item.id} className="group bg-white dark:bg-[#061122] p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row gap-6">
                      
                      {/* Left: Icon & Basic Info */}
                      <div className="flex items-start gap-4 md:w-1/3">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                            {item.type === 'Bus' && <Bus className="h-6 w-6" />}
                            {item.type === 'Train' && <Train className="h-6 w-6" />}
                            {item.type === 'Flight' && <Plane className="h-6 w-6" />}
                            {item.type === 'Auto' && <Car className="h-6 w-6" />}
                            {item.type === 'E-Rickshaw' && <Zap className="h-6 w-6" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                {item.rating} <Star className="h-3 w-3 fill-current" />
                              </span>
                              <span className="text-xs text-gray-400">• {item.type}</span>
                            </div>
                            {distance && (
                              <div className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1 font-medium">
                                <Navigation className="h-3 w-3" /> {distance} km from you
                              </div>
                            )}
                        </div>
                      </div>
                    
                      {/* Middle: Timeline & Amenities */}
                      <div className="flex-grow flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-center">
                            <div className="font-bold text-xl text-gray-900 dark:text-white">{item.departure}</div>
                            <div className="text-xs text-gray-500">{item.from}</div>
                          </div>
                          <div className="flex-grow px-4 flex flex-col items-center">
                            <div className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock className="h-3 w-3" /> {item.duration}</div>
                            <div className="w-full h-[2px] bg-gray-200 dark:bg-gray-700 relative">
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-xl text-gray-900 dark:text-white">{item.arrival}</div>
                            <div className="text-xs text-gray-500">{item.to}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.amenities.map(a => (
                            <span key={a} className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded border border-gray-100 dark:border-gray-700">{a}</span>
                          ))}
                          <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded flex items-center gap-1">
                            <Users className="h-3 w-3" /> {item.seats} Seats Left
                          </span>
                        </div>
                      </div>

                      {/* Right: Price & Action */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:w-1/5 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-4 md:pt-0 md:pl-6">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">₹{item.price}</div>
                          <div className="text-xs text-gray-500">per person</div>
                        </div>
                        <button className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg w-full md:w-auto">
                          Select
                        </button>
                      </div>
                    </div>
                </div>
            )})}
        </div>
      </div>
    </div>
  );
}