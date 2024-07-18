<template>
  <button
    ref="buttonRef"
    @click="handleClickInside"
    style="width: 200px; height: 200px; background: cyan"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useOnClickOutside } from "vhooks-ts";

const buttonRef = ref<HTMLButtonElement>(null);

const handleClickOutside = () => {
  // Your custom logic here
  console.log("clicked outside");
};

const handleClickInside = () => {
  // Your custom logic here
  console.log("clicked inside");
};

useOnClickOutside(buttonRef, handleClickOutside);
</script>
