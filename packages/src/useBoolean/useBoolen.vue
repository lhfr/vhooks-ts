<template>
  <div>
    <p>
      Value is <code>{{ value.toString() }}</code>
    </p>
    <button @click="setTrue">set true</button>
    <button @click="setFalse">set false</button>
    <button @click="toggle">toggle</button>
    <button @click="customToggle">custom toggle</button>
  </div>
</template>

<script setup lang="ts">
import { useBoolean } from "vhooks-ts";

const { value, setValue, setTrue, setFalse, toggle } = useBoolean(false);

// Just an example to use "setValue"
const customToggle = () => {
  setValue((x: boolean) => !x);
};
</script>
