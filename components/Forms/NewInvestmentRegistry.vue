<script lang="ts" setup>
import type { z } from "zod";
import type { InvestmentRegistry } from "~/types";
import registrySchema from "~/utils/forms/registry.schema";
const toast = useToast();

const { investmentId, investmentTotal } = defineProps<{
  investmentId: string;
  investmentTotal: number;
}>();

const emit = defineEmits<{
  (e: "create", data: InvestmentRegistry): void;
}>();

const state = reactive<z.infer<typeof registrySchema>>({
  amount: 0,
  calculateDifference: true,
  isIncome: true,
  boughtAt: "",
});

async function handleSubmit() {
  if (state.amount && state.boughtAt) {
    const data = {
      amount: state.calculateDifference
        ? state.amount - investmentTotal
        : state.amount,
      type: state.isIncome ? "income" : "contribution",
      boughtAt: state.boughtAt,
    };

    $fetch(`/api/investments/${investmentId}/registry`, {
      method: "POST",
      body: JSON.stringify(data),
      onResponse: async ({ response }) => {
        if (response.ok) {
          emit("create", response._data);
          return;
        }

        toast.add({
          title: "Ocorreu um erro ao salvar o registro",
          icon: "i-heroicons-exclamation-triangle-16-solid",
          color: "red",
        });
      },
    });
  }
}

onMounted(() => {
  state.boughtAt = new Date()
    .toLocaleString("pt-BR")
    .split(",")[0]
    .split("/")
    .map((item) => item.padStart(2, "0"))
    .reverse()
    .join("-");
});
</script>

<template>
  <UForm
    ref="form"
    :schema="registrySchema"
    :state="state"
    @submit="handleSubmit"
    class="flex flex-col gap-3"
  >
    <UFormGroup label="Valor" name="amount" rules="required" class="w-full">
      <UInput
        placeholder="Valor"
        type="number"
        v-model="state.amount"
        input-class="pl-7"
        step="0.01"
      >
        <template #leading>
          <span class="text-zinc-400 text-xs">R$</span>
        </template>
      </UInput>
    </UFormGroup>
    <UCheckbox
      v-model="state.calculateDifference"
      label="Calcular Diferença"
      name="calculateDifference"
    />
    <UCheckbox label="Rendimento" v-model="state.isIncome" name="isIncome" />
    <UFormGroup label="Data" name="boughtAt" rules="required" class="w-full">
      <UInput placeholder="Data" type="date" v-model="state.boughtAt" />
    </UFormGroup>
    <UDivider class="my-1" />
    <div class="flex justify-end">
      <UButton
        type="submit"
        label="Adicionar"
        color="green"
        class="min-w-20 justify-center"
        icon="i-heroicons-check-16-solid"
        :disabled="!state.amount || !state.boughtAt"
      />
    </div>
  </UForm>
</template>
