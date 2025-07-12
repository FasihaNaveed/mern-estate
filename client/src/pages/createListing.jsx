import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [err, setErr] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    imageUrls: [],
  });

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", "real_estate_unsigned");

      fetch("https://api.cloudinary.com/v1_1/dsdsanj9d/image/upload", {
        method: "POST",
        body: form,
      })
        .then((res) => res.json())
        .then((data) => resolve(data.secure_url))
        .catch((err) => reject(err));
    });
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (files.length < 1 || files.length > 6) {
      setError("Please upload between 1 and 6 images.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const urls = await Promise.all(files.map(storeImage));
      setImageUrls(urls);
      setFormData((prev) => ({ ...prev, imageUrls: urls }));
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Image upload failed. Try again.");
    }

    setUploading(false);
  };

  const handleRemoveImage = (index) => {
    const updated = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updated);
    setFormData((prev) => ({ ...prev, imageUrls: updated }));
  };

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData((prev) => ({ ...prev, type: id }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setErr("You must upload at least one image.");
      if (+formData.regularPrice < +formData.discountPrice)
        return setErr("Discount price must be lower than regular price.");

      setLoading(true);
      setErr(false);

      const res = await fetch(`${API_BASE_URL}/api/listing/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify(formData), // ✅ userRef removed, handled in backend
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        return setErr(data.message || "Something went wrong!");
      }

      if (!data._id) {
        return setErr("Listing creation failed. No ID returned.");
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setErr(error.message || "Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center text-black my-7">
        Create Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* Left section */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg text-black"
            id="name"
            required
            minLength={10}
            maxLength={62}
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg text-black"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg text-black"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex gap-6 flex-wrap">
            {["sale", "rent"].map((type) => (
              <div className="flex gap-2" key={type}>
                <input
                  type="checkbox"
                  id={type}
                  checked={formData.type === type}
                  onChange={handleChange}
                />
                <span>{type}</span>
              </div>
            ))}
            {["parking", "furnished", "offer"].map((item) => (
              <div className="flex gap-2" key={item}>
                <input
                  type="checkbox"
                  id={item}
                  checked={formData[item]}
                  onChange={handleChange}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                className="p-3 border-gray-300 rounded-lg text-black"
                required
                min="1"
                max="10"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                className="p-3 border-gray-300 rounded-lg text-black"
                required
                min="1"
                max="10"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                className="p-3 border-gray-300 rounded-lg text-black"
                required
                min="50"
                max="1000000"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <span>Regular ($ / month)</span>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold text-black">
            Images:
            <span className="text-gray-700 ml-2">(Max: 6, first is cover)</span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 border rounded text-green-600 border-green-600 hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {imageUrls.length > 0 && (
            <div className="flex flex-col gap-4">
              {imageUrls.map((url, i) => (
                <div
                  key={i}
                  className="flex justify-between p-3 border items-center rounded"
                >
                  <img
                    src={url}
                    alt="listing"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="text-red-700 uppercase text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            disabled={uploading || loading}
            className="p-3 bg-gray-700 text-white rounded-lg uppercase hover:opacity-85 disabled:opacity-70"
            type="submit"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {err && <p className="text-red-700 text-sm">{err}</p>}
        </div>
      </form>
    </main>
  );
}
