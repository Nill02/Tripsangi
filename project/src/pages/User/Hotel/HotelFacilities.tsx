// pages/Facilities.tsx
import { Coffee, Car, Wind, Lock, Clock } from 'lucide-react';

const Facilities = () => (
  <div className='py-20 px-6 max-w-4xl mx-auto'>
    <section className='mb-16 text-center'>
      <h2 className='text-4xl font-bold mb-6'>About Us</h2>
      <p className='text-lg text-gray-600 leading-relaxed'>
        We provide comfortable, affordable, and safe accommodation for families, couples, and
        business travelers. Our rooms are designed to give you a peaceful stay with modern
        facilities.
      </p>
    </section>

    <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
      {[
        { icon: <Wifi />, label: 'High-Speed Wi-Fi' },
        { icon: <Car />, label: 'Free Parking' },
        { icon: <Clock />, label: '24/7 Room Service' },
        { icon: <Wind />, label: 'Air Conditioned' },
        { icon: <Lock />, label: 'CCTV Security' },
        { icon: <Coffee />, label: 'Tea & Coffee' },
      ].map((f, i) => (
        <div key={i} className='flex items-center gap-4 p-4 border rounded-lg bg-white'>
          <div className='text-blue-600'>{f.icon}</div>
          <span className='font-medium text-gray-700'>{f.label}</span>
        </div>
      ))}
    </div>
  </div>
);
export default Facilities;