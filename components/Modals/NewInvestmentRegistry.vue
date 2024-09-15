<script lang="ts" setup>
import type { InvestmentRegistry } from "~/types";

defineEmits<{
  (e: "close"): void;
  (e: "create", data: InvestmentRegistry): void;
}>();
defineProps<{
  investmentTotal: number;
  investmentId: string;
}>();
</script>

<template>
  <UModal :transition="true">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-lg font-medium">Novo Registro</h1>
          <UButton
            icon="i-heroicons-x-mark-16-solid"
            variant="ghost"
            @click="$emit('close')"
            color="red"
          />
        </div>
      </template>
      <FormsNewInvestmentRegistry
        :key="`${investmentId}-${investmentTotal}`"
        :investmentTotal="investmentTotal"
        :investmentId="investmentId"
        @create="$emit('create', $event)"
      />
    </UCard>
  </UModal>
</template>
