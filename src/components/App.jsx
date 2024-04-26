import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Searchbar } from './SearchBar/SearchBar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';

const API_KEY = '42459291-7f50c47c6b19e5b61fce58d70';

export const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [noMoreResults, setNoMoreResults] = useState(false);
  // eslint-disable-next-line
  const [previousImages, setPreviousImages] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (query === '') return;

      setLoader(true);
      try {
        const response = await axios.get(
          `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
        );
        const newImages = response.data.hits;

        if (newImages.length === 0) {
          setNoMoreResults(true);
        } else {
          if (page === 1) {
            setImages(newImages);
          } else {
            setImages(prevImages => [...prevImages, ...newImages]);
          }
          setPreviousImages(prevImages => [...prevImages, ...newImages]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoader(false);
    };

    fetchPhotos();
  }, [query, page]);

  const handleSearch = searchQuery => {
    setQuery(searchQuery);
    setPage(1);
    setNoMoreResults(false);
  };

  const handleLoadMore = async () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleImageClick = e => {
    const largeImageUrl = e.target.getAttribute('data-large');
    setModalImageUrl(largeImageUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="app">
      <Searchbar handleSearch={handleSearch} />
      {loader ? (
        <Loader />
      ) : (
        <ImageGallery images={images} openModal={handleImageClick} />
      )}
      {images.length > 0 && !noMoreResults && (
        <Button onClick={handleLoadMore}>Load More</Button>
      )}
      {showModal && <Modal imageUrl={modalImageUrl} onClose={handleCloseModal} />}
      {noMoreResults && <p className="info-noMoreResults">No more results to display</p>}
    </div>
  );
};

export default App;
