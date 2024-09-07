<template>
  <div class="bg-zinc-900 sticky top-0 z-50 border-b border-zinc-800">
    <header
      class="container mx-auto flex items-center justify-between px-3 py-3"
    >
      <div class="flex items-center gap-2 font-semibold">
        <UIcon name="i-heroicons-chart-bar-16-solid" class="h-6 w-6" />
        <span class="">Investimentos</span>
      </div>
      <!-- <UDropdown :items="[[{ label: 'Profile' }, { label: 'Exit' }]]"> -->
      <UButton color="white" variant="ghost">
        <UAvatar
          src="https://avatars.githubusercontent.com/u/32278696?v=4"
          alt="Avatar"
        />
      </UButton>
      <!-- </UDropdown> -->
    </header>
  </div>
</template>
