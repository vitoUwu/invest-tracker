<script lang="ts" setup>
import type { Investment, InvestmentRegistry } from "~/types";

const { data, status } = await useAsyncData<
  (Investment & { registries: InvestmentRegistry[] })[]
>("investments", () => $fetch("/api/investments"), {
  default: () => [],
  server: false,
});

const isLoading = computed(() =>
  process.server ? true : status.value === "pending"
);

const totalInvested = computed(() => {
  return (
    data.value.reduce(
      (acc, curr) => acc + curr?.registries?.reduce((a, c) => a + c?.amount, 0),
      0
    ) / 100
  );
});

const totalReturn = computed(() => {
  return (
    data.value.reduce(
      (acc, curr) =>
        acc +
        curr?.registries
          ?.filter((r) => r.type === "income")
          .reduce((a, c) => a + c?.amount, 0),
      0
    ) / 100
  );
});

const totalReturnPercentage = computed(() => {
  return (totalReturn.value / totalInvested.value) * 100 > 0
    ? (totalReturn.value / totalInvested.value) * 100
    : 0;
});
</script>

<template>
  <div class="flex flex-col p-3">
    <main class="flex flex-1 flex-col gap-4 p-3">
      <div class="flex items-center gap-4">
        <h1 class="font-semibold text-lg md:text-xl">Início</h1>
      </div>
      <div class="grid gap-6">
        <div class="grid md:grid-cols-3 gap-6">
          <UCard>
            <template #header>
              <div class="flex flex-col space-y-1.5">
                <p class="text-sm text-zinc-400">Valor Total Investido</p>
                <USkeleton v-if="isLoading" class="h-7 w-full" />
                <h3
                  v-else
                  class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
                >
                  {{ formatCurrency(totalInvested) }}
                </h3>
              </div>
            </template>
            <USkeleton class="h-48 w-full" />
          </UCard>
          <UCard>
            <template #header>
              <div class="flex flex-col space-y-1.5">
                <p class="text-sm text-zinc-400">Retorno Total</p>
                <USkeleton v-if="isLoading" class="h-7 w-full" />
                <h3
                  v-else
                  class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
                >
                  {{ formatCurrency(totalReturn) }}
                </h3>
              </div>
            </template>
            <USkeleton class="h-48 w-full" />
          </UCard>
          <UCard>
            <template #header>
              <div class="flex flex-col space-y-1.5">
                <p class="text-sm text-zinc-400">Retorno Percentual</p>
                <USkeleton v-if="isLoading" class="h-7 w-full" />
                <h3
                  v-else
                  class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
                >
                  {{ totalReturnPercentage.toFixed(2) }}%
                </h3>
              </div>
            </template>
            <USkeleton class="h-48 w-full" />
          </UCard>
        </div>
      </div>
    </main>
  </div>
</template>
