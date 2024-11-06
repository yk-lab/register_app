<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10">
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
              <div>
                <div
                  class="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-100"
                >
                  <HandCoins class="size-6 text-blue-600" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold text-gray-900"
                  >
                    現金支払い
                  </DialogTitle>
                  <div class="mt-2">
                    <dl>
                      <div>
                        <dt class="text-sm font-medium text-gray-500">
                          お釣り
                        </dt>
                        <dd
                          class="mt-1 text-2xl font-semibold tabular-nums slashed-zero"
                        >
                          {{ getFormattedPrice(change) }}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div class="mt-2">
                    <button
                      type="button"
                      class="px-12 py-2 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      @click="$emit('paid', orderId)"
                    >
                      閉じる
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

<script lang="ts" setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { HandCoins } from "lucide-vue-next";

defineEmits<{
  paid: [orderId: string];
}>();

const { total, payment } = defineProps<{
  total: number;
  payment: number;
}>();

const open = defineModel({ required: true, type: Boolean });

const orderId = "";

const change = computed(() => payment - total);
</script>
