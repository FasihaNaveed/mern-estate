import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signInSuccess, signoutUserFailure, signoutUserStart, signoutUserSuccess } from '../redux/user/userSlice';
import { updateUserStart , updateUserSuccess, updateUserFailure} from '../redux/user/userSlice';

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (file) {
      handleImageUpload(file);
    }
  }, [file]);

  const handleImageUpload = async (selectedFile) => {
    const form = new FormData();
    form.append('image', selectedFile);

    try {
      setUploading(true);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Upload failed');

      setAvatar(data.imageUrl);
      dispatch(signInSuccess({ ...currentUser, avatar: data.imageUrl }));
      localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, avatar: data.imageUrl }));

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Upload failed:', error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());

    console.log('Sending request with data:', { ...formData, avatar });

    try {
const res = await fetch(`/api/user/update/${currentUser._id}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({ ...formData, avatar }),
});

      const data = await res.json();
      console.log('Update response:', data);

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      localStorage.setItem('currentUser', JSON.stringify(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('Update failed:', error);
      dispatch(updateUserFailure(error.message));
    }
  };

const handleDeleteUser = async()=>{
  try {
    dispatch(deleteUserStart());
     const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: 'DELETE',
     credentials: 'include',
    });

    const data = await res.json();
    if(data.success===false){
      dispatch(deleteUserFailure(err.message));
      return;
    }

    dispatch(deleteUserSuccess(data));
   
    localStorage.removeItem('currentUser');
  } catch (error) {
    dispatch(deleteUserFailure(error.message))
  }
}

const handleSignOut= async()=>{
try {
  dispatch(signoutUserStart());
  const res = await fetch(`/api/auth/signout`);
  const data = await res.json();
  if(data.success===false){
    dispatch(signoutUserFailure(data.message));
    return;
  }
  dispatch(signoutUserSuccess(data));
} catch (error) {
   dispatch(signoutUserFailure(data.message));
}
}

  return (
    <div className="p-3 max-w-lg mx-auto relative">
      <h1 className="text-3xl font-semibold text-center my-7 text-blue-800">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <img
          onClick={() => fileRef.current.click()}
          src={avatar || '/default-avatar.png'}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        {uploading && <p className="text-blue-500 text-center font-semibold">Image Uploading...</p>}
        {uploadSuccess && <p className="text-green-600 text-center font-semibold">Image Uploaded Successfully!</p>}

        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          type="submit"
          className="bg-blue-800 text-white rounded-lg p-3 uppercase hover:opacity-85 disabled:opacity-70"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className='text-blue-700 cursor-pointer'>Sign Out</span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-600 font-bold mt-5">
        {updateSuccess ? 'User updated successfully!' : ''}
      </p>
    </div>
  );
}
