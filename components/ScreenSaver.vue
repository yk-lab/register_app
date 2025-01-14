<template>
  <div
    v-if="isActive"
    @click="$emit('update:modelValue', false)"
    class="fixed inset-0 flex items-center justify-center bg-black/90 z-50"
  >
    <img
      v-if="currentImage"
      :src="currentImage"
      alt="スクリーンセーバー画像"
      class="max-w-full max-h-full object-contain"
    />
  </div>
</template>

<script lang="ts" setup>
import { SCREEN_SAVER_CONSTANTS } from '~/constants/screen-saver';

const isActive = defineModel({ required: true, type: Boolean });
const images = ref<string[]>([]); // 画像URLのリスト
const currentImageIndex = ref(0); // 現在表示中の画像のインデックス
const slideInterval = ref<number | null>(null); // スライドショー用タイマー
const slideDuration = SCREEN_SAVER_CONSTANTS.SLIDE_DURATION; // 画像表示の間隔
const apiFetchInterval = SCREEN_SAVER_CONSTANTS.API_FETCH_INTERVAL; // API再取得間隔
const apiFetchTimer = ref<number | null>(null); // API再取得用タイマー

const currentImage = computed(() => images.value[currentImageIndex.value]);

const fetchImages = async () => {
  try {
    // 画像リストをAPIから取得
    // const response = await fetch("https://api.example.com/images"); // 実際のAPIエンドポイントに変更
    // const data = await response.json();
    const width = window.innerWidth || 1920;
    // const height = window.innerHeight || 1080;
    const data = [
      `https://picsum.photos/${width}?1`,
      `https://picsum.photos/${width}?2`,
      `https://picsum.photos/${width}?3`,
      `https://picsum.photos/${width}?4`,
      `https://picsum.photos/${width}?5`,
    ];

    // ブラウザで事前読み込み
    const preloadImages = data.map((url: string) => {
      const img = new Image();
      img.src = url;
      return img.src;
    });

    images.value = preloadImages;
  } catch (error) {
    console.error("画像リストの取得に失敗しました:", error);
  }
};

const setupApiFetchTimer = () => {
  // 1時間ごとに画像リストを再取得
  apiFetchTimer.value = window.setInterval(() => {
    fetchImages();
  }, apiFetchInterval);
};

const slideShow = () => {
  // スライドショーを開始
  if (images.value.length > 0) {
    slideInterval.value = window.setInterval(() => {
      currentImageIndex.value =
        (currentImageIndex.value + 1) % images.value.length;
    }, slideDuration);
  }
};

const stopSlideShow = () => {
  // スライドショーを停止
  if (slideInterval.value) {
    clearInterval(slideInterval.value);
    slideInterval.value = null;
  }
};

onMounted(() => {
  // 初期化処理
  fetchImages(); // 画像リストの初回取得
  setupApiFetchTimer(); // 定期的なAPI再取得タイマーをセット
});

onBeforeUnmount(() => {
  // クリーンアップ
  if (slideInterval.value) {
    clearInterval(slideInterval.value);
    slideInterval.value = null;
  }
  if (apiFetchTimer.value) {
    clearInterval(apiFetchTimer.value);
    apiFetchTimer.value = null;
  }
});

watch(isActive, (newIsActive) => {
  if (newIsActive) {
    slideShow();
  } else {
    stopSlideShow();
  }
});
</script>
