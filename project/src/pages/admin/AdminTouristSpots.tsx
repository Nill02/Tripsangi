import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

/* ================= TYPES ================= */

interface TouristSpot {
  _id: string;
  name: string;
  description: string;
  images: string[];
  bestTime: string;
  entryFee: string;
  duration: string;
  location: {
    _id: string;
    name?: string;
  };
  coordinates: {
    lat: string;
    lng: string;
  };
}

interface Location {
  _id: string;
  name: string;
}

/* ================= DEFAULT ================= */

const defaultSpot: TouristSpot = {
  _id: '',
  name: '',
  description: '',
  images: [],
  bestTime: '',
  entryFee: '',
  duration: '',
  location: { _id: '', name: '' },
  coordinates: { lat: '', lng: '' },
};

/* ================= COMPONENT ================= */

export default function AdminTouristSpots() {
  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [spotData, setSpotData] = useState<TouristSpot>(defaultSpot);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= FETCH ================= */

  const fetchSpots = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/api/admin/tourist-spots`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpots(res.data);
    } catch {
      toast.error('Failed to fetch tourist spots');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const fetchLocations = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/api/admin/locations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocations(res.data);
    } catch {
      toast.error('Failed to fetch locations');
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchSpots();
    fetchLocations();
  }, [fetchSpots, fetchLocations]);

  /* ================= FORM ================= */

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'lat' || name === 'lng') {
      setSpotData((prev) => ({
        ...prev,
        coordinates: { ...prev.coordinates, [name]: value },
      }));
    } else {
      setSpotData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addImageField = () => setSpotData((prev) => ({ ...prev, images: [...prev.images, ''] }));

  const updateImage = (index: number, value: string) => {
    const images = [...spotData.images];
    images[index] = value;
    setSpotData((prev) => ({ ...prev, images }));
  };

  const removeImage = (index: number) =>
    setSpotData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSpotData(defaultSpot);
      setSelectedSpot(null);
    }, 100);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.isAdmin) return toast.error('Access denied');
    if (!spotData.name.trim()) return toast.error('Name required');
    if (!spotData.description.trim()) return toast.error('Description required');
    if (!spotData.location._id) return toast.error('Location required');

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      const payload = {
        ...spotData,
        location: spotData.location._id,
        coordinates: {
          lat: parseFloat(spotData.coordinates.lat),
          lng: parseFloat(spotData.coordinates.lng),
        },
      };

      const res = await axios({
        method: selectedSpot ? 'put' : 'post',
        url: selectedSpot
          ? `${API_BASE}/api/admin/tourist-spots/${selectedSpot._id}`
          : `${API_BASE}/api/admin/tourist-spots`,
        data: payload,
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(selectedSpot ? 'Updated successfully' : 'Added successfully');

      setSpots((prev) =>
        selectedSpot
          ? prev.map((s) => (s._id === selectedSpot._id ? res.data : s))
          : [...prev, res.data],
      );

      closeModal();
    } catch {
      toast.error('Save failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/api/admin/tourist-spots/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpots((prev) => prev.filter((s) => s._id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const confirmDelete = (id: string) => {
    toast((t) => (
      <div className='flex gap-3'>
        <span>Delete this spot?</span>
        <button
          onClick={() => {
            handleDelete(id);
            toast.dismiss(t.id);
          }}
          className='text-red-600 font-semibold'
        >
          Yes
        </button>
      </div>
    ));
  };

  const filteredSpots = spots.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /* ================= UI ================= */

  return (
    <div className='min-h-screen p-8'>
      <div className='flex justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Manage Tourist Spots</h1>

        {user?.isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded'
          >
            <Plus size={18} /> Add Spot
          </button>
        )}
      </div>

      <div className='mb-6 relative max-w-md'>
        <input
          className='w-full px-4 py-2 pl-10 border rounded'
          placeholder='Search...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className='absolute left-3 top-3 text-gray-400' size={18} />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='grid md:grid-cols-3 gap-6'>
          {filteredSpots.map((spot) => (
            <div key={spot._id} className='border rounded shadow'>
              <img
                src={spot.images[0] || '/placeholder.jpg'}
                className='h-48 w-full object-cover'
              />
              <div className='p-4'>
                <h3 className='font-semibold'>{spot.name}</h3>
                <p className='text-sm text-gray-600'>{spot.location?.name}</p>

                {user?.isAdmin && (
                  <div className='flex gap-3 mt-3'>
                    <button
                      onClick={() => {
                        setSelectedSpot(spot);
                        setSpotData({
                          ...spot,
                          location: {
                            _id: spot.location._id,
                            name: spot.location.name,
                          },
                          coordinates: {
                            lat: String(spot.coordinates.lat),
                            lng: String(spot.coordinates.lng),
                          },
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit />
                    </button>
                    <button onClick={() => confirmDelete(spot._id)}>
                      <Trash2 className='text-red-600' />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
          <form onSubmit={handleSubmit} className='bg-white p-6 rounded w-96 space-y-3'>
            <div className='flex justify-between'>
              <h2 className='font-semibold'>{selectedSpot ? 'Edit Spot' : 'Add Spot'}</h2>
              <X onClick={closeModal} className='cursor-pointer' />
            </div>

            <input
              name='name'
              value={spotData.name}
              onChange={handleInputChange}
              placeholder='Name'
              className='w-full border p-2'
            />
            <textarea
              name='description'
              value={spotData.description}
              onChange={handleInputChange}
              placeholder='Description'
              className='w-full border p-2'
            />

            <select
              value={spotData.location._id}
              onChange={(e) => {
                const loc = locations.find((l) => l._id === e.target.value);
                if (loc)
                  setSpotData((prev) => ({
                    ...prev,
                    location: { _id: loc._id, name: loc.name },
                  }));
              }}
              className='w-full border p-2'
            >
              <option value=''>Select Location</option>
              {locations.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.name}
                </option>
              ))}
            </select>

            <div>
              <label className='text-sm font-medium'>Images</label>
              {spotData.images.map((img, i) => (
                <div key={i} className='flex gap-2 mt-1'>
                  <input
                    value={img}
                    onChange={(e) => updateImage(i, e.target.value)}
                    className='flex-1 border p-2'
                    placeholder='Image URL'
                  />
                  <X onClick={() => removeImage(i)} className='cursor-pointer text-red-600' />
                </div>
              ))}
              <button type='button' onClick={addImageField} className='text-blue-600 text-sm mt-2'>
                + Add Image
              </button>
            </div>

            <button disabled={isSubmitting} className='w-full bg-blue-600 text-white py-2 rounded'>
              {selectedSpot ? 'Update' : 'Add'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
