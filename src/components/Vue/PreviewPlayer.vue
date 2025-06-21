<template>
  <div class="preview-player">
    <button
      @click="togglePlay"
      class="play-button"
      :class="{
        playing: isPlaying,
        loading: isLoading,
        disabled: !canPlay && !isLoading,
      }"
    >
      <div v-if="isLoading" class="loading-spinner"></div>
      <span v-else-if="isPlaying" class="icon">⏸️</span>
      <span v-else-if="canPlay" class="icon">▶️</span>
      <span v-else class="icon">🚫</span>

      <span class="button-text">
        {{ getButtonText() }}
      </span>
    </button>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <audio
      ref="audio"
      :src="previewUrl"
      @canplay="onCanPlay"
      @ended="onAudioEnded"
      @error="handleAudioError"
      @loadstart="onLoadStart"
      preload="metadata"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  previewUrl: String,
});

const audio = ref(null);
const isPlaying = ref(false);
const canPlay = ref(false);
const isLoading = ref(false);
const error = ref("");
const playWhenReady = ref(false);

function getButtonText() {
  if (isLoading.value) return "Cargando...";
  if (isPlaying.value) return "Pausar";
  if (canPlay.value) return "Reproducir";
  return "No disponible";
}

function onLoadStart() {
  isLoading.value = true;
  error.value = "";
  canPlay.value = false;
  isPlaying.value = false;
  playWhenReady.value = false;
}

function onCanPlay() {
  isLoading.value = false;
  canPlay.value = true;
  if (playWhenReady.value) {
    playAudio();
  }
}

function onAudioEnded() {
  isPlaying.value = false;
  playWhenReady.value = false;
}

function playAudio() {
  if (!audio.value || !canPlay.value) return;
  audio.value.play().catch((e) => {
    console.error("Error al reproducir:", e);
    error.value = "Error al reproducir el audio";
    isPlaying.value = false;
  });
  isPlaying.value = true;
  playWhenReady.value = false;
}

function pauseAudio() {
  if (!audio.value) return;
  audio.value.pause();
  isPlaying.value = false;
  playWhenReady.value = false;
}

function togglePlay() {
  if (isPlaying.value) {
    pauseAudio();
    return;
  }

  if (isLoading.value) {
    playWhenReady.value = true;
    return;
  }

  if (canPlay.value) {
    playAudio();
  }
}

function handleAudioError(e) {
  console.error("Error en el audio:", e);
  isLoading.value = false;
  canPlay.value = false;
  playWhenReady.value = false;
  error.value = "Preview no disponible.";
}

onMounted(() => {
  if (!props.previewUrl) {
    isLoading.value = false;
    canPlay.value = false;
    error.value = "Preview no disponible.";
  }
});
</script>

<style scoped>
.preview-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.play-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  justify-content: center;
}

.play-button:not(.disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.play-button.playing {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.play-button.loading {
  background: #f0f0f0;
  color: #666;
  cursor: wait;
}

.play-button:not(.playing):not(.disabled):not(.loading) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.play-button.disabled {
  background: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.icon {
  font-size: 1.2rem;
  line-height: 1;
}

.button-text {
  font-size: 0.9rem;
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  text-align: center;
  background: #fdf2f2;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
}
</style>
