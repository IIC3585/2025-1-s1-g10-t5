<template>
  <div>
    <button @click="togglePlay" :disabled="!canPlay">
      {{ isPlaying ? 'Pausar' : 'Reproducir' }}
    </button>
    <audio
      ref="audio"
      :src="previewUrl"
      @loadeddata="canPlay = true"
      @ended="isPlaying = false"
      @error="handleAudioError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  previewUrl: String,
});

const audio = ref(null);
const isPlaying = ref(false);
const canPlay = ref(false);

function togglePlay() {
  if (!audio.value || !canPlay.value) return;

  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play().catch((e) => {
      console.error('Error al reproducir:', e);
    });
  }

  isPlaying.value = !isPlaying.value;
}

function handleAudioError(e) {
  console.error('Error en el audio:', e);
}
</script>
