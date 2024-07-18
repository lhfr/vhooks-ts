<template>
  <div>
    <Section
      v-for="(section, index) in sections"
      :key="index"
      :title="`${index + 1}`"
    />
  </div>
</template>

<script setup lang="tsx">
import { useIntersectionObserver } from "usehooks-ts";

const Section = (props: { title: string }) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  });

  console.log(`Render Section ${props.title}`, {
    isIntersecting,
  });

  return () => (
    <div
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        border: "1px dashed #000",
        fontSize: "2rem",
      }}
    >
      <div style={{ margin: "auto" }}>{props.title}</div>
    </div>
  );
};
</script>
