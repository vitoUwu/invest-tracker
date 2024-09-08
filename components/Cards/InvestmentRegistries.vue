<script lang="ts" setup>
import type { InvestmentRegistry } from "~/types";
const toast = useToast();

const { data, isLoading, investmentId } = defineProps<{
  data: InvestmentRegistry[];
  isLoading: boolean;
  investmentId: string;
}>();

const isModalOpen = ref(false);
const emit = defineEmits<{
  (e: "create", data: InvestmentRegistry): void;
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

const columns = [
  {
    key: "_id",
    rowClass: "hidden",
    class: "hidden",
  },
  {
    key: "amount",
    label: "Valor",
  },
  {
    key: "type",
    label: "Tipo",
  },
  {
    key: "createdAt",
    label: "Data",
    sortable: true,
  },
  {
    key: "actions",
  },
];

const selectedRows = ref<InvestmentRegistry[]>([]);
function selectRow(row: InvestmentRegistry) {
  const index = selectedRows.value.findIndex((item) => item._id === row._id);
  if (index === -1) {
    selectedRows.value.push(row);
  } else {
    selectedRows.value.splice(index, 1);
  }
}

function handleCreate(data: InvestmentRegistry) {
  isModalOpen.value = false;
  emit("create", data);
}

function handleRemove() {
  $fetch(`/api/investments/${investmentId}/registry`, {
    method: "DELETE",
    body: JSON.stringify({ ids: selectedRows.value.map((item) => item._id) }),
    onResponseError: () => {
      toast.add({
        title: "Ocorreu um erro ao remover registros",
        icon: "i-heroicons-exclamation-triangle-16-solid",
        color: "red",
      });
    },
    onRequestError: () => {
      toast.add({
        title: "Ocorreu um erro ao remover registros",
        icon: "i-heroicons-exclamation-triangle-16-solid",
        color: "red",
      });
    },
    onResponse: async ({ response }) => {
      if (response.ok) {
        emit(
          "remove",
          unref(selectedRows).map((item) => item._id as unknown as string)
        );
        selectedRows.value = [];
        toast.add({
          title: "Registros removidos",
          icon: "i-heroicons-check-16-solid",
          color: "green",
        });
        return;
      }

      toast.add({
        title: "Ocorreu um erro ao remover registros",
        icon: "i-heroicons-exclamation-triangle-16-solid",
        color: "red",
      });
    },
  });
}
</script>

<template>
  <ModalsNewInvestmentRegistry
    @close="isModalOpen = false"
    @create="handleCreate"
    v-model="isModalOpen"
    :investment-id="investmentId"
  />
  <UCard class="lg:col-span-2 w-full">
    <template #header>
      <div class="flex justify-between items-center flex-wrap gap-3">
        <h1
          class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
        >
          Registros
        </h1>
        <UButton
          class="lg:hidden"
          icon="i-heroicons-plus"
          label="Novo"
          @click="isModalOpen = true"
        />
      </div>
    </template>
    <div class="flex gap-1.5 items-center justify-end">
      <UButton
        :class="{ 'invisible opacity-0': selectedRows.length === 0 }"
        class="transition-all"
        icon="i-heroicons-trash-solid"
        color="emerald"
        size="xs"
        @click="handleRemove"
      >
        Remover {{ selectedRows.length }} registro(s)
      </UButton>
    </div>
    <UTable
      v-model="selectedRows"
      @select="selectRow"
      :columns="columns"
      :rows="data"
      :loading="isLoading"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-24-solid',
        label: 'Loading...',
      }"
      :key="data.length"
      :progress="{ color: 'primary', animation: 'carousel' }"
    >
      <template #amount-data="{ row }">
        <span
          :class="{
            'text-zinc-300': row.type === 'contribution',
            'text-emerald-300': row.type === 'income' && row.amount > 0,
          }"
        >
          {{ formatCurrency(row.amount / 100) }}
        </span>
      </template>
      <template #type-data="{ row }">
        {{ row.type === "contribution" ? "Contribuição" : "Receita" }}
      </template>
      <template #createdAt-data="{ row }">
        {{ new Date(row.createdAt).toLocaleDateString("pt-BR") }}
      </template>
    </UTable>
  </UCard>
</template>
