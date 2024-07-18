<template>
  <div>
    <p>{{ `Current status: ${status}` }}</p>

    <template v-if="status === 'ready'">
      <p>You can use the script here.</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from "vue";
import { useScript } from "vhooks-ts";

// it's an example, use your types instead
declare const jQuery: any;

// Load the script asynchronously
const status = useScript(`https://code.jquery.com/jquery-3.5.1.min.js`, {
  removeOnUnmount: false,
  id: "jquery",
});

watchEffect(() => {
  if (typeof jQuery !== "undefined") {
    // jQuery is loaded => print the version
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    alert(jQuery.fn.jquery);
  }
});
</script>
