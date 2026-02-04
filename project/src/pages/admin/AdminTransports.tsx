import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/* ---------- TYPES ---------- */

const TRANSPORT_TYPES = [
  'bus',
  'train',
  '4wheeler',
  'toto',
  'taxi',
  'bike',
  'flight',
  'ship',
  'boat',
];

interface Location {
  _id: string;
  name: string;
}

interface Transport {
  _id: string;
  name: string;
  type: string;
  price: number;
  images: string[];
  from: string;
  to: string;
  location?: Location;
  availability: boolean;
  stopage: string[];
  duration: string;
  seats: number;
}

/* ---------- COMPONENT ---------- */

export default function AdminTransports() {
  const [transports, setTransports] = useState<Transport[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Transport | null>(null);

  const [form, setForm] = useState({
    name: '',
    type: '',
    price: '',
    images: '',
    from: '',
    to: '',
    location: '',
    availability: true,
    stopage: '',
    duration: '',
    seats: '',
  });

  /* ---------- FETCH ---------- */

  const fetchTransports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/transports`, {
        withCredentials: true,
      });
      setTransports(res.data);
    } catch {
      toast.error('Failed to load transports');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/locations`);
      setLocations(res.data);
    } catch {
      toast.error('Failed to load locations');
    }
  };

  useEffect(() => {
    fetchTransports();
    fetchLocations();
  }, []);

  /* ---------- ADD / UPDATE ---------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      seats: Number(form.seats),
      images: form.images.split(',').map((i) => i.trim()),
      stopage: form.stopage.split(',').map((s) => s.trim()),
    };

    try {
      if (editing) {
        await axios.put(`${API_BASE}/api/transports/${editing._id}`, payload, {
          withCredentials: true,
        });
        toast.success('Transport updated');
      } else {
        await axios.post(`${API_BASE}/api/transports`, payload, {
          withCredentials: true,
        });
        toast.success('Transport added');
      }

      closeModal();
      fetchTransports();
    } catch {
      toast.error('Operation failed');
    }
  };

  /* ---------- DELETE ---------- */

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transport?')) return;

    try {
      await axios.delete(`${API_BASE}/api/transports/${id}`, {
        withCredentials: true,
      });
      toast.success('Transport deleted');
      fetchTransports();
    } catch {
      toast.error('Delete failed');
    }
  };

  /* ---------- MODAL HELPERS ---------- */

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: '',
      type: '',
      price: '',
      images: '',
      from: '',
      to: '',
      location: '',
      availability: true,
      stopage: '',
      duration: '',
      seats: '',
    });
    setShowModal(true);
  };

  const openEdit = (t: Transport) => {
    setEditing(t);
    setForm({
      name: t.name,
      type: t.type,
      price: String(t.price),
      images: t.images.join(', '),
      from: t.from,
      to: t.to,
      location: t.location?._id || '',
      availability: t.availability,
      stopage: t.stopage.join(', '),
      duration: t.duration,
      seats: String(t.seats),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  /* ---------- UI ---------- */

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* HEADER */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Manage Transports</h1>
        <button
          onClick={openAdd}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded'
        >
          <Plus size={18} />
          Add Transport
        </button>
      </div>

      {/* TABLE */}
      <div className='bg-white dark:bg-gray-800 rounded shadow overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-100 dark:bg-gray-700'>
            <tr>
              <th className='p-3 text-left'>Name</th>
              <th className='p-3 text-left'>Type</th>
              <th className='p-3 text-left'>Route</th>
              <th className='p-3 text-left'>Price</th>
              <th className='p-3 text-left'>Seats</th>
              <th className='p-3 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transports.map((t) => (
              <tr key={t._id} className='border-t'>
                <td className='p-3'>{t.name}</td>
                <td className='p-3 uppercase'>{t.type}</td>
                <td className='p-3'>
                  {t.from} → {t.to}
                </td>
                <td className='p-3'>₹{t.price}</td>
                <td className='p-3'>{t.seats}</td>
                <td className='p-3 flex gap-3'>
                  <button onClick={() => openEdit(t)} className='text-blue-600'>
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(t._id)} className='text-red-600'>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-900 w-full max-w-2xl rounded p-6 overflow-y-auto max-h-[90vh]'>
            <div className='flex justify-between mb-4'>
              <h2 className='text-xl font-bold'>{editing ? 'Edit Transport' : 'Add Transport'}</h2>
              <button onClick={closeModal}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
              <input
                placeholder='Name'
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className='p-2 border rounded col-span-2'
                required
              />

              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className='p-2 border rounded'
                required
              >
                <option value=''>Select Type</option>
                {TRANSPORT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.toUpperCase()}
                  </option>
                ))}
              </select>

              <input
                placeholder='Price'
                type='number'
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className='p-2 border rounded'
                required
              />

              <input
                placeholder='From'
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                className='p-2 border rounded'
                required
              />

              <input
                placeholder='To'
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className='p-2 border rounded'
                required
              />

              <input
                placeholder='Duration (e.g. 5h 30m)'
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className='p-2 border rounded'
                required
              />

              <input
                placeholder='Seats'
                type='number'
                value={form.seats}
                onChange={(e) => setForm({ ...form, seats: e.target.value })}
                className='p-2 border rounded'
              />

              <select
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className='p-2 border rounded col-span-2'
              >
                <option value=''>Select Location</option>
                {locations.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.name}
                  </option>
                ))}
              </select>

              <textarea
                placeholder='Stopages (comma separated)'
                value={form.stopage}
                onChange={(e) => setForm({ ...form, stopage: e.target.value })}
                className='p-2 border rounded col-span-2'
                required
              />

              <textarea
                placeholder='Image URLs (comma separated)'
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                className='p-2 border rounded col-span-2'
              />

              <label className='flex items-center gap-2 col-span-2'>
                <input
                  type='checkbox'
                  checked={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.checked })}
                />
                Available
              </label>

              <button type='submit' className='col-span-2 bg-blue-600 text-white py-2 rounded'>
                {editing ? 'Update Transport' : 'Add Transport'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
