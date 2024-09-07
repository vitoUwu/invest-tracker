<script lang="ts" setup>
import type { InvestmentWithRegistry } from "~/types";
import investmentSchema from "~/utils/forms/investment.schema";
const toast = useToast();

const emit = defineEmits<{
  (e: "create", data: InvestmentWithRegistry): void;
}>();

const state = reactive({
  name: "Novo Investimento",
  initialAmount: 0,
});

async function handleSubmit() {
  $fetch("/api/investments", {
    method: "POST",
    body: JSON.stringify(state),
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
</script>

<template>
  <UForm
    ref="form"
    :schema="investmentSchema"
    :state="state"
    @submit="handleSubmit"
    class="flex flex-col gap-3"
  >
    <UFormGroup label="Nome" name="name" rules="required" class="w-full">
      <UInput placeholder="Nome" type="text" v-model="state.name" />
    </UFormGroup>
    <UFormGroup
      label="Valor inicial"
      name="initialAmount"
      rules="required"
      class="w-full"
    >
      <UInput
        placeholder="Valor inicial"
        type="number"
        v-model="state.initialAmount"
        input-class="pl-7"
        step="0.01"
      >
        <template #leading>
          <span class="text-zinc-400 text-xs">R$</span>
        </template>
      </UInput>
    </UFormGroup>
    <UDivider class="my-1" />
    <div class="flex justify-end">
      <UButton
        type="submit"
        label="Adicionar"
        color="green"
        class="min-w-20 justify-center"
        icon="i-heroicons-check-16-solid"
        :disabled="!state.name || typeof state.initialAmount !== 'number'"
      />
    </div>
  </UForm>
</template>
