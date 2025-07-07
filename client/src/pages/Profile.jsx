import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // 👇 Trigger upload when file changes
  useEffect(() => {
    if (file) {
      setAvatar(URL.createObjectURL(file)); // preview
      handleImageUpload(file); // actual upload
    }
  }, [file]);

  // 👇 Upload image to backend
  const handleImageUpload = async (selectedFile) => {
    const formData = new FormData();
    formData.append('image', selectedFile); // backend must accept 'image'

    try {
      setUploading(true);
      setUploadSuccess(false);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || 'Upload failed');

      const data = JSON.parse(text);
      const imageUrl = data.imageUrl;
      console.log('Uploaded image URL:', imageUrl);

      // Update avatar locally
      setAvatar(imageUrl);
      dispatch(signInSuccess({ ...currentUser, avatar: imageUrl }));

      // Update avatar in DB
      await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar: imageUrl }),
      });

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Upload failed:', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto relative'>
      <h1 className='text-3xl font-semibold text-center my-7 text-blue-800'>Profile</h1>

      <form className='flex flex-col gap-4'>
        {/* Hidden file input */}
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* Profile Image Preview */}
        <img
          onClick={() => fileRef.current.click()}
          src={avatar || '/default-avatar.png'}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />

        {/* Upload Messages */}
        {uploading && (
          <p className='text-blue-500 text-center font-semibold'>Image Uploading...</p>
        )}
        {uploadSuccess && (
          <p className='text-green-600 text-center font-semibold'>Image Uploaded Successfully!</p>
        )}

        {/* Form Inputs */}
        <input
          type='text'
          placeholder='username'
          id='username'
          className='border p-3 rounded-lg'
          defaultValue={currentUser.username}
        />
        <input
          type='email'
          placeholder='email'
          id='email'
          className='border p-3 rounded-lg'
          defaultValue={currentUser.email}
        />
        <input
          type='text'
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg'
        />

        <button className='bg-blue-800 text-white rounded-lg p-3 uppercase hover:opacity-85 disabled:opacity-70'>
          Update
        </button>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
}
