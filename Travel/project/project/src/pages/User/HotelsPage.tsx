import { useState } from 'react';
import { Search, MapPin, Star, Filter, Wifi, Coffee, Car, Utensils, Check } from 'lucide-react';

const hotels = [
  { id: 1, name: 'Hotel Pine View', location: 'Darjeeling', price: 3500, rating: 4.2, image: 'https://picsum.photos/seed/hotel1/400/300', amenities: ['Wifi', 'Breakfast', 'View'] },
  { id: 2, name: 'Sunderban Lodge', location: 'Sundarbans', price: 2800, rating: 4.0, image: 'https://picsum.photos/seed/hotel2/400/300', amenities: ['Wifi', 'Pool', 'Guide'] },
  { id: 3, name: 'Seaview Resort', location: 'Digha', price: 2600, rating: 3.8, image: 'https://picsum.photos/seed/hotel3/400/300', amenities: ['AC', 'Parking', 'Beach Access'] },
  { id: 4, name: 'Grand City Hotel', location: 'Kolkata', price: 5500, rating: 4.7, image: 'https://picsum.photos/seed/hotel4/400/300', amenities: ['Wifi', 'Spa', 'Gym', 'Bar'] },
  { id: 5, name: 'Mayfair Darjeeling', location: 'Darjeeling', price: 8500, rating: 4.9, image: 'https://picsum.photos/seed/hotel5/400/300', amenities: ['Luxury', 'Spa', 'Heritage'] },
  { id: 6, name: 'Sonar Bangla', location: 'Taki', price: 3200, rating: 4.3, image: 'https://picsum.photos/seed/hotel6/400/300', amenities: ['River View', 'Pool', 'Restaurant'] },
];

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<number>(10000);

  const filteredHotels = hotels.filter(h => 
    (h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
    h.price <= priceRange
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#071028] pb-12">
      {/* Hero Section with Background */}
      <div className="relative bg-gray-900 py-20 mb-8">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Luxury Hotel" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Find Your Perfect <span className="text-primary">Stay</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            From cozy cottages to luxury resorts, discover the best accommodations for your next adventure.
          </p>
          
          {/* Search Bar Floating */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-[#061122] p-2 rounded-full shadow-2xl flex items-center">
            <div className="pl-4 text-gray-400">
              <Search className="h-6 w-6" />
            </div>
            <input 
              type="text" 
              placeholder="Where do you want to stay?" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full px-4 py-3 rounded-full bg-transparent text-gray-900 dark:text-white focus:outline-none text-lg" 
            />
            <button className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-full font-semibold transition-colors hidden sm:block">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Filter className="h-5 w-5" />
            <span className="font-medium">Filters:</span>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-[#061122] px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-500">Max Price: ₹{priceRange}</span>
            <input 
              type="range" 
              min="1000" 
              max="10000" 
              step="500" 
              value={priceRange} 
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-32 md:w-48 accent-primary cursor-pointer"
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredHotels.length} properties
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHotels.map(hotel => (
                <div key={hotel.id} className="bg-white dark:bg-[#061122] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 group flex flex-col h-full transform hover:-translate-y-1">
                    <div className="relative h-64 overflow-hidden">
                        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-4 right-4 bg-white/95 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1 shadow-lg text-gray-900 dark:text-white">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" /> {hotel.rating}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <h3 className="text-xl font-bold text-white mb-1">{hotel.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-200">
                              <MapPin className="h-4 w-4" /> {hotel.location}
                          </div>
                        </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                        <div className="flex flex-wrap gap-3 mb-4 flex-grow">
                            {hotel.amenities.slice(0, 3).map(a => (
                                <span key={a} className="inline-flex items-center gap-1 text-xs font-medium bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700">
                                  {a === 'Wifi' && <Wifi className="h-3 w-3" />}
                                  {a === 'Breakfast' && <Coffee className="h-3 w-3" />}
                                  {a === 'Parking' && <Car className="h-3 w-3" />}
                                  {a === 'Restaurant' && <Utensils className="h-3 w-3" />}
                                  {!['Wifi', 'Breakfast', 'Parking', 'Restaurant'].includes(a) && <Check className="h-3 w-3" />}
                                  {a}
                                </span>
                            ))}
                            {hotel.amenities.length > 3 && (
                              <span className="text-xs text-gray-400 flex items-center">+{hotel.amenities.length - 3} more</span>
                            )}
                        </div>
                        
                        <div className="flex items-end justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Starting from</p>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-2xl font-bold text-primary">₹{hotel.price.toLocaleString('en-IN')}</span>
                                  <span className="text-xs text-gray-500">/night</span>
                                </div>
                            </div>
                            <button className="bg-white dark:bg-transparent border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md">
                              View Details
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}