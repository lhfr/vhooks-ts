<template>
  <div>
    <p>Debounced value: {{ debouncedValue }}</p>

    <input
      type="text"
      v-model="defaultValue"
      @input="(event) => setValue(event.target.value)"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { useDebounceValue } from "vhooks-ts";

const props = defineProps({
  defaultValue: {
    type: String,
    default: "John",
  },
});
const defaultValue = props.defaultValue;

const [debouncedValue, setValue] = useDebounceValue(defaultValue, 500);
</script>
