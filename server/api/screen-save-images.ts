import type { ScreenSaveImage } from "~/schemas/screen-save-image";

export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig();
  return await $fetch<ScreenSaveImage[]>(runtimeConfig.screenSaveImageApiUrl, {
    responseType: "json",
  });
})
