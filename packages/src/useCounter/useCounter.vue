<template>
  <div>
    <p>Count is {{ count }}</p>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
    <button @click="reset">Reset</button>
    <button @click="multiplyBy2">Multiply by 2</button>
  </div>
</template>

<script setup lang="ts">
import { useCounter } from "vhooks-ts";

const { count, setCount, increment, decrement, reset } = useCounter(0);

const multiplyBy2 = () => {
  setCount((x: number) => x * 2);
};
</script>
