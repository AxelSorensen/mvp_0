<template>
  <div class="flex flex-col gap-1 justify-between">
    <label class="text-xs text-gray-600 ">{{ label }}:</label>
    <input type="text" class="bg-gray-100 p-2 text-sm rounded-md" v-model="model" :placeholder="placeholder" />

  </div>
</template>

<script setup>
const model = defineModel()
defineProps({
  label: String,
  placeholder: String,
})

</script>
