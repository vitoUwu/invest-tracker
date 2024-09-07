<script lang="ts" setup>
import type { InvestmentRegistry } from "~/types";
import registrySchema from "~/utils/forms/registry.schema";
const toast = useToast();

const { investmentId } = defineProps<{
  investmentId: string;
}>();

const emit = defineEmits<{
  (e: "create", data: InvestmentRegistry): void;
}>();

const state = reactive({
  amount: 0,
  type: "contribution",
  boughtAt: new Date().toISOString().split("T")[0],
});

async function handleSubmit() {
  if (state.amount && state.boughtAt && state.type) {
    const data = {
      amount: state.amount,
      type: state.type,
      boughtAt: state.boughtAt,
    };

    $fetch(`/api/investments/${investmentId}/registry`, {
      method: "POST",
      body: JSON.stringify(data),
      onResponseError: () => {
        toast.add({
          title: "Ocorreu um erro ao salvar o registro",
          icon: "i-heroicons-exclamation-triangle-16-solid",
          color: "red",
        });
      },
      onRequestError: () => {
        toast.add({
          title: "Ocorreu um erro ao salvar o registro",
          icon: "i-heroicons-exclamation-triangle-16-solid",
          color: "red",
        });
      },
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
    <UFormGroup label="Tipo" name="type" rules="required">
      <URadioGroup
        v-model="state.type"
        :options="[
          { label: 'Contribuição', value: 'contribution' },
          { label: 'Receita', value: 'income' },
        ]"
      />
    </UFormGroup>
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
