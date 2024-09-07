<script lang="ts" setup>
import type { InvestmentWithRegistry } from "~/types";

defineEmits<{
  (e: "close"): void;
  (e: "create", data: InvestmentWithRegistry): void;
}>();
</script>

<template>
  <UModal :transition="true">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-lg font-medium">Novo Investimento</h1>
          <UButton
            icon="i-heroicons-x-mark-16-solid"
            variant="ghost"
            @click="$emit('close')"
            color="red"
          />
        </div>
      </template>
      <FormsNewInvestment @create="$emit('create', $event)" />
    </UCard>
  </UModal>
</template>
