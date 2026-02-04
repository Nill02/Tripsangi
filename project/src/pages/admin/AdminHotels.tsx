import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X, Star, MapPin, IndianRupee, Clock } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface Hotel {
  _id: string;
  name: string;
  location: string;
  description: string;
  images: string[];
  bestTime: string;
  entryFee: string;
  duration: string;
  price: number;
  rating: number;
}

export default function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    images: '',
    bestTime: '',
    entryFee: '',
    duration: '',
    price: '',
    rating: '',
  });

  const [locations, setLocations] = useState<string[]>([]);

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/locations`);
      const list = Array.isArray(res.data) ? res.data : [];
      setLocations(list.map((l: any) => l.name || l.location || l.title || String(l)));
    } catch (error) {
      // non-fatal: keep locations empty
    }
  };

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    withCredentials: true,
  };

  const fetchHotels = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/hotels`, config);
      setHotels(res.data);
    } catch (error: any) {
      toast.error('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      images: formData.images
        .split(',')
        .map((img) => img.trim())
        .filter((i) => i),
      price: Number(formData.price),
      rating: Number(formData.rating),
    };

    try {
      if (editingHotel) {
        await axios.put(`${API_BASE}/api/admin/hotels/${editingHotel._id}`, payload, config);
        toast.success('Hotel updated');
      } else {
        await axios.post(`${API_BASE}/api/admin/hotels`, payload, config);
        toast.success('Hotel added');
      }
      setShowModal(false);
      fetchHotels();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  if (loading) return <div className='p-10 text-text-primary text-center'>Loading...</div>;

  return (
    <div className='min-h-screen bg-surface p-6'>
      {/* HEADER */}
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold text-text-primary'>Manage Hotels</h1>
        <button
          onClick={() => {
            setEditingHotel(null);
            setShowModal(true);
          }}
          className='flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-lg'
        >
          <Plus size={20} /> Add Hotel
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className='bg-surface border border-accent/20 rounded-xl overflow-hidden shadow-sm'>
        <table className='w-full text-left'>
          <thead className='bg-secondary/10 border-b border-accent/10'>
            <tr className='text-text-secondary text-sm uppercase'>
              <th className='p-4'>Hotel</th>
              <th className='p-4'>Info</th>
              <th className='p-4'>Price/Rating</th>
              <th className='p-4 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-accent/10'>
            {hotels.map((hotel) => (
              <tr key={hotel._id} className='hover:bg-accent/5 transition-colors'>
                <td className='p-4'>
                  <div className='flex items-center gap-3'>
                    <img
                      src={hotel.images[0]}
                      alt=''
                      className='w-16 h-12 object-cover rounded-md'
                    />
                    <span className='font-semibold text-text-primary'>{hotel.name}</span>
                  </div>
                </td>
                <td className='p-4'>
                  <div className='text-sm text-text-secondary flex items-center gap-1'>
                    <MapPin size={14} className='text-primary' /> {hotel.location.slice(0, 25)}...
                  </div>
                  <div className='text-xs text-text-secondary mt-1 flex items-center gap-1'>
                    <Clock size={12} /> {hotel.bestTime || 'N/A'}
                  </div>
                </td>
                <td className='p-4'>
                  <div className='text-primary font-bold flex items-center'>
                    <IndianRupee size={14} /> {hotel.price}
                  </div>
                  <div className='text-orange-400 text-sm flex items-center gap-1 mt-1'>
                    <Star size={14} fill='currentColor' /> {hotel.rating}
                  </div>
                </td>
                <td className='p-4'>
                  <div className='flex justify-center gap-2'>
                    <button
                      onClick={() => {
                        setEditingHotel(hotel);
                        setFormData({
                          ...hotel,
                          price: String(hotel.price),
                          rating: String(hotel.rating),
                          images: hotel.images.join(', '),
                        });
                        setShowModal(true);
                      }}
                      className='p-2 text-primary hover:bg-primary/10 rounded-full transition-colors'
                    >
                      <Edit size={18} />
                    </button>
                    <button className='p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors'>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DESIGN */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-surface w-full max-w-2xl rounded-2xl border border-accent/20 shadow-2xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-accent/10 flex justify-between items-center sticky top-0 bg-surface z-10'>
              <h2 className='text-xl font-bold text-text-primary'>
                {editingHotel ? 'Edit Hotel' : 'New Hotel'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className='text-text-secondary hover:text-text-primary'
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-text-secondary'>Hotel Name</label>
                  <input
                    type='text'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className='w-full p-2.5 bg-accent/5 border border-accent/20 rounded-lg text-text-primary focus:border-primary outline-none'
                    required
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-sm font-medium text-text-secondary'>Location</label>
                  {locations.length > 0 ? (
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className='w-full p-2.5 bg-accent/5 border border-accent/20 rounded-lg text-text-primary focus:border-primary outline-none'
                      required
                    >
                      <option value=''>Select location</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type='text'
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className='w-full p-2.5 bg-accent/5 border border-accent/20 rounded-lg text-text-primary focus:border-primary outline-none'
                      required
                    />
                  )}
                </div>
              </div>

              <div className='space-y-1'>
                <label className='text-sm font-medium text-text-secondary'>Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className='w-full p-2.5 bg-accent/5 border border-accent/20 rounded-lg text-text-primary focus:border-primary outline-none'
                  required
                />
              </div>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='col-span-1'>
                  <label className='text-xs font-medium text-text-secondary'>Price</label>
                  <input
                    type='number'
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className='w-full p-2 bg-accent/5 border border-accent/20 rounded-lg text-text-primary'
                  />
                </div>
                <div className='col-span-1'>
                  <label className='text-xs font-medium text-text-secondary'>Rating</label>
                  <input
                    type='number'
                    step='0.1'
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className='w-full p-2 bg-accent/5 border border-accent/20 rounded-lg text-text-primary'
                  />
                </div>
                <div className='col-span-2'>
                  <label className='text-xs font-medium text-text-secondary'>Best Time</label>
                  <input
                    type='text'
                    value={formData.bestTime}
                    onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
                    className='w-full p-2 bg-accent/5 border border-accent/20 rounded-lg text-text-primary'
                  />
                </div>
              </div>

              <div className='space-y-1'>
                <label className='text-sm font-medium text-text-secondary'>
                  Image URLs (comma separated)
                </label>
                <input
                  type='text'
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className='w-full p-2.5 bg-accent/5 border border-accent/20 rounded-lg text-text-primary outline-none'
                />
              </div>

              <button
                type='submit'
                className='w-full bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 shadow-lg shadow-primary/20 transition-all mt-4'
              >
                {editingHotel ? 'Update Hotel' : 'Create Hotel'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
