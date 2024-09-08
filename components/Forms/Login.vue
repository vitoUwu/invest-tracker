<script setup lang="ts">
import loginSchema from "~/utils/forms/login.schema";
const toast = useToast();

const state = reactive({
  email: "",
  password: "",
});

async function handleSubmit() {
  $fetch("/api/login", {
    method: "POST",
    body: JSON.stringify(state),
    onResponse: async ({ response }) => {
      if (response.ok) {
        navigateTo("/");
        return;
      }

      toast.add({
        title: "Ocorreu um erro",
        icon: "i-heroicons-exclamation-triangle-16-solid",
        color: "red",
        description: response._data,
      });
    },
  });
}
</script>

<template>
  <UForm
    ref="form"
    :schema="loginSchema"
    :state="state"
    @submit="handleSubmit"
    class="flex flex-col gap-3"
  >
    <UFormGroup label="Email" name="email" rules="required" class="w-full">
      <UInput placeholder="Email" type="email" v-model="state.email" />
    </UFormGroup>
    <UFormGroup label="Senha" name="password" rules="required" class="w-full">
      <UInput placeholder="Senha" type="password" v-model="state.password" />
    </UFormGroup>
    <UDivider class="my-1" />
    <div class="flex justify-end">
      <UButton
        type="submit"
        label="Entrar"
        color="green"
        class="w-full justify-center"
        icon="i-heroicons-user-16-solid"
        :disabled="!state.email || !state.password"
      />
    </div>
  </UForm>
  <UNotifications />
</template>
