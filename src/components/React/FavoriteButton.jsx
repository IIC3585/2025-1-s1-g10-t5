import { useState, useEffect } from "react";

export default function FavoriteButton({ songId }) {
  const [isFav, setIsFav] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFav(favs.includes(songId));
  }, [songId]);

  function showNotification(message) {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  function toggleFav() {
    setIsAnimating(true);

    let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const wasFav = favs.includes(songId);

    if (wasFav) {
      favs = favs.filter((id) => id !== songId);
      showNotification("Removido de favoritos ❤️");
    } else {
      favs.push(songId);
      showNotification("Agregado a favoritos 💖");
    }

    localStorage.setItem("favorites", JSON.stringify(favs));
    setIsFav(!wasFav);

    setTimeout(() => setIsAnimating(false), 300);
  }

  return (
    <div className="favorite-container">
      <button
        onClick={toggleFav}
        className={`favorite-button ${isFav ? "favorited" : ""} ${
          isAnimating ? "animating" : ""
        }`}
        aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <div className="heart-container">
          <div className={`heart ${isFav ? "filled" : ""}`}>
            {isFav ? "💖" : "🤍"}
          </div>
          <div className="heart-bg"></div>
        </div>
        <span className="button-text">
          {isFav ? "En favoritos" : "Agregar a favoritos"}
        </span>
      </button>

      {showToast && <div className="toast-notification">{toastMessage}</div>}
    </div>
  );
}
