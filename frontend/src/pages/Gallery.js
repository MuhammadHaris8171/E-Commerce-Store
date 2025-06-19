import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [names, setNames] = useState([]);
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const [searchName, setSearchName] = useState('');
  const [searchTag, setSearchTag] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (query = {}) => {
    try {
      const params = new URLSearchParams(query).toString();
      const res = await axios.get(`${backend_url}/gallery${params ? `?${params}` : ''}`);
      const fetched = Array.isArray(res.data) ? res.data : []; // Ensure data is iterable
      setImages(fetched);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const validateFiles = (files) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    for (let file of files) {
      if (file.size > maxSize) {
        throw new Error(`File ${file.name} is too large. Maximum size is 5MB`);
      }
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File ${file.name} is not a supported image type`);
      }
    }
  };

  const handleFileChange = (e) => {
    try {
      const files = Array.from(e.target.files);
      validateFiles(files);
      setError(null);
      setSelectedFiles(files);
      setNames(Array(files.length).fill(''));
      setTags(Array(files.length).fill(''));
    } catch (err) {
      setError(err.message);
      e.target.value = null; // Reset input
    }
  };

  const handleNameChange = (index, value) => {
    const updatedNames = [...names];
    updatedNames[index] = value;
    setNames(updatedNames);
  };

  const handleTagChange = (index, value) => {
    const updatedTags = [...tags];
    updatedTags[index] = value;
    setTags(updatedTags);
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      setError(null);
      const formData = new FormData();
      
      selectedFiles.forEach((file) => formData.append('images', file));
      names.forEach((name) => formData.append('names', name));
      tags.forEach((tag) => formData.append('tags', tag));

      const response = await axios.post(`${backend_url}/gallery/upload`, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      const newImages = Array.isArray(response.data) ? response.data : [response.data]; // Fix: make sure it's iterable
      setImages((prev) => [...newImages, ...prev]);
      setSelectedFiles([]);
      setNames([]);
      setTags([]);
      setShowModal(false);

    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteImage = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (confirmDelete) {
      try {
        await axios.delete(`${backend_url}/gallery/${id}`);
        setImages((prev) => prev.filter((img) => img._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchImages({ name: searchName, tag: searchTag });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Image Gallery</h2>

        <form onSubmit={handleSearch} className="flex space-x-2">
          <input
            type="text"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="Search by tag"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button
            type="submit"
            className="bg-[#735dff] text-white px-3 py-1 rounded hover:bg-[#5b48d8]"
          >
            Search
          </button>
        </form>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#735dff] text-white px-4 py-2 rounded hover:bg-[#5b48d8]"
        >
          Add Images
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-2xl">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <h3 className="text-lg font-semibold mb-4">Upload Images</h3>
            <input type="file" multiple onChange={handleFileChange} className="mb-4" />

            {selectedFiles.map((file, idx) => (
              <div key={idx} className="mb-4 border p-2 rounded">
                <p className="font-medium">{file.name}</p>
                <input
                  type="text"
                  placeholder="Name"
                  value={names[idx] || ''}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  className="border w-full px-2 py-1 rounded mb-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Tag"
                  value={tags[idx] || ''}
                  onChange={(e) => handleTagChange(idx, e.target.value)}
                  className="border w-full px-2 py-1 rounded"
                />
              </div>
            ))}

            <div className="flex flex-wrap gap-2 mb-4">
              {selectedFiles.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  className="w-20 h-20 object-cover rounded border"
                  alt="preview"
                />
              ))}
            </div>

            {isUploading && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-center mt-2">Uploading: {uploadProgress}%</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className={`${
                  isUploading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                } text-white px-4 py-2 rounded`}
                disabled={isUploading || !selectedFiles.length || names.some((name) => !name.trim())}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img._id}
            className="relative group rounded overflow-hidden shadow hover:shadow-lg transition"
          >
            <img src={img.url} alt={img.name || 'uploaded'} className="w-full h-40 object-cover" />
            <div className="p-2 bg-white">
              <p className="font-semibold text-sm truncate">{img.name}</p>
              <p className="text-xs text-gray-500 truncate">{img.tag}</p>
            </div>
            <button
              onClick={() => handleDeleteImage(img._id)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs font-bold hidden group-hover:flex items-center justify-center"
              title="Delete"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
