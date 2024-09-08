<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>

<template>
  <UContainer class="w-screen h-screen flex justify-center items-center">
    <UCard class="min-w-80">
      <template #header>
        <h1 class="text-2xl font-bold tracking-tight">Login</h1>
      </template>
      <FormsLogin />
    </UCard>
  </UContainer>
</template>
