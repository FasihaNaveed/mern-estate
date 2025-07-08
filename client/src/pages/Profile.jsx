import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signInSuccess,
  signoutUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

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
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]); // added state for listings

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

    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...formData, avatar }),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      localStorage.setItem('currentUser', JSON.stringify(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
      localStorage.removeItem('currentUser');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  // NEW: Delete a single listing by its ID
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto relative">
      <h1 className="text-3xl font-semibold text-center my-7 text-black">Profile</h1>

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
          className="border p-3 rounded-lg text-black"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg text-black"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg text-black"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          type="submit"
          className="bg-gray-700 text-white rounded-lg p-3 uppercase hover:opacity-85 disabled:opacity-70"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>

        <Link
          className="text-white p-3 rounded-lg text-center bg-green-600 uppercase hover:opacity-85"
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-blue-700 cursor-pointer">Sign Out</span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-600 font-bold mt-5">{updateSuccess ? 'User updated successfully!' : ''}</p>

      <button onClick={handleShowListings} className="text-purple-800 w-full mt-4 text-xl font-semibold">
        Show Listings
      </button>
      <p className="text-red-700 mt-2">{showListingsError ? 'Error showing listings' : ''}</p>

      {/* Listing Cards with Delete & Edit */}
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-2xl text-center font-semibold">Your Listings</h2>
          {userListings.map((listing) => (
            <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing"
                  className="h-16 w-16 object-contain rounded-lg"
                />
              </Link>
              <Link to={`/listing/${listing._id}`} className="text-blue-700 font-semibold flex-1 hover:underline truncate">
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center gap-1">
                <button onClick={() => handleListingDelete(listing._id)} className="text-red-700 uppercase">
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-600 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
