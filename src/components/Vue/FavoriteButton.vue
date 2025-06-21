<template>
  <div class="favorite-container">
    <button
      @click="toggleFav"
      :class="['favorite-button', { favorited: isFav, animating: isAnimating }]"
      :aria-label="isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'"
    >
      <div class="heart-container">
        <div :class="['heart', { filled: isFav }]">
          {{ isFav ? "💖" : "🤍" }}
        </div>
        <div class="heart-bg"></div>
      </div>
      <span class="button-text">
        {{ isFav ? "En favoritos" : "Agregar a favoritos" }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  songId: String,
});

const isFav = ref(false);
const isAnimating = ref(false);

const checkFavoriteStatus = () => {
  const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  isFav.value = favs.includes(props.songId);
};

onMounted(() => {
  checkFavoriteStatus();
  window.addEventListener("storage", checkFavoriteStatus);
  window.addEventListener("favoritesUpdated", checkFavoriteStatus);
});

function toggleFav() {
  isAnimating.value = true;

  let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  const wasFav = favs.includes(props.songId);

  if (wasFav) {
    favs = favs.filter((id) => id !== props.songId);
  } else {
    favs.push(props.songId);
  }

  localStorage.setItem("favorites", JSON.stringify(favs));
  isFav.value = !wasFav;

  // Dispatch a custom event so other components (like the favorites list) can update
  window.dispatchEvent(new CustomEvent("favoritesUpdated"));

  setTimeout(() => {
    isAnimating.value = false;
  }, 300);
}
</script>
