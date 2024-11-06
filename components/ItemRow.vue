<template>
  <div class="grid grid-cols-9 items-center">
    <div class="col-span-5 font-semibold truncate">{{ item.name }}</div>
    <div class="col-span-3 font-semibold text-right tabular-nums slashed-zero">
      {{ getFormattedPrice(item.price) }}
    </div>
    <div class="text-right">
      <button
        type="button"
        class="p-2 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
        @click="$emit('delete', item)"
      >
        <Delete aria-hidden="true" />
        <span class="sr-only">削除</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Item } from "../schemas/item";
import { Delete } from "lucide-vue-next";
import {getFormattedPrice} from "../utils/numberFormat";

defineEmits<{
  delete: [item: Item];
}>();

defineProps<{
  item: Item;
}>();
</script>
