import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);

      if (user?.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.message || 'Invalid email or password.');
      } else {
        setError('Server error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-2xl font-bold mb-4'>Login</h1>
      {error && <p className='text-red-500'>{error}</p>}
      <form onSubmit={handleLogin} className='w-1/3 space-y-4'>
        <input
          className='border p-2 w-full'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className='border p-2 w-full'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className='bg-blue-500 text-white px-4 py-2 w-full'
          type='submit'
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className='mt-4'>
        Don't have an account?{' '}
        <Link to='/register' className='text-blue-500'>
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login; 
