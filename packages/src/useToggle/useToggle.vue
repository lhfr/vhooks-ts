<template>
  <div>
    <p>
      Value is <code>{{ value.toString() }}</code>
    </p>
    <button @click="setValue(true)">set true</button>
    <button @click="setValue(false)">set false</button>
    <button @click="toggle">toggle</button>
    <button @click="customToggle">custom toggle</button>
  </div>
</template>

<script setup lang="ts">
import { useToggle } from "vhooks-ts";

const [value, toggle, setValue] = useToggle();

const customToggle = () => {
  setValue((x: boolean) => !x);
};
</script>
