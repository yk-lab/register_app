import type { ScreenSaveImage } from "~/schemas/screen-save-image";

export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig();

  if (!runtimeConfig.screenSaveImageApiUrl) {
    return [];
  }

  return await $fetch<ScreenSaveImage[]>(runtimeConfig.screenSaveImageApiUrl, {
    responseType: "json",
  });
})
