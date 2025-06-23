import { useState, useEffect } from "react";

export default function FavoritesSection({ allSongs }) {
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const favIds = JSON.parse(localStorage.getItem("favorites") || "[]");
        const favSongs = favIds
          .map((id) => allSongs.find((song) => song.data.id === id))
          .filter(Boolean);

        setFavoriteSongs(favSongs);
      } catch (error) {
        console.error("Error loading favorites:", error);
        setFavoriteSongs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();

    const handleStorageChange = () => loadFavorites();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("favoritesUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("favoritesUpdated", handleStorageChange);
    };
  }, [allSongs]);

  const removeFavorite = (songId) => {
    const updatedFavoriteSongs = favoriteSongs.filter(
      (song) => song.data.id !== songId
    );
    const updatedFavIds = updatedFavoriteSongs.map((song) => song.data.id);

    localStorage.setItem("favorites", JSON.stringify(updatedFavIds));
    setFavoriteSongs(updatedFavoriteSongs);

    window.dispatchEvent(new CustomEvent("favoritesUpdated"));
  };

  if (isLoading) {
    return (
      <div className="favorites-section">
        <h2 className="section-title">💖 Mis Favoritos</h2>
        <div className="loading-favorites">Cargando favoritos...</div>
      </div>
    );
  }

  if (favoriteSongs.length === 0) {
    return (
      <div className="favorites-section">
        <h2 className="section-title">💖 Mis Favoritos</h2>
        <div className="empty-favorites">
          <p>Aún no has agregado ninguna canción a tus favoritos.</p>
          <p>¡Haz clic en el corazón de una canción para guardarla!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-section">
      <h2 className="section-title">
        💖 Mis Favoritos ({favoriteSongs.length})
      </h2>
      <div className="favorites-grid">
        {favoriteSongs.map((song) => (
          <div key={song.data.id} className="favorite-item">
            <a href={`/cancion/${song.slug}`} className="favorite-link">
              <img
                src={song.data.image}
                alt={song.data.name}
                className="favorite-image"
              />
              <p className="favorite-name">{song.data.name}</p>
            </a>
            <button
              onClick={() => removeFavorite(song.data.id)}
              className="remove-favorite-btn"
              aria-label="Remover de favoritos"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
