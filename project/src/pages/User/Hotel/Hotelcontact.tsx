// pages/Contact.tsx
const Contact = () => (
  <div className='max-w-6xl mx-auto p-10 grid md:grid-cols-2 gap-16'>
    <div>
      <h2 className='text-4xl font-bold mb-6'>Get In Touch</h2>
      <p className='mb-8 text-gray-600'>Have questions? Reach out to us directly.</p>

      <div className='space-y-6'>
        <div>
          <p className='font-bold'>Address</p>
          <p>Kolkata, West Bengal, India</p>
        </div>
        <div>
          <p className='font-bold'>Phone</p>
          <p>+91 XXXXXXXXXX</p>
        </div>
        <div>
          <p className='font-bold'>Email</p>
          <p>hotel@example.com</p>
        </div>
      </div>
    </div>

    <form className='bg-white p-8 rounded-2xl shadow-xl space-y-4'>
      <input type='text' placeholder='Your Name' className='w-full p-3 border rounded-lg' />
      <input type='tel' placeholder='Phone Number' className='w-full p-3 border rounded-lg' />
      <textarea placeholder='Message' rows={4} className='w-full p-3 border rounded-lg'></textarea>
      <button className='w-full bg-blue-800 text-white py-3 rounded-lg font-bold hover:bg-blue-900'>
        Send Message
      </button>
    </form>
  </div>
);
export default Contact;