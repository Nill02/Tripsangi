// pages/Home.tsx
import { ShieldCheck, Wifi, Headset, MapPin } from 'lucide-react';

const Home = () => (
  <div>
    {/* Hero Section */}
    <section className='relative h-[80vh] flex items-center justify-center text-center text-white'>
      <div className='absolute inset-0 bg-black/50 z-10' />
      <img
        src='https://images.unsplash.com/photo-1566073771259-6a8506099945'
        className='absolute inset-0 w-full h-full object-cover'
        alt='Hotel'
      />
      <div className='relative z-20 px-4'>
        <h2 className='text-4xl md:text-6xl font-bold mb-4'>Comfortable Stay, Affordable Price</h2>
        <div className='flex gap-4 justify-center'>
          <button className='bg-blue-600 px-6 py-3 rounded-lg font-bold'>View Rooms</button>
          <button className='bg-white text-black px-6 py-3 rounded-lg font-bold'>Contact Us</button>
        </div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className='py-20 px-6 max-w-6xl mx-auto'>
      <h3 className='text-3xl font-bold text-center mb-12'>Why Choose Us</h3>
      <div className='grid md:grid-cols-4 gap-8'>
        {[
          { icon: <ShieldCheck />, title: 'Clean Rooms' },
          { icon: <Wifi />, title: 'Free Wi-Fi' },
          { icon: <Headset />, title: '24/7 Support' },
          { icon: <MapPin />, title: 'Prime Location' },
        ].map((item, i) => (
          <div key={i} className='text-center p-6 bg-white rounded-xl shadow-sm border'>
            <div className='text-blue-600 mb-4 flex justify-center'>{item.icon}</div>
            <p className='font-bold'>{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);
export default Home;
