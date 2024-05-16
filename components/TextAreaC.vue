<template>
  <div class="flex gap-1 flex-col justify-between">
    <label class="text-xs text-gray-600">{{ label }}:</label>
    <textarea type="text" class="bg-gray-100 p-2 rounded-md w-full text-sm" v-model="model" :placeholder="placeholder"
      :rows="rows" />
  </div>
</template>

<script setup>
const model = defineModel()
defineProps({
  label: String,
  rows: String,
  placeholder: String
})

</script>
