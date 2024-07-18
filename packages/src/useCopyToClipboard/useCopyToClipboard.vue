<template>
  <div>
    <h1>Click to copy:</h1>
    <div style="display: flex">
      <button @click="handleCopy('A')">A</button>
      <button @click="handleCopy('B')">B</button>
      <button @click="handleCopy('C')">C</button>
    </div>
    <p>Copied value: {{ copiedText ?? "Nothing is copied yet!" }}</p>
  </div>
</template>

<script setup lang="ts">
import { useCopyToClipboard } from "vhooks-ts";

const [copiedText, copy] = useCopyToClipboard();

const handleCopy = (text: string) => () => {
  copy(text)
    .then(() => {
      console.log("Copied!", { text });
    })
    .catch((error) => {
      console.error("Failed to copy!", error);
    });
};
</script>
