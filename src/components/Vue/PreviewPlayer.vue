<template>
  <div class="preview-player">
    <button
      @click="togglePlay"
      :disabled="!canPlay || isLoading"
      class="play-button"
      :class="{ playing: isPlaying, loading: isLoading }"
    >
      <div v-if="isLoading" class="loading-spinner"></div>
      <span v-else-if="isPlaying">⏸️ Pausar</span>
      <span v-else-if="canPlay">▶️ Reproducir</span>
      <span v-else>🚫 No disponible</span>
    </button>

    <div v-if="error" class="error-message">{{ error }}</div>

    <audio ref="audio" preload="none" @ended="onAudioEnded" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{ previewUrl: string | null }>();

const audio = ref<HTMLAudioElement | null>(null);
const isLoading = ref(false);
const canPlay = ref(false);
const isPlaying = ref(false);
const error = ref<string | null>(null);

let retryCount = 0;
const MAX_RETRIES = 3;

async function prepareAudio() {
  if (!audio.value || !props.previewUrl) return;
  isLoading.value = true;
  canPlay.value = false;
  error.value = null;

  try {
    const resp = await fetch(props.previewUrl);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const blob = await resp.blob();
    const blobUrl = URL.createObjectURL(blob);

    audio.value.src = blobUrl;
    await new Promise<void>((resolve, reject) => {
      const onCP = () => {
        resolve();
      };
      const onErr = () => {
        reject();
      };
      audio.value!.addEventListener('canplaythrough', onCP, { once: true });
      audio.value!.addEventListener('error', onErr, { once: true });
      audio.value!.load();
    });

    canPlay.value = true;
  } catch (e) {
    retryCount++;
    if (retryCount <= MAX_RETRIES) {
      setTimeout(prepareAudio, 500);
    } else {
      error.value = 'No se pudo cargar la vista previa.';
    }
  } finally {
    isLoading.value = false;
  }
}

function playAudio() {
  if (!audio.value) return;
  audio.value
    .play()
    .then(() => {
      isPlaying.value = true;
    })
    .catch(() => {
      error.value = 'Error al reproducir.';
    });
}

function pauseAudio() {
  audio.value?.pause();
  isPlaying.value = false;
}

function togglePlay() {
  if (isPlaying.value) return pauseAudio();
  if (canPlay.value) return playAudio();
}

function onAudioEnded() {
  isPlaying.value = false;
}

watch(
  () => props.previewUrl,
  () => {
    retryCount = 0;
    isPlaying.value = false;
    canPlay.value = false;
    error.value = null;
    if (audio.value) audio.value.src = '';
    if (props.previewUrl) prepareAudio();
  },
);

onMounted(() => {
  if (!props.previewUrl) {
    error.value = 'Preview no disponible.';
  } else {
    prepareAudio();
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
