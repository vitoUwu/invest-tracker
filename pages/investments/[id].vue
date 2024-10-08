<script lang="ts" setup>
import type { InvestmentRegistry, InvestmentWithRegistry } from "~/types";
const toast = useToast();

definePageMeta({
  path: "/investimentos/:id",
});

const { params } = useRoute();
const investmentId = params.id as string;

const { data: _data, status } = await useLazyAsyncData<InvestmentWithRegistry>(
  investmentId,
  async () => $fetch(`/api/investments/${investmentId}`, { method: "GET" }),
  {
    default: () =>
      ({
        _id: "",
        name: "",
        registries: [],
      } as unknown as InvestmentWithRegistry),
    server: false,
  }
);

const data = ref(_data);

const isLoading = computed(() =>
  import.meta.server ? true : status.value === "pending"
);

const total = computed(() => {
  return (
    data.value.registries.reduce((acc, curr) => acc + curr.amount, 0) / 100
  );
});

const returnAmount = computed(() => {
  return (
    data.value.registries
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
  const unrefData = unref(data.value);
  unrefData.registries.push(registry);
  data.value = unrefData;

  toast.add({
    title: "Novo registro adicionado",
    id: registry._id as unknown as string,
    icon: "i-heroicons-check-16-solid",
  });
}

function handleRemove(ids: string[]) {
  const unrefData = unref(data.value);
  unrefData.registries = unrefData.registries.filter(
    (item) => !ids.includes(item._id as unknown as string)
  );
  data.value = unrefData;
}
</script>

<template>
  <main
    v-if="isLoading || !!data.name"
    class="flex flex-col p-3 gap-3 max-w-[100vw]"
  >
    <UButton
      label="Voltar"
      icon="i-heroicons-arrow-left-16-solid"
      to="/investimentos"
      variant="ghost"
      color="white"
      class="w-fit"
    />
    <USkeleton v-if="isLoading" class="h-6 w-full" />
    <UBreadcrumb
      v-else
      :links="[
        {
          label: 'Investimentos',
          to: '/investimentos',
        },
        {
          label: data.name,
        },
      ]"
    />
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
    <div class="flex lg:grid lg:grid-cols-3 gap-6">
      <CardsInvestmentRegistries
        :key="`${status}-${data.registries.length}-${total}`"
        :data="data.registries"
        :isLoading="isLoading"
        :investmentId="investmentId"
        :investmentTotal="total"
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
          :key="`${investmentId}-${total}`"
          :investmentTotal="total"
          :investmentId="investmentId"
          @create="handleCreate"
        />
      </UCard>
    </div>
  </main>
  <main v-else class="flex flex-col p-3 gap-3 max-w-[100vw] text-center">
    <h2 class="text-3xl font-semibold">Investimento não encontrado</h2>
    <UButton
      @click="navigateTo('/investimentos')"
      color="gray"
      class="w-fit mx-auto"
      icon="i-heroicons-arrow-left-16-solid"
    >
      Voltar
    </UButton>
  </main>
</template>
