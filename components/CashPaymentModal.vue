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
                          合計金額
                        </dt>
                        <dd
                          class="mt-1 text-2xl font-semibold tabular-nums slashed-zero"
                        >
                          {{ getFormattedPrice(total) }}
                        </dd>
                      </div>
                      <div>
                        <dt class="text-sm font-medium text-gray-500">
                          お預かり金額
                        </dt>
                        <dd
                          class="mt-1 text-2xl font-semibold tabular-nums slashed-zero"
                        >
                          {{
                            value === ""
                              ? "-"
                              : getFormattedPrice(parseInt(value, 10))
                          }}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div class="mt-2" ref="keyboardRef"></div>
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
import { HandCoins, X } from "lucide-vue-next";
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";

const { total } = defineProps<{
	total: number;
}>();

const emits = defineEmits<{ payment: [amount: number] }>();

const open = defineModel({ required: true, type: Boolean });
const keyboardRef = useTemplateRef("keyboardRef");
const value = ref("");
const keyboard = ref<Keyboard | null>(null);

watch(open, async (newOpen) => {
	if (newOpen) {
		await nextTick();
		if (keyboardRef.value) {
			keyboard.value = new Keyboard(keyboardRef.value, {
				onChange: (input) => {
					value.value = input;
				},
				onKeyPress: (button) => {
					if (button === "{enter}") {
						const payment = Number.parseInt(value.value, 10);
						if (payment >= total) {
							emits("payment", payment);
						}
					}
				},
				layout: {
					default: ["1 2 3", "4 5 6", "7 8 9", "{bksp} 0 {enter}"],
				},
				theme: "hg-theme-default hg-layout-numeric numeric-theme",
				display: {
					"{bksp}": "←",
					"{enter}": "確定",
				},
			});
		}
	} else {
		if (keyboard.value) {
			keyboard.value.destroy();
			keyboard.value = null;
		}
		value.value = "";
	}
});
</script>
