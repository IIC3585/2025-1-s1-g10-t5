<template>
  <div class="favorites-section">
    <h2 class="section-title">💖 Mis Favoritos ({{ favoriteSongs.length }})</h2>

    <div v-if="isLoading" class="loading-favorites">Cargando favoritos...</div>

    <div v-else-if="favoriteSongs.length === 0" class="empty-favorites">
      <p>Aún no has agregado ninguna canción a tus favoritos.</p>
      <p>¡Haz clic en el corazón de una canción para guardarla!</p>
    </div>

    <div v-else class="favorites-grid">
      <div
        v-for="song in favoriteSongs"
        :key="song.data.id"
        class="favorite-item"
      >
        <a :href="`/cancion/${song.slug}`" class="favorite-link">
          <img
            :src="song.data.image"
            :alt="song.data.name"
            class="favorite-image"
          />
          <p class="favorite-name">{{ song.data.name }}</p>
        </a>
        <button
          @click="removeFavorite(song.data.id)"
          class="remove-favorite-btn"
          aria-label="Remover de favoritos"
        >
          ❌
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  allSongs: Array,
});

const favoriteSongs = ref([]);
const isLoading = ref(true);

const loadFavorites = () => {
  try {
    const favIds = JSON.parse(localStorage.getItem("favorites") || "[]");
    favoriteSongs.value = favIds
      .map((id) => props.allSongs.find((song) => song.data.id === id))
      .filter(Boolean);
  } catch (error) {
    console.error("Error loading favorites:", error);
    favoriteSongs.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadFavorites();
  window.addEventListener("storage", loadFavorites);
  window.addEventListener("favoritesUpdated", loadFavorites);
});

const removeFavorite = (songId) => {
  const updatedFavoriteSongs = favoriteSongs.value.filter(
    (song) => song.data.id !== songId
  );
  const updatedFavIds = updatedFavoriteSongs.map((song) => song.data.id);

  localStorage.setItem("favorites", JSON.stringify(updatedFavIds));
  favoriteSongs.value = updatedFavoriteSongs;

  window.dispatchEvent(new CustomEvent("favoritesUpdated"));
};
</script>
