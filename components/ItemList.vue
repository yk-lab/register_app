<template>
  <div class="relative">
    <div class="py-2 bg-white grid grid-cols-9 sticky top-0 inset-x-0">
      <div class="col-span-5 font-bold text-center">商品名</div>
      <div class="col-span-3 font-bold text-center">価格</div>
      <div><span class="sr-only">削除</span></div>
    </div>
    <div v-auto-animate>
      <template v-for="(item, i) in items" :key="i">
        <ItemRow :item="item" @delete="items.splice(i, 1)" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Item } from "../schemas/item";

const items = defineModel<Item[]>({ required: true });
</script>
