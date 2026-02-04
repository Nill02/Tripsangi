import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/* ================= AUTH HEADER ================= */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

/* ================= TYPES ================= */
interface Location {
  _id: string;
  name: string;
  city: string;
  country: string;
  images: string[];
  description: string;
  touristSpots?: string[];
}

type LocationFormData = Omit<Location, '_id'>;

/* ================= COMPONENT ================= */
export default function AdminLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  // Tourist spots options for dropdown
  interface TouristSpot {
    _id: string;
    name: string;
  }
  const [touristOptions, setTouristOptions] = useState<TouristSpot[]>([]);

  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    city: '',
    country: '',
    images: [],
    description: '',
    touristSpots: [],
  });

  /* ================= FETCH ================= */
  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/locations`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      setLocations(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const fetchTouristSpots = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/touristSpots`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      // API returns { spots, total, ... } — prefer spots array
      const data = res.data?.spots ?? res.data ?? [];
      setTouristOptions(
        Array.isArray(data) ? data.map((s: any) => ({ _id: s._id, name: s.name })) : [],
      );
    } catch (err: any) {
      // non-fatal
      toast.error(err.response?.data?.message || 'Failed to load tourist spots');
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchTouristSpots();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      images: formData.images.filter(Boolean),
    };

    if (!payload.images.every((url) => url.startsWith('http'))) {
      toast.error('All images must be valid URLs');
      setSubmitting(false);
      return;
    }

    try {
      if (editingLocation) {
        await axios.put(`${API_BASE}/api/admin/locations/${editingLocation._id}`, payload, {
          headers: getAuthHeaders(),
          withCredentials: true,
        });
        toast.success('Location updated');
      } else {
        await axios.post(`${API_BASE}/api/admin/locations`, payload, {
          headers: getAuthHeaders(),
          withCredentials: true,
        });
        toast.success('Location created');
      }

      setShowModal(false);
      setEditingLocation(null);
      resetForm();
      fetchLocations();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      await axios.delete(`${API_BASE}/api/admin/locations/${id}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      toast.success('Location deleted');
      setLocations((prev) => prev.filter((loc) => loc._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  /* ================= HELPERS ================= */
  const openAddModal = () => {
    resetForm();
    setEditingLocation(null);
    setShowModal(true);
  };

  const openEditModal = (loc: Location) => {
    setEditingLocation(loc);
    setFormData({
      name: loc.name,
      city: loc.city,
      country: loc.country,
      images: loc.images || [],
      description: loc.description,
      touristSpots: (loc as any).touristSpots
        ? (loc as any).touristSpots.map((t: any) => (typeof t === 'string' ? t : t._id))
        : [],
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      city: '',
      country: '',
      images: [],
      description: '',
      touristSpots: [],
    });
  };

  /* ================= UI ================= */
  if (loading)
    return (
      <div className='flex justify-center items-center h-64'>
        <Loader2 className='animate-spin text-blue-600' size={48} />
      </div>
    );

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Manage Locations</h1>
        <button
          onClick={openAddModal}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded'
        >
          <Plus size={18} /> Add Location
        </button>
      </div>

      <div className='bg-white rounded shadow overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-3 text-left'>Images</th>
              <th className='p-3 text-left'>Name</th>
              <th className='p-3 text-left'>City</th>
              <th className='p-3 text-left'>Country</th>
              <th className='p-3 text-right'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.length === 0 ? (
              <tr>
                <td colSpan={5} className='p-4 text-center text-gray-500'>
                  No locations found
                </td>
              </tr>
            ) : (
              locations.map((loc) => (
                <tr key={loc._id} className='border-t'>
                  <td className='p-3 flex gap-2'>
                    {loc.images.slice(0, 3).map((img, i) => (
                      <img key={i} src={img} className='w-14 h-12 object-cover rounded' />
                    ))}
                  </td>
                  <td className='p-3 font-medium'>{loc.name}</td>
                  <td className='p-3'>{loc.city}</td>
                  <td className='p-3'>{loc.country}</td>
                  <td className='p-3 flex gap-3 justify-end'>
                    <button onClick={() => openEditModal(loc)}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(loc._id)}>
                      <Trash2 size={18} className='text-red-600' />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
          <form onSubmit={handleSubmit} className='bg-white p-6 rounded w-full max-w-lg space-y-4'>
            <div className='flex justify-between'>
              <h2 className='font-semibold'>
                {editingLocation ? 'Edit Location' : 'New Location'}
              </h2>
              <X onClick={() => setShowModal(false)} className='cursor-pointer' />
            </div>

            {['name', 'city', 'country'].map((field) => (
              <input
                key={field}
                placeholder={field}
                value={(formData as any)[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className='w-full border p-2 rounded'
                required
              />
            ))}

            {/* Images */}
            <div>
              <label className='text-sm font-medium'>Images</label>
              {formData.images.map((img, i) => (
                <div key={i} className='flex gap-2 mt-2'>
                  <input
                    value={img}
                    onChange={(e) => {
                      const images = [...formData.images];
                      images[i] = e.target.value;
                      setFormData({ ...formData, images });
                    }}
                    className='flex-1 border p-2 rounded'
                    placeholder='Image URL'
                  />
                  <button
                    type='button'
                    onClick={() =>
                      setFormData({
                        ...formData,
                        images: formData.images.filter((_, idx) => idx !== i),
                      })
                    }
                    className='text-red-600'
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type='button'
                onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                className='text-blue-600 mt-2 text-sm'
              >
                + Add Image
              </button>
            </div>

            {/* Tourist Spots Multi-select */}
            <div>
              <label className='text-sm font-medium'>Tourist Spots</label>
              <select
                multiple
                value={formData.touristSpots}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
                  setFormData({ ...formData, touristSpots: selected });
                }}
                className='w-full border p-2 rounded mt-2 h-36'
              >
                {touristOptions.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <p className='text-xs text-gray-500 mt-1'>Hold Ctrl/Cmd to select multiple.</p>
            </div>

            <textarea
              placeholder='Description'
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className='w-full border p-2 rounded'
              rows={4}
              required
            />

            <button disabled={submitting} className='w-full bg-blue-600 text-white py-2 rounded'>
              {submitting ? 'Saving...' : editingLocation ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
