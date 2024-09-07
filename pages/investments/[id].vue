<script lang="ts" setup>
import type { BreadcrumbLink } from "#ui/types/breadcrumb";
import type { InvestmentRegistry } from "~/types";
const toast = useToast();

definePageMeta({
  path: "/investimentos/:id",
});

const { params } = useRoute();
const investmentId = params.id as string;

const breadcrumb: BreadcrumbLink[] = [
  {
    label: "Investimentos",
    to: "/investimentos",
  },
  {
    label: "Fundo de Investimento ABC",
  },
];

const { data: _data, status } = await useLazyAsyncData<InvestmentRegistry[]>(
  "investiments",
  // @ts-ignore - TODO: fix this
  () => $fetch(`/api/investments/${investmentId}/registry`, { method: "GET" }),
  {
    default: () => [],
  }
);

const data = ref(_data);

const isLoading = computed(() => {
  return status.value === "pending";
});

const total = computed(() => {
  return data.value.reduce((acc, curr) => acc + curr.amount, 0) / 100;
});

const returnAmount = computed(() => {
  return (
    data.value
      .filter((item) => item.type === "income")
      .reduce((acc, curr) => {
        return acc + curr.amount;
      }, 0) / 100
  );
});

const returnPercentage = computed(() => {
  return (returnAmount.value / total.value) * 100 > 0
    ? (returnAmount.value / total.value) * 100
    : 0;
});

function handleCreate(registry: InvestmentRegistry) {
  data.value.push(registry);
  toast.add({
    title: "Novo registro adicionado",
    id: registry._id as unknown as string,
    icon: "i-heroicons-check-16-solid",
  });
}

function handleRemove(ids: string[]) {
  const unrefData = unref(data.value);
  data.value = unrefData.filter(
    (item) => !ids.includes(item._id as unknown as string)
  );
}
</script>

<template>
  <main class="flex flex-col p-3 gap-3">
    <UButton
      label="Voltar"
      icon="i-heroicons-arrow-left-16-solid"
      to="/investimentos"
      variant="ghost"
      color="white"
      class="w-fit"
    />
    <UBreadcrumb :links="breadcrumb" />
    <div class="grid md:grid-cols-3 gap-6">
      <UCard>
        <template #header>
          <div class="flex flex-col space-y-1.5">
            <p class="text-sm text-zinc-400">Total Investido</p>
            <USkeleton v-if="isLoading" class="h-6 w-full" />
            <h3
              v-else
              class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
            >
              {{ formatCurrency(total) }}
            </h3>
          </div>
        </template>
        <USkeleton class="h-48 w-full" />
      </UCard>
      <UCard>
        <template #header>
          <div class="flex flex-col space-y-1.5">
            <p class="text-sm text-zinc-400">Retorno Total</p>
            <USkeleton v-if="isLoading" class="h-6 w-full" />
            <h3
              v-else
              class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
            >
              {{ formatCurrency(returnAmount) }}
            </h3>
          </div>
        </template>
        <USkeleton class="h-48 w-full" />
      </UCard>
      <UCard>
        <template #header>
          <div class="flex flex-col space-y-1.5">
            <p class="text-sm text-zinc-400">Retorno Percentual</p>
            <USkeleton v-if="isLoading" class="h-6 w-full" />
            <h3
              v-else
              class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
            >
              {{ returnPercentage.toFixed(2) }}%
            </h3>
          </div>
        </template>
        <USkeleton class="h-48 w-full" />
      </UCard>
    </div>
    <UDivider class="my-6" />
    <div class="grid lg:grid-cols-3 gap-6">
      <CardsInvestmentRegistries
        :key="`${status}-${data.length}`"
        :data="data"
        :isLoading="isLoading"
        :investmentId="investmentId"
        @create="handleCreate"
        @remove="handleRemove"
      />
      <UCard class="col-span-1 hidden lg:block">
        <template #header>
          <div class="flex justify-between items-center">
            <h1
              class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
            >
              Adicionar Registro
            </h1>
          </div>
        </template>
        <FormsNewInvestmentRegistry
          :investmentId="investmentId"
          @create="handleCreate"
        />
      </UCard>
    </div>
  </main>
</template>
