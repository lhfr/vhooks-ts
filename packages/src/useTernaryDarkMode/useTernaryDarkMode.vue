<template>
  <div>
    <p>Current theme: {{ isDarkMode ? "dark" : "light" }}</p>
    <p>ternaryMode: {{ ternaryDarkMode }}</p>
    <p>
      Toggle between three modes
      <button @click="toggleTernaryDarkMode">
        Toggle from {{ ternaryDarkMode }}
      </button>
    </p>
    <p>
      Select a mode
      <br />
      <select
        name="select-ternaryDarkMode"
        @change="(ev) => setTernaryDarkMode(ev.target.value)"
        :value="ternaryDarkMode"
      >
        <option value="light">light</option>
        <option value="system">system</option>
        <option value="dark">dark</option>
      </select>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useTernaryDarkMode } from "usehooks-ts";

const {
  isDarkMode,
  ternaryDarkMode,
  setTernaryDarkMode,
  toggleTernaryDarkMode,
} = useTernaryDarkMode();
</script>
