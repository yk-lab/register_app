<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6"
            >
              <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  @click="open = false"
                >
                  <span class="sr-only">Close</span>
                  <X class="size-6" aria-hidden="true" />
                </button>
              </div>
              <div>
                <div
                  class="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-100"
                >
                  <WalletMinimal
                    class="size-6 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold text-gray-900"
                  >
                    支払い方法を選択
                  </DialogTitle>
                  <div class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6" role="radiogroup">
                    <button
                      type="button"
                      class="inline-flex items-center gap-x-4 rounded-md bg-orange-500 px-7 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                      role="radio"
                      :aria-checked="false"
                      aria-label="現金で支払う"
                      @click="$emit('select', 'cash')"
                    >
                      <HandCoins class="-ml-0.5 size-5" aria-hidden="true" />
                      現金
                    </button>
                    <button
                      v-if="config.public.originalPrepaidPayment.url"
                      type="button"
                      class="inline-flex items-center gap-x-4 rounded-md bg-orange-500 px-7 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                      role="radio"
                      :aria-checked="false"
                      :aria-label="`${ config.public.originalPrepaidPayment.name }で支払う`"
                      @click="$emit('select', 'original-prepaid')"
                    >
                      <QrCode class="-ml-0.5 size-5" aria-hidden="true" />
                      {{ config.public.originalPrepaidPayment.name }}
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	TransitionChild,
	TransitionRoot,
} from "@headlessui/vue";
import { HandCoins, QrCode, WalletMinimal, X } from "lucide-vue-next";

const PAYMENT_METHODS = ["cash", "original-prepaid"] as const;
type PaymentMethod = (typeof PAYMENT_METHODS)[number];

defineEmits<{
	select: [paymentMethod: PaymentMethod];
}>();

const config = useRuntimeConfig();
const open = defineModel({ required: true, type: Boolean });
</script>
