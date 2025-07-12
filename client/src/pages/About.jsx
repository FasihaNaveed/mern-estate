import React, { useEffect } from 'react';
import { FaHome, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className='py-20 px-4 max-w-6xl mx-auto text-center'>
      <h1
        className='text-3xl font-bold mb-6 text-slate-800'
        data-aos="fade-down"
      >
        About Us
      </h1>

      <p className='mb-4 text-slate-700' data-aos="fade-up">
        Estate Nest is a leading real estate agency that specializes in helping clients buy, sell, and rent properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.
      </p>
      <p className='mb-4 text-slate-700' data-aos="fade-up" data-aos-delay="100">
        Our mission is to help our clients achieve their real estate goals by providing expert advice, personalized service, and a deep understanding of the local market. Whether you are looking to buy, sell, or rent a property, we are here to help you every step of the way.
      </p>
      {/* Feature Cards Section */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div
          className='bg-slate-100 p-6 rounded-lg shadow transition-transform transform hover:-translate-y-2 hover:shadow-xl'
          data-aos="zoom-in"
        >
          <FaHome className='text-3xl text-slate-800 mx-auto mb-4' />
          <h2 className='text-xl font-semibold mb-2 text-slate-800'>Verified Listings</h2>
          <p className='text-slate-600'>All properties are verified to ensure you never face scams or fake listings.</p>
        </div>

        <div
          className='bg-slate-100 p-6 rounded-lg shadow transition-transform transform hover:-translate-y-2 hover:shadow-xl'
          data-aos="zoom-in"
          data-aos-delay="100"
        >
          <FaUsers className='text-3xl text-slate-800 mx-auto mb-4' />
          <h2 className='text-xl font-semibold mb-2 text-slate-800'>User Friendly</h2>
          <p className='text-slate-600'>Our interface makes searching, filtering, and booking properties effortless.</p>
        </div>

        <div
          className='bg-slate-100 p-6 rounded-lg shadow transition-transform transform hover:-translate-y-2 hover:shadow-xl'
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          <FaMapMarkerAlt className='text-3xl text-slate-800 mx-auto mb-4' />
          <h2 className='text-xl font-semibold mb-2 text-slate-800'>Location Based</h2>
          <p className='text-slate-600'>Find homes and listings near your preferred location or university.</p>
        </div>
      </div>
    </div>
  );
}
