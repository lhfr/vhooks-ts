<template>
  <div>
    <button @click="set">Add</button>
    <button @click="reset">Reset</button>
    <button @click="setAll">Set new data</button>
    <button @click="remove" :disabled="!map.has('hello')">
      Remove "hello"
    </button>

    <pre>
      Map (
      <div v-for="[key, value] of map.entries()" :key="key">
        <template>{{ `\n  ${key}: ${value}` }}</template>
      </template>
      <br />)
    </pre>
  </div>
</template>

<script setup lang="ts">
import { useMap } from "vhooks-ts";

const [map, actions] = useMap<string, string>([["key", "🆕"]]);

const set = () => {
  actions.set(String(Date.now()), "📦");
};
const setAll = () => {
  actions.setAll([
    ["hello", "👋"],
    ["data", "📦"],
  ]);
};
const reset = () => {
  actions.reset();
};
const remove = () => {
  actions.remove("hello");
};
</script>
