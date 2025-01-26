<template>
  <div
    v-if="isActive"
    @click="$emit('update:modelValue', false)"
    class="fixed inset-0 flex items-center justify-center bg-black/90 z-50"
  >
    <div class="relative w-full h-full">
      <img
        v-for="(image, i) in images"
        :key="i"
        :src="image"
        alt="スクリーンセーバー画像"
        class="max-w-full max-h-full object-contain absolute top-0 left-0 transition-opacity duration-500"
        :class="i === currentImageIndex ? 'opacity-100' : 'opacity-0'"
      />
    </div>

    <div
      class="absolute bottom-24 w-full h-16 bg-black/70 backdrop-filter backdrop-blur-md overflow-hidden flex justify-center items-center"
    >
      <div class="whitespace-nowrap animate-scroll text-white text-lg w-full">
        <span> 利用を再開するには画面に触れてください </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Handlebars from "handlebars";

import { debounce } from "es-toolkit";
import { SCREEN_SAVER_CONSTANTS } from "~/constants/screen-saver";
import type { ScreenSaveImage } from "~/schemas/screen-save-image";

const RESIZE_DEBOUNCE_DELAY = 300; // milliseconds

const isActive = defineModel({ required: true, type: Boolean });
const images = ref<string[]>([]); // 画像URLのリスト
const currentImageIndex = ref(0); // 現在表示中の画像のインデックス
const slideInterval = ref<number | null>(null); // スライドショー用タイマー
const slideDuration = SCREEN_SAVER_CONSTANTS.SLIDE_DURATION; // 画像表示の間隔
const apiFetchInterval = SCREEN_SAVER_CONSTANTS.API_FETCH_INTERVAL; // API再取得間隔
const apiFetchTimer = ref<number | null>(null); // API再取得用タイマー

const fetchImages = async () => {
	try {
		const response = await $fetch<ScreenSaveImage[]>(
			"/api/screen-save-images/",
			{
				method: "GET",
				responseType: "json",
			},
		);
		const width = window.innerWidth || 1024;
		const height = window.innerHeight || 600;
		const data = response.map((image) => {
			const template = Handlebars.compile(image.url);
			return template({ width, height, timestamp: Date.now() });
		});

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

// リサイズ時の処理
const handleResize = debounce(() => {
	fetchImages();
}, RESIZE_DEBOUNCE_DELAY);

onMounted(() => {
	// 初期化処理
	fetchImages(); // 画像リストの初回取得
	setupApiFetchTimer(); // 定期的なAPI再取得タイマーをセット
	window.addEventListener("resize", handleResize); // リサイズ時に画像リストを再取得
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
	handleResize.cancel();
	window.removeEventListener("resize", handleResize);
});

watch(isActive, (newIsActive) => {
	if (newIsActive) {
		slideShow();
	} else {
		stopSlideShow();
	}
});
</script>
