<script lang="ts" setup>
import type { InvestmentWithRegistry } from "~/types";
const toast = useToast();

definePageMeta({
  path: "/investimentos",
});

const { data, status } = await useLazyAsyncData<InvestmentWithRegistry[]>(
  "investments",
  () => $fetch("/api/investments"),
  {
    default: () => [],
  }
);

const isLoading = computed(() =>
  process.server ? true : status.value === "pending"
);

function handleRemove(id: string) {
  $fetch(`/api/investments/${id}`, {
    method: "DELETE",
    onResponseError: () => {
      toast.add({
        title: "Ocorreu um erro ao remover o investimento",
        icon: "i-heroicons-exclamation-triangle-16-solid",
        color: "red",
      });
    },
    onRequestError: () => {
      toast.add({
        title: "Ocorreu um erro ao remover o investimento",
        icon: "i-heroicons-exclamation-triangle-16-solid",
        color: "red",
      });
    },
    onResponse: async ({ response }) => {
      if (response.ok) {
        toast.add({
          title: "Investimento removido",
          icon: "i-heroicons-check-16-solid",
          color: "green",
        });
        data.value = data.value.filter(
          (item) => (item._id as unknown as string) !== id
        );
        return;
      }

      toast.add({
        title: "Ocorreu um erro ao remover o investimento",
        icon: "i-heroicons-exclamation-triangle-16-solid",
        color: "red",
      });
    },
  });
}

function handleCreate(investment: InvestmentWithRegistry) {
  data.value.push(investment);
  toast.add({
    title: "Novo investimento adicionado",
    id: investment._id as unknown as string,
    icon: "i-heroicons-check-16-solid",
  });
  isModalOpen.value = false;
}

const isModalOpen = ref(false);
</script>

<template>
  <main class="flex flex-col p-3 gap-3">
    <UBreadcrumb
      :links="[
        {
          label: 'Investimentos',
          to: '/investimentos',
        },
      ]"
    />
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Seus Investimentos</h1>
        <p class="text-zinc-400 text-sm">
          Aqui você pode gerenciar todos os seus investimentos.
        </p>
      </div>
      <ModalsNewInvestment
        @create="handleCreate"
        @close="isModalOpen = false"
        v-model="isModalOpen"
      />
      <UButton
        icon="i-heroicons-plus"
        variant="ghost"
        color="gray"
        @click="isModalOpen = true"
      >
        Novo
      </UButton>
    </div>
    <ClientOnly>
      <template #fallback>
        <USkeleton class="h-48 w-full" />
      </template>
      <ul class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 flex-wrap">
        <li
          v-if="!data.length"
          class="flex w-full justify-center items-center col-span-full pt-10 cursor-pointer"
        >
          <CardsInvestmentsEmptyState @create="handleCreate" />
        </li>
        <li v-for="item in data" :key="item._id.toString()" class="contents">
          <button
            @click="navigateTo(`/investimentos/${item._id.toString()}`)"
            class="contents"
          >
            <UCard
              class="dark:hover:ring-emerald-500/50 transition-all dark:hover:bg-emerald-500/10 dark:hover:cursor-pointer text-start"
            >
              <template #header>
                <div class="flex justify-between items-center">
                  <div
                    class="bg-gradient-to-b from-zinc-100 to-zinc-300 bg-clip-text text-transparent"
                  >
                    <h2 class="text-2xl font-bold leading-none tracking-tight">
                      {{ item.name }}
                    </h2>
                  </div>
                  <UDropdown
                    @click.stop
                    :items="[
                      [
                        {
                          label: 'Remover',
                          icon: 'i-heroicons-trash-solid',
                          click: () => handleRemove(item._id.toString()),
                        },
                      ],
                    ]"
                  >
                    <UButton
                      icon="i-heroicons-ellipsis-vertical"
                      variant="ghost"
                      color="gray"
                    />
                  </UDropdown>
                </div>
              </template>
              <h3
                class="text-sm font-medium leading-none tracking-tight text-zinc-400"
              >
                Total Investido
              </h3>
              <USkeleton v-if="isLoading" class="h-6 w-full" />
              <p
                v-else
                class="whitespace-nowrap text-xl font-semibold leading-none tracking-tight"
              >
                {{
                  formatCurrency(
                    item.registries.reduce(
                      (acc, curr) => acc + curr.amount,
                      0
                    ) / 100
                  )
                }}
              </p>
            </UCard>
          </button>
        </li>
      </ul>
    </ClientOnly>
  </main>
</template>
