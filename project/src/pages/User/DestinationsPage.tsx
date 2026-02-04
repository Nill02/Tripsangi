import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Star, Navigation, Hotel as HotelIcon, 
  ArrowRight, Gem, Search, Crosshair, Filter, Bus, Phone
} from 'lucide-react';

// --- Types ---

interface TouristSpot {
  id: string;
  name: string;
  image: string;
  distance: string;
  isHiddenGem: boolean;
}

interface Hotel {
  id: string;
  name: string;
  price: number;
  phone?: string;
  rating?: number;
}

interface Transport {
  id: string;
  type: string;
  name: string;
  priceRange: string;
}

interface Location {
  id: string;
  name: string;
  country: string;
  city: string;
  description: string;
  images: string[];
  googleMapsLink: string;
  touristSpots: TouristSpot[];
  hotels: Hotel[];
  transports: Transport[];
  coordinates: { lat: number; lng: number };
  category: string;
}

// --- Mock Data ---

const locations: Location[] = [
  {
    id: '1',
    name: 'Darjeeling',
    category: 'Hill Station',
    city: 'Darjeeling District',
    country: 'India',
    description: 'Rolling tea gardens, cool mountain air and panoramic views of Kanchenjunga. Darjeeling is perfect for short treks, tea-tasting and relaxed town walks. Known as the "Queen of the Hills", it offers a perfect gateway to the Himalayas.',
    images: [
      'https://picsum.photos/seed/darjeeling/1200/800',
      'https://picsum.photos/seed/tea/1200/800',
      'https://picsum.photos/seed/train/1200/800'
    ],
    coordinates: { lat: 27.0410, lng: 88.2663 },
    googleMapsLink: 'https://goo.gl/maps/darjeeling',
    touristSpots: [
      { id: 'ts1', name: 'Tiger Hill', image: 'https://picsum.photos/seed/tigerhill/400/300', distance: '11 km', isHiddenGem: false },
      { id: 'ts2', name: 'Batasia Loop', image: 'https://picsum.photos/seed/batasia/400/300', distance: '5 km', isHiddenGem: true },
      { id: 'ts3', name: 'Rock Garden', image: 'https://picsum.photos/seed/rockgarden/400/300', distance: '10 km', isHiddenGem: true },
    ],
    hotels: [
      { id: 'h1', name: 'Hotel Pine View', price: 3500, phone: '+91-353-2222222', rating: 4.2 },
      { id: 'h2', name: 'Hilltop Residency', price: 4200, rating: 4.5 },
    ],
    transports: [
      { id: 'tr1', type: 'Train', name: 'Toy Train (DHR)', priceRange: '₹1000 - ₹1500' },
      { id: 'tr2', type: 'Taxi', name: 'Private Cab', priceRange: '₹2000 - ₹3000' },
    ]
  },
  {
    id: '2',
    name: 'Sundarbans',
    category: 'Forest',
    city: 'South 24 Parganas',
    country: 'India',
    description: 'The Sundarbans are the world’s largest mangrove forest and home to the Royal Bengal Tiger. Boat-based sightseeing and guided nature walks are main attractions here.',
    images: [
      'https://picsum.photos/seed/sundarbans/1200/800',
      'https://picsum.photos/seed/tiger/1200/800',
      'https://picsum.photos/seed/boat/1200/800'
    ],
    coordinates: { lat: 21.9497, lng: 88.8995 },
    googleMapsLink: 'https://goo.gl/maps/sundarbans',
    touristSpots: [
      { id: 'ts4', name: 'Sajnekhali Watch Tower', image: 'https://picsum.photos/seed/watchtower/400/300', distance: 'By Boat', isHiddenGem: false },
      { id: 'ts5', name: 'Dobanki Camp', image: 'https://picsum.photos/seed/dobanki/400/300', distance: 'By Boat', isHiddenGem: true },
    ],
    hotels: [
      { id: 'h3', name: 'Sunderban Lodge', price: 2800, phone: '+91-332-3333333', rating: 4.0 },
      { id: 'h4', name: 'Riverfront Cottages', price: 3200, rating: 4.3 },
    ],
    transports: [
      { id: 'tr3', type: 'Boat', name: 'Tourist Launch', priceRange: '₹500 - ₹1000' },
    ]
  },
  {
    id: '3',
    name: 'Digha',
    category: 'Beach',
    city: 'Purba Medinipur',
    country: 'India',
    description: 'Sandy beaches and calm waters make Digha a popular coastal retreat for families and beach lovers. Enjoy fresh seafood and beautiful sunsets.',
    images: [
      'https://picsum.photos/seed/digha/1200/800',
      'https://picsum.photos/seed/beach/1200/800'
    ],
    coordinates: { lat: 21.6266, lng: 87.5074 },
    googleMapsLink: 'https://goo.gl/maps/digha',
    touristSpots: [
      { id: 'ts6', name: 'New Digha Beach', image: 'https://picsum.photos/seed/newdigha/400/300', distance: '2 km', isHiddenGem: false },
      { id: 'ts7', name: 'Marine Aquarium', image: 'https://picsum.photos/seed/aquarium/400/300', distance: '1 km', isHiddenGem: true },
    ],
    hotels: [
      { id: 'h5', name: 'Seaview Resort', price: 2600, phone: '+91-321-4444444', rating: 3.8 },
      { id: 'h6', name: 'Digha Beach Hotel', price: 2000, rating: 3.5 },
    ],
    transports: [
      { id: 'tr4', type: 'Bus', name: 'SBSTC Bus', priceRange: '₹150 - ₹300' },
      { id: 'tr5', type: 'Train', name: 'Tamralipta Express', priceRange: '₹100 - ₹500' },
    ]
  },
];

const currencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const formatINR = (val: number) => currencyFormatter.format(val);

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

export default function DestinationsPage() {
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  // --- 1. LIST VIEW LOGIC ---
  useEffect(() => {
    if (!id && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => console.error("Error getting location:", error)
      );
    }
  }, [id]);

  if (!id) {
    let displayedLocations = [...locations];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      displayedLocations = displayedLocations.filter(l => l.name.toLowerCase().includes(lowerTerm) || l.city.toLowerCase().includes(lowerTerm));
    }

    if (selectedCategory !== 'All') {
      displayedLocations = displayedLocations.filter(l => l.category === selectedCategory);
    }

    if (userLocation) {
      displayedLocations.sort((a, b) => {
        const distA = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, a.coordinates.lat, a.coordinates.lng);
        const distB = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng);
        return distA - distB;
      });
    }

    const categories = ['All', 'Hill Station', 'Beach', 'Forest'];

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#071028] pb-12">
        {/* Hero Section */}
        <div className="relative h-[500px] w-full bg-gray-900 mb-12">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Destinations Hero" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-50 dark:to-[#071028]"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
              Explore the <span className="text-primary">Unseen</span>
            </h1>
            <p className="text-xl text-gray-100 max-w-2xl drop-shadow-md">
              Discover hidden gems, breathtaking landscapes, and cultural wonders curated just for you.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
          {/* Search & Filter */}
          <div className="flex flex-col gap-6 mb-12 bg-white dark:bg-[#061122] p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
            
            {/* Location Status & Change Option */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                {userLocation ? (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                      <Crosshair className="h-3 w-3" /> 
                      Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </span>
                    <button 
                      onClick={() => setShowLocationInput(!showLocationInput)}
                      className="text-primary hover:underline text-xs font-medium"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowLocationInput(!showLocationInput)}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Crosshair className="h-3 w-3" /> Set Location to see distances
                  </button>
                )}
              </div>

              {showLocationInput && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <input 
                    type="number" 
                    placeholder="Lat" 
                    value={manualLat} 
                    onChange={e => setManualLat(e.target.value)}
                    className="w-20 px-2 py-1 text-sm border rounded dark:bg-[#030b17] dark:border-gray-600 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                  />
                  <input 
                    type="number" 
                    placeholder="Lng" 
                    value={manualLng} 
                    onChange={e => setManualLng(e.target.value)}
                    className="w-20 px-2 py-1 text-sm border rounded dark:bg-[#030b17] dark:border-gray-600 dark:text-white focus:ring-1 focus:ring-primary outline-none"
                  />
                  <button 
                    onClick={() => {
                      if(manualLat && manualLng) {
                        setUserLocation({lat: parseFloat(manualLat), lng: parseFloat(manualLng)});
                        setShowLocationInput(false);
                      }
                    }}
                    className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-secondary transition-colors"
                  >
                    Set
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="flex overflow-x-auto pb-2 lg:pb-0 gap-2 w-full lg:w-auto no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search destinations..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#030b17] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayedLocations.map((loc) => {
              const distance = userLocation ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, loc.coordinates.lat, loc.coordinates.lng).toFixed(0) : null;
              return (
                <Link to={`/destinations/${loc.id}`} key={loc.id} className="group bg-white dark:bg-[#061122] rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full hover:-translate-y-1">
                  <div className="relative h-56 overflow-hidden rounded-t-2xl">
                    <img src={loc.images[0]} alt={loc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm text-gray-900 dark:text-white">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" /> 4.5
                    </div>
                    {distance && (
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                        <Navigation className="h-3 w-3" /> {distance} km away
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{loc.name}</h3>
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">{loc.category}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <MapPin className="h-3 w-3" /> {loc.city}, {loc.country}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {loc.transports.map(t => (
                        <span key={t.id} className="text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded border border-gray-100 dark:border-gray-700">
                          {t.type}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">{loc.description}</p>
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center mt-auto">
                      <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">{loc.touristSpots.length} Tourist Spots</span>
                      <span className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">Explore <ArrowRight className="h-4 w-4" /></span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- 2. DETAIL VIEW LOGIC ---
  const location = locations.find((l) => String(l.id) === String(id));

  if (!location) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#071028] px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="h-10 w-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Location Not Found</h2>
          <Link to="/destinations" className="btn btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg">
            <ArrowRight className="h-4 w-4 rotate-180" /> Return to Destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030712]">
      {/* Hero Section - Full Width */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0">
            <img 
              src={location.images[activeImageIndex]} 
              alt={location.name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent"></div>
        </div>
        
        {/* Navigation & Breadcrumbs overlaid */}
        <div className="absolute top-0 left-0 right-0 p-6 z-20">
            <div className="max-w-7xl mx-auto">
                <Link to="/destinations" className="inline-flex items-center gap-2 text-white/80 hover:text-white bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-black/40">
                    <ArrowRight className="h-4 w-4 rotate-180" /> Back to Destinations
                </Link>
            </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 pb-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-primary-400 mb-2">
                            <span className="bg-primary/20 text-primary-300 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/30">
                                {location.category}
                            </span>
                            <span className="flex items-center gap-1 text-yellow-400 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold">
                                <Star className="h-3 w-3 fill-current" /> 4.8
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">{location.name}</h1>
                        <div className="flex items-center gap-2 text-lg text-gray-300">
                            <MapPin className="h-5 w-5 text-primary" />
                            <span>{location.city}, {location.country}</span>
                        </div>
                    </div>
                    
                    {/* Thumbnails */}
                    <div className="flex gap-3 bg-black/30 backdrop-blur-md p-2 rounded-xl border border-white/10">
                        {location.images.map((img, idx) => (
                            <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImageIndex ? 'border-primary scale-105 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                                <img src={img} alt="thumb" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
                {/* Overview */}
                <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        About {location.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                        {location.description}
                    </p>
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <a href={location.googleMapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-secondary font-semibold transition-colors">
                            <Navigation className="h-5 w-5" /> Open in Google Maps
                        </a>
                    </div>
                </div>

                {/* Tourist Spots */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Must Visit Spots</h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {location.touristSpots.map((spot) => (
                            <div key={spot.id} className="group bg-white dark:bg-[#111827] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="relative h-48 overflow-hidden">
                                    <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                    {spot.isHiddenGem && (
                                        <div className="absolute top-3 right-3 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg border border-white/20">
                                            <Gem className="h-3 w-3" /> Hidden Gem
                                        </div>
                                    )}
                                    <div className="absolute bottom-3 left-3 text-white">
                                        <h4 className="font-bold text-lg">{spot.name}</h4>
                                        <div className="text-xs font-medium opacity-90 flex items-center gap-1">
                                            <Navigation className="h-3 w-3" /> {spot.distance} from center
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="space-y-6 lg:sticky lg:top-24 h-fit">
                {/* Hotels Widget */}
                <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                            <HotelIcon className="h-5 w-5 text-primary" /> Top Hotels
                        </h3>
                        <Link to="/hotels" className="text-xs font-semibold text-primary hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {location.hotels.map((h) => (
                            <div key={h.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-[#1f2937] hover:bg-gray-100 dark:hover:bg-[#374151] transition-colors group cursor-pointer">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                                    H
                                </div>
                                <div className="flex-grow">
                                    <div className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-primary transition-colors">{h.name}</div>
                                    <div className="flex items-center gap-1 text-xs text-yellow-500 mt-0.5">
                                        <Star className="h-3 w-3 fill-current" /> {h.rating}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-primary text-sm">{formatINR(h.price)}</div>
                                    <div className="text-[10px] text-gray-500 dark:text-gray-400">/night</div>
                                </div>
                                {h.phone && (
                                  <div className="hidden">
                                    <Phone className="h-3 w-3" /> {h.phone}
                                  </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transport Widget */}
                <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                            <Bus className="h-5 w-5 text-primary" /> How to Reach
                        </h3>
                        <Link to="/transport" className="text-xs font-semibold text-primary hover:underline">Check Availability</Link>
                    </div>
                    <div className="space-y-3">
                        {location.transports.map((t) => (
                            <div key={t.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                        {t.type === 'Train' ? <Bus className="h-4 w-4" /> : <Navigation className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm text-gray-900 dark:text-white">{t.type}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{t.name}</div>
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.priceRange}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    <h3 className="font-bold text-lg mb-2 relative z-10">Plan Your Trip to {location.name}</h3>
                    <p className="text-sm text-white/90 mb-4 relative z-10">Get a personalized itinerary and budget estimate in seconds.</p>
                    <Link to="/route-planning" className="block w-full bg-white text-primary font-bold text-center py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-md relative z-10">
                        Start Planning Now
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}