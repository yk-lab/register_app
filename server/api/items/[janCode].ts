import type { Item } from '../../../schemas/item';

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();

    const janCode = getRouterParam(event, 'janCode');
    const data = await $fetch<Item[]>(runtimeConfig.itemApiUrl, {
        responseType: "json",
    });

    const item = data.find((item) => item.jan_code === janCode);
    if (!item) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found',
        });
    }
    return item;
});