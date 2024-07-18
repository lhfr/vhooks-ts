<template>
  <div>
    <p>
      {{
        visible
          ? "I'm visible for 5000ms"
          : "You can no longer see this content"
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTimeout } from "vhooks-ts";

const visible = ref(true);

const hide = () => {
  visible.value = false;
};

useTimeout(hide, 5000);
</script>
