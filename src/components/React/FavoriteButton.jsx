import { useState, useEffect } from 'react';

export default function FavoriteButton({ songId }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFav(favs.includes(songId));
  }, [songId]);

  function toggleFav() {
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favs.includes(songId)) {
      favs = favs.filter((id) => id !== songId);
    } else {
      favs.push(songId);
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
    setIsFav(!isFav);
  }

  return (
    <button onClick={toggleFav}>
      {isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    </button>
  );
}
