<template>
  <div class="overflow-y-hidden">
    <NuxtRouteAnnouncer />
    <div class="overflow-y-hidden h-screen flex flex-col">
      <ItemList
        ref="itemList"
        class="flex-1 overflow-y-auto container mx-auto px-4"
        v-model="items"
      />
      <footer class="flex-none">
        <div class="border-t border-gray-200">
          <div class="container mx-auto px-4 py-2">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-lg font-bold">合計金額</div>
                <div class="text-2xl font-bold tabular-nums slashed-zero">
                  {{ getFormattedPrice(total) }}
                </div>
              </div>
              <div>
                <button
                  v-if="total > 0"
                  type="button"
                  class="px-12 py-2 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  @click="isPaymentMethodSelectionModalOpen = true"
                >
                  会計
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    <Teleport to="body">
      <LoadingOverlay v-model="isLoading" />
      <ScreenSaver v-model="isScreenSaverActive" @click="setNoActionTimer" />
      <PaymentMethodSelectionModal
        v-model="isPaymentMethodSelectionModalOpen"
        @select="
          (method) => {
            isPaymentMethodSelectionModalOpen = false;
            switch (method) {
              case 'cash':
                isCashPaymentModalOpen = true;
                break;
              case 'original-prepaid':
                isLoading = true;
                fetchOriginalPrepaidPaymentUrl()
                  .then(() => {
                    isOriginalPrepaidPaymentModalOpen = true;
                  })
                  .finally(() => {
                    isLoading = false;
                  });
                break;
            }
          }
        "
      />
      <CashPaymentModal
        v-model="isCashPaymentModalOpen"
        :total="total"
        @payment="
          (payment) => {
            cashPayment = payment;
            isCashPaymentModalOpen = false;
            isChangeDisplayModalOpen = true;
          }
        "
      />
      <ChangeDisplayModal
        v-model="isChangeDisplayModalOpen"
        :total="total"
        :payment="cashPayment"
        @paid="
          () => {
            isChangeDisplayModalOpen = false;
            cashPayment = 0;
            items = [];
            toast.success('ご利用ありがとうございました。');
          }
        "
      />
      <OriginalPrepaidPaymentModal
        v-if="config.public.originalPrepaidPayment.url"
        :txn-id="originalPrepaidPaymentTxnId"
        :url="originalPrepaidPaymentUrl"
        @paid="
          () => {
            isOriginalPrepaidPaymentModalOpen = false;
            items = [];
            toast.success('ご利用ありがとうございました。');
          }
        "
        v-model="isOriginalPrepaidPaymentModalOpen"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Item } from "./schemas/item";
import { getFormattedPrice } from "./utils/numberFormat";
import type { CreateTransactionApiRequest } from "./schemas/create-transaction-api";
import "notyf/notyf.min.css";

const SCREEN_SAVER_TIMEOUT = 30000;

const toast = useToast();

const isLoading = ref(false);
const initialData = ref<Item[]>([]);
const items = ref<Item[]>(initialData.value);
const initialValue = ref("");
const value = ref("");
const lastTime = ref(0);
const itemList = useTemplateRef("itemList");
const isScreenSaverActive = ref(false);
const isPaymentMethodSelectionModalOpen = ref(false);
const isCashPaymentModalOpen = ref(false);
const isChangeDisplayModalOpen = ref(false);
const cashPayment = ref(0);
const isOriginalPrepaidPaymentModalOpen = ref(false);
const originalPrepaidPaymentTxnId = ref<string | null>(null);
const originalPrepaidPaymentUrl = ref<string | null>(null);
const noActionTimer = ref<null | number>(null);

useHead({
  link: [
    // https://tailwindui.com/documentation#:~:text=of%20Tailwind%20UI.-,Optional%3A%20Add%20the%20Inter%20font%20family,-We%27ve%20used%20Inter
    // https://rsms.me/inter/
    {
      rel: "preconnect",
      href: "https://rsms.me/",
    },
    {
      rel: "stylesheet",
      href: "https://rsms.me/inter/inter.css",
    },
  ],
});

const config = useRuntimeConfig();

const isAnyModalOpen = computed(
  () =>
    isPaymentMethodSelectionModalOpen.value ||
    isCashPaymentModalOpen.value ||
    isChangeDisplayModalOpen.value ||
    isOriginalPrepaidPaymentModalOpen.value
);

// 30秒間操作がない場合はスクリーンセーバーを表示
const noActionHandler = () => {
  // モーダル表示中は延長
  if (isAnyModalOpen.value) {
    setNoActionTimer();
    return;
  }

  // 30秒間操作がない場合はスクリーンセーバーを表示
  isScreenSaverActive.value = true;
};

// 30秒間操作がないことを検知する
const setNoActionTimer = () => {
  if (noActionTimer.value) {
    clearTimeout(noActionTimer.value);
  }
  noActionTimer.value = window.setTimeout(
    noActionHandler,
    SCREEN_SAVER_TIMEOUT
  );
};

// USBバーコードリーダの読み取りを受け取る
const handleKeypress = async (e: KeyboardEvent) => {
  const now = new Date().getTime();
  if (now - lastTime.value > 100) {
    value.value = initialValue.value;
  }
  lastTime.value = now;
  if (e.key === "Enter") {
    const data = await $fetch<Item>(`/api/items/${value.value}/`, {
      method: "GET",
      responseType: "json",
    });
    if (data) {
      items.value.push(data);

      // 一番下までスクロール
      if (itemList.value) {
        await nextTick();
        itemList.value.$el.scrollTop = itemList.value.$el.scrollHeight;
      }
    }
    value.value = initialValue.value;
  } else {
    value.value += e.key;
  }
};

// オリジナルプリペイド決済のURLを取得
const fetchOriginalPrepaidPaymentUrl = async () => {
  try {
    const data = await $fetch<{ transactionId: string; url: string }>(
      "/api/original-prepaid-payment/",
      {
        method: "POST",
        responseType: "json",
        body: {
          totalAmount: total.value,
          details: items.value.reduce((acc, item) => {
            const existingItem = acc.findIndex(
              (accItem) => accItem.productId === item.jan_code
            );
            if (existingItem !== -1) {
              acc[existingItem].quantity += 1;
              return acc;
            }
            acc.push({
              productId: item.jan_code,
              name: item.name,
              price: item.price,
              quantity: 1,
            });
            return acc;
          }, [] as CreateTransactionApiRequest["details"]),
          paymentMethod: "prepaid",
        } as CreateTransactionApiRequest,
      }
    );
    originalPrepaidPaymentTxnId.value = data.transactionId;
    originalPrepaidPaymentUrl.value = data.url;
  } catch (e) {
    console.error(e);
    originalPrepaidPaymentTxnId.value = null;
    originalPrepaidPaymentUrl.value = null;
    const errorMessage =
      e instanceof Error ? e.message : "決済の初期化に失敗しました";
    useToast().error({
      message: errorMessage,
    });
  }
};

onMounted(() => {
  window.addEventListener("keypress", handleKeypress);
  setNoActionTimer();
});

onUnmounted(() => {
  window.removeEventListener("keypress", handleKeypress);
  if (noActionTimer.value) {
    window.clearTimeout(noActionTimer.value);
    noActionTimer.value = null;
  }
});

watch(items.value, () => {
  isScreenSaverActive.value = false;
  setNoActionTimer();
});

const total = computed(() =>
  items.value.reduce((acc, item) => acc + item.price, 0)
);
</script>
