import React from 'react';
import { useParams } from 'react-router-dom';

export default function Listing() {
  const { listingId } = useParams();

  return (
    <div className="pt-20 px-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Listing ID</h1>
      <p className="text-lg">{listingId}</p>
    </div>
  );
}
