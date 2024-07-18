<template>
  <div>
    <h1>{{ count }}</h1>
    <button @click="isPlaying = !isPlaying">
      {{ isPlaying ? "pause" : "play" }}
    </button>
    <p>
      <label htmlFor="delay">Delay: </label>
      <input type="number" name="deplay" v-model="delay" />
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useInterval } from "vhooks-ts";

// The counter
const count = ref<number>(0);
// Dynamic delay
const delay = ref<number>(1000);
// ON/OFF
const isPlaying = ref<boolean>(false);

useInterval(
  () => {
    // Your custom logic here
    count.value++;
  },
  // Delay in milliseconds or null to stop it
  computed(() => (isPlaying.value ? delay.value : null))
);
</script>
