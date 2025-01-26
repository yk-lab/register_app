<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10" @close="open = false" aria-label="前払い決済">
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
              <div class="absolute right-0 top-0 pr-4 pt-4">
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
                  <QrCode class="size-6 text-blue-600" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold text-gray-900"
                  >
                    {{ config.public.originalPrepaidPayment.name }}支払い
                  </DialogTitle>
                  <div v-if="qrCode" class="mt-2">
                    <p>QRコードを読み取ってください。</p>
                    <div class="mt-2">
                      <div v-html="qrCode" class="mx-auto w-64 h-64"></div>
                    </div>
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
import { QrCode, X } from "lucide-vue-next";
import "simple-keyboard/build/css/index.css";
import { renderSVG } from "uqr";
import type { Transaction } from "~/schemas/transaction";

/**
 * オリジナル前払い決済モーダル
 * @component
 * @description QRコードを表示して前払い決済を処理するモーダルコンポーネント
 * @emits {void} paid - 支払いが完了した時に発火
 * @emits {void} update:modelValue - モーダルの表示状態が変更された時に発火
 */
const { txnId, url } = defineProps<{
	/** トランザクションID */
	txnId: string | null;
	/** 決済用URL */
	url: string | null;
}>();

/** 支払い完了時に発火するイベント */
const emits = defineEmits<{ paid: [] }>();

const config = useRuntimeConfig();
const open = defineModel({ required: true, type: Boolean });
const interval = ref<number | null>(null);

/** ポーリング間隔をクリアする */
const clearPollingInterval = () => {
	if (interval.value) {
		clearInterval(interval.value);
		interval.value = null;
	}
};

/** QRコードを描画 */
const qrCode = computed(() => {
	if (!url) {
		return "";
	}

	return renderSVG(url, {});
});

watch(open, (value) => {
	if (value) {
		interval.value = window.setInterval(async () => {
			if (!txnId) {
				return;
			}

			const txn = await $fetch<Transaction>(
				`/api/original-prepaid-payment/${txnId}/`,
				{
					method: "GET",
				},
			);
			if (txn.status === "completed") {
				if (interval.value) {
					clearInterval(interval.value);
					interval.value = null;
				}
				emits("paid");
			}
		}, 3000);
	} else {
		clearPollingInterval();
	}
});

onUnmounted(() => {
	clearPollingInterval();
});
</script>
