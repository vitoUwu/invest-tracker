<template>
  <Header />
  <div
    class="grid w-full lg:grid-cols-[200px_1fr] xl:grid-cols-[280px_1fr] container mx-auto"
  >
    <aside class="p-3">
      <UVerticalNavigation
        :links="[
          {
            label: 'Início',
            icon: 'i-heroicons-home-16-solid',
            to: '/',
          },
          {
            label: 'Investimentos',
            icon: 'i-heroicons-chart-bar-16-solid',
            to: '/investimentos',
          },
          {
            label: 'Relatórios',
            icon: 'i-heroicons-document-text-16-solid',
            disabled: true,
          },
          {
            label: 'Configurações',
            icon: 'i-heroicons-cog-16-solid',
            disabled: true,
          },
        ]"
      />
    </aside>
    <slot />
  </div>
  <UNotifications />
</template>
