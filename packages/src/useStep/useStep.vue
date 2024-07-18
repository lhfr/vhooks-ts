<template>
  <div>
    <p>Current step is {{ currentStep }}</p>
    <p>Can go to previous step {{ canGoToPrevStep ? "yes" : "no" }}</p>
    <p>Can go to next step {{ canGoToNextStep ? "yes" : "no" }}</p>
    <button @click="goToNextStep">Go to next step</button>
    <button @click="goToPrevStep">Go to previous step</button>
    <button @click="reset">Reset</button>
    <button @click="setStep(3)">Set to step 3</button>
  </div>
</template>

<script setup lang="ts">
import { useStep } from "vhooks-ts";

const [currentStep, helpers] = useStep(5);

const {
  canGoToPrevStep,
  canGoToNextStep,
  goToNextStep,
  goToPrevStep,
  reset,
  setStep,
} = helpers;
</script>
