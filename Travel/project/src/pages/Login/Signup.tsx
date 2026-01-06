import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

type SignupForm = {
  name: string;
  email: string;
  password: string;
  gender: string;
  age: string;
  dateOfBirth: string;

  homeLocation: {
    city: string;
    state: string;
    country: string;
  };

  interests: string[];
  budgetPreference: string;
  crowdPreference: string;
  travelStyle: string;

  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };

  medicalNotes: string;
};

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<SignupForm>({
    name: '',
    email: '',
    password: '',
    gender: '',
    age: '',
    dateOfBirth: '',

    homeLocation: {
      city: '',
      state: '',
      country: 'India',
    },

    interests: [],
    budgetPreference: 'medium',
    crowdPreference: 'avoid',
    travelStyle: 'solo',

    emergencyContact: {
      name: '',
      phone: '',
      relation: '',
    },

    medicalNotes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckbox = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((i) => i !== value)
        : [...prev.interests, value],
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.interests.length === 0) {
      setError('Please select at least one travel interest');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError('Signup failed. Please check details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex justify-center py-10 px-3'>
      <form
        onSubmit={handleSignup}
        className='bg-white w-full max-w-3xl p-6 rounded-xl shadow space-y-6'
      >
        <h1 className='text-2xl font-bold text-center'>Create Your Account</h1>

        {error && <p className='text-red-500 text-center'>{error}</p>}

        {/* BASIC INFO */}
        <section>
          <h2 className='font-semibold mb-2'>Basic Information</h2>
          <div className='grid md:grid-cols-2 gap-4'>
            <input
              name='name'
              placeholder='Full Name'
              required
              className='border p-2 rounded'
              onChange={handleChange}
            />
            <input
              name='email'
              type='email'
              placeholder='Email'
              required
              className='border p-2 rounded'
              onChange={handleChange}
            />
            <input
              name='password'
              type='password'
              placeholder='Password'
              minLength={6}
              required
              className='border p-2 rounded'
              onChange={handleChange}
            />

            <select name='gender' className='border p-2 rounded' onChange={handleChange}>
              <option value=''>Gender</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
              <option value='other'>Other</option>
            </select>

            <input
              name='age'
              type='number'
              placeholder='Age (optional)'
              className='border p-2 rounded'
              onChange={handleChange}
            />
            <input
              name='dateOfBirth'
              type='date'
              className='border p-2 rounded'
              onChange={handleChange}
            />
          </div>
        </section>

        {/* LOCATION */}
        <section>
          <h2 className='font-semibold mb-2'>Home Location</h2>
          <div className='grid md:grid-cols-3 gap-4'>
            <input
              name='homeLocation.city'
              placeholder='City'
              required
              className='border p-2 rounded'
              onChange={handleChange}
            />
            <input
              name='homeLocation.state'
              placeholder='State'
              className='border p-2 rounded'
              onChange={handleChange}
            />
            <input
              name='homeLocation.country'
              placeholder='Country'
              className='border p-2 rounded'
              onChange={handleChange}
            />
          </div>
        </section>

        {/* TRAVEL */}
        <section>
          <h2 className='font-semibold mb-2'>Travel Preferences</h2>

          <div className='flex flex-wrap gap-3'>
            {['nature', 'history', 'food', 'adventure', 'religious', 'shopping'].map((item) => (
              <label key={item} className='flex items-center gap-2 text-sm'>
                <input
                  type='checkbox'
                  checked={formData.interests.includes(item)}
                  onChange={() => handleCheckbox(item)}
                />
                {item}
              </label>
            ))}
          </div>

          <div className='grid md:grid-cols-3 gap-4 mt-3'>
            <select name='budgetPreference' className='border p-2 rounded' onChange={handleChange}>
              <option value='low'>Low Budget</option>
              <option value='medium'>Medium</option>
              <option value='luxury'>Luxury</option>
            </select>

            <select name='crowdPreference' className='border p-2 rounded' onChange={handleChange}>
              <option value='avoid'>Avoid Crowd</option>
              <option value='normal'>Normal</option>
            </select>

            <select name='travelStyle' className='border p-2 rounded' onChange={handleChange}>
              <option value='solo'>Solo</option>
              <option value='couple'>Couple</option>
              <option value='family'>Family</option>
              <option value='group'>Group</option>
            </select>
          </div>
        </section>

        {/* EMERGENCY */}
        <section>
          <h2 className='font-semibold mb-2'>Emergency Contact</h2>
          <div className='grid md:grid-cols-3 gap-4'>
            <input
              name='emergencyContact.name'
              placeholder='Name'
              className='border p-2 rounded'
              onChange={handleChange}
            />
            <input
              name='emergencyContact.phone'
              placeholder='Phone'
              className='border p-2 rounded'
              onChange={handleChange}
            />
            <input
              name='emergencyContact.relation'
              placeholder='Relation'
              className='border p-2 rounded'
              onChange={handleChange}
            />
          </div>
        </section>

        {/* MEDICAL */}
        <section>
          <h2 className='font-semibold mb-2'>Medical Notes</h2>
          <textarea
            name='medicalNotes'
            className='border p-2 w-full rounded'
            placeholder='Optional medical information'
            onChange={handleChange}
          />
        </section>

        <button
          disabled={loading}
          className='bg-green-600 text-white w-full py-3 rounded font-semibold'
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p className='text-center text-sm'>
          Already registered?{' '}
          <Link to='/login' className='text-green-600 font-medium'>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
