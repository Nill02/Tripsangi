import { useState } from 'react';
import { MapPin, Calendar, Plus, Trash2, Map, Clock } from 'lucide-react';

export default function RoutePlanningPage() {
  const [destinations, setDestinations] = useState([{ id: 1, value: '' }, { id: 2, value: '' }]);
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('3');
  const [budget, setBudget] = useState('5000');
  const [showItinerary, setShowItinerary] = useState(false);

  const addDestination = () => {
    setDestinations([...destinations, { id: Date.now(), value: '' }]);
  };

  const removeDestination = (id: number) => {
    if (destinations.length > 2) {
      setDestinations(destinations.filter(d => d.id !== id));
    }
  };

  const handleDestinationChange = (id: number, value: string) => {
    setDestinations(destinations.map(d => d.id === id ? { ...d, value } : d));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowItinerary(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#071028] pb-12">
      {/* Hero */}
      <div className="bg-primary/10 dark:bg-[#0a192f] py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Plan Your <span className="text-primary">Dream Trip</span></h1>
          <p className="text-gray-600 dark:text-gray-300">Create a custom itinerary tailored to your preferences.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
        {/* Planning Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#061122] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" /> Trip Details
            </h2>
            
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Destinations</label>
                {destinations.map((dest, index) => (
                  <div key={dest.id} className="flex gap-2">
                    <div className="relative flex-grow">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder={index === 0 ? "Start Point (e.g. Kolkata)" : "Destination"}
                        value={dest.value}
                        onChange={(e) => handleDestinationChange(dest.id, e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#030b17] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none text-sm"
                        required
                      />
                    </div>
                    {destinations.length > 2 && (
                      <button type="button" onClick={() => removeDestination(dest.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addDestination} className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                  <Plus className="h-4 w-4" /> Add Stop
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#030b17] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (Days)</label>
                  <input 
                    type="number" 
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#030b17] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget (₹)</label>
                  <input 
                    type="number" 
                    min="1000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#030b17] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none text-sm"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl">
                Generate Itinerary
              </button>
            </form>
          </div>
        </div>

        {/* Results / Itinerary */}
        <div className="lg:col-span-2">
          {!showItinerary ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-white/50 dark:bg-[#061122]/50">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Map className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ready to plan?</h3>
              <p className="text-gray-500 max-w-md">Enter your trip details on the left to generate a personalized day-by-day itinerary with estimated costs.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white dark:bg-[#061122] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Trip Itinerary</h2>
                    <p className="text-gray-500 text-sm mt-1">{destinations.map(d => d.value).filter(Boolean).join(' → ')}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Est. Cost</div>
                    <div className="text-xl font-bold text-primary">₹{parseInt(budget).toLocaleString()}</div>
                  </div>
                </div>

                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {Array.from({ length: parseInt(duration) }).map((_, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <span className="font-bold text-sm">{i + 1}</span>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 dark:bg-[#030b17] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900 dark:text-white">Day {i + 1}</h3>
                          <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="h-3 w-3" /> 9:00 AM Start</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {i === 0 ? "Arrival and check-in. Evening local sightseeing." : 
                           i === parseInt(duration) - 1 ? "Morning breakfast, souvenir shopping and departure." : 
                           "Full day tour of major attractions and hidden gems."}
                        </p>
                        <div className="flex gap-2">
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Sightseeing</span>
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">Food</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <button className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Save Draft</button>
                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary shadow-lg">Book Now</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}