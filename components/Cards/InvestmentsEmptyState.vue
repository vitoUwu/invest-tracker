<script lang="ts" setup>
import type { InvestmentWithRegistry } from "~/types";

const isModalOpen = ref(false);
const emit = defineEmits<{
  (e: "create", data: InvestmentWithRegistry): void;
  (e: "remove", ids: string[]): void;
}>();
defineShortcuts({
  escape: {
    usingInput: true,
    whenever: [isModalOpen],
    handler: () => {
      isModalOpen.value = false;
    },
  },
});

function handleCreate(data: InvestmentWithRegistry) {
  isModalOpen.value = false;
  emit("create", data);
}
</script>

<template>
  <UButton variant="ghost" color="white" @click="isModalOpen = true">
    <UCard>
      <div
        class="flex items-center justify-center h-48 border-2 border-dashed border-muted rounded-md p-6 border-zinc-700"
      >
        <div class="text-center">
          <UIcon
            name="i-heroicons-cube-transparent"
            :size="48"
            class="text-zinc-400"
          />
          <h3 class="text-lg font-medium mt-2">
            Sua lista de investimentos está vazia
          </h3>
          <p class="text-sm text-zinc-400">
            Adicione seu primeiro investimento
          </p>
        </div>
      </div>
    </UCard>
  </UButton>
  <ModalsNewInvestment
    @close="isModalOpen = false"
    @create="handleCreate"
    v-model="isModalOpen"
  />
</template>
