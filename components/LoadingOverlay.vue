<template>
  <TransitionRoot
    appear
    :show="isLoading"
    as="div"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div class="flex flex-col items-center gap-2">
      <div
        class="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent"
      ></div>
      <div class="text-white font-medium">読み込み中...</div>
    </div>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { TransitionRoot } from "@headlessui/vue";

const isLoading = defineModel({ required: true, type: Boolean });
</script>
