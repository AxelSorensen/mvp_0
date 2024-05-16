<template>
  <div class="flex flex-col items-center h-screen p-8">
    <h1 class="text-lg font-medium text-pu mb-4">AI Business Development</h1>
    <div class="flex flex-col gap-4 w-full h-full">
      <InputC label="Name" v-model="name" placeholder="The name of your product" />
      <TextAreaC label="Description" rows="4" placeholder="A short description of your product" v-model="description" />
      <button class="bg-purple-500 text-white rounded-md text-sm p-2 hover:bg-purple-400 mb-8"
        :class="{ 'animate-pulse': pending, 'pointer-events-none opacity-50': !name || !description }"
        @click="submit({ 'name': name, 'description': description })">{{ pending ?
        'Processing...' : 'Submit' }}</button>
      <div class="h-full flex flex-col gap-1">
        <label class="text-xs font-medium">Output:</label>
        <div class="w-full bg-gray-100 rounded-md text-sm h-full p-2">
          <p>{{ data.output }}</p>
        </div>
      </div>
    </div>



  </div>
</template>

<script setup>
const data = ref('')
const name = ref('')
const description = ref('')
const pending = ref(false)

async function submit(input) {
  pending.value = true
  data.value = await $fetch('/api/llm', {
    method: 'POST',
    body: {
      "name": input.name,
      "description": input.description
    }
  })
  pending.value = false
  console.log('success')
}
</script>
