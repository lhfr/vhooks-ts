<template>
  <div>
    <p>Count: {{ count }}</p>

    <input type="number" v-model="intervalValue" />
    <button @click="startCountdown">start</button>
    <button @click="stopCountdown">stop</button>
    <button @click="resetCountdown">reset</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCountdown } from "vhooks-ts";

const intervalValue = ref<number>(1000);
const [count, { startCountdown, stopCountdown, resetCountdown }] = useCountdown(
  {
    countStart: 60,
    intervalMs: intervalValue,
  }
);
</script>
