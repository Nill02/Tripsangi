import React, { useState } from 'react';
import { Plus, Trash2, MapPin, Image as ImageIcon } from 'lucide-react'; // icons for better UI

const AddTouristSpot = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    bestTime: '',
    entryFee: '',
    duration: '',
    price: '',
    images: [''], // Start with one empty string for the first image URL
  });

  // Handle standard text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle dynamic image URL inputs
  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty image strings before sending
      const payload = {
        ...formData,
        images: formData.images.filter((url) => url.trim() !== ''),
      };

      const response = await fetch('{}/tourist-spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create spot');

      alert('Tourist Spot Added Successfully!');
      // Reset form
      setFormData({
        name: '',
        location: '',
        description: '',
        bestTime: '',
        entryFee: '',
        duration: '',
        price: '',
        images: [''],
      });
    } catch (error) {
      console.error(error);
      alert('Error adding spot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8'>
        <div className='mb-8 text-center'>
          <h2 className='text-3xl font-extrabold text-gray-900'>Add New Tourist Spot</h2>
          <p className='mt-2 text-gray-600'>Share a new destination with the world</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Section: Basic Info */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='col-span-2'>
              <label className='block text-sm font-medium text-gray-700'>Spot Name</label>
              <input
                type='text'
                name='name'
                required
                value={formData.name}
                onChange={handleChange}
                placeholder='e.g. The Grand Canyon'
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
              />
            </div>

            <div className='col-span-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Location (Google Maps/Address)
              </label>
              <div className='relative mt-1'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <MapPin className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='text'
                  name='location'
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder='e.g. Arizona, USA'
                  className='block w-full rounded-md border border-gray-300 pl-10 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
                />
              </div>
            </div>

            <div className='col-span-2'>
              <label className='block text-sm font-medium text-gray-700'>Description</label>
              <textarea
                name='description'
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder='Tell us about this place...'
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
              />
            </div>
          </div>

          <hr className='border-gray-200' />

          {/* Section: Details */}
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Best Time to Visit</label>
              <input
                type='text'
                name='bestTime'
                value={formData.bestTime}
                onChange={handleChange}
                placeholder='e.g. October to March'
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Duration</label>
              <input
                type='text'
                name='duration'
                value={formData.duration}
                onChange={handleChange}
                placeholder='e.g. 2 Days'
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Entry Fee</label>
              <input
                type='text'
                name='entryFee'
                value={formData.entryFee}
                onChange={handleChange}
                placeholder='e.g. $25 per person'
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Total Price Estimate
              </label>
              <input
                type='text'
                name='price'
                value={formData.price}
                onChange={handleChange}
                placeholder='e.g. $500'
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
              />
            </div>
          </div>

          <hr className='border-gray-200' />

          {/* Section: Images (Array of Strings) */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Images (URLs)</label>
            <div className='space-y-3'>
              {formData.images.map((url, index) => (
                <div key={index} className='flex gap-2'>
                  <div className='relative flex-grow'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                      <ImageIcon className='h-5 w-5 text-gray-400' />
                    </div>
                    <input
                      type='text'
                      value={url}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder='https://example.com/image.jpg'
                      className='block w-full rounded-md border border-gray-300 pl-10 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
                    />
                  </div>
                  {formData.images.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeImageField(index)}
                      className='p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md'
                    >
                      <Trash2 className='h-5 w-5' />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type='button'
              onClick={addImageField}
              className='mt-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              <Plus className='h-4 w-4 mr-2' />
              Add Another Image
            </button>
          </div>

          {/* Submit Button */}
          <div className='pt-4'>
            <button
              type='submit'
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Adding Spot...' : 'Create Tourist Spot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTouristSpot;
