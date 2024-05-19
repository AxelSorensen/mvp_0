<template>
  <div class="flex flex-col items-center h-screen p-8 ">
    <h1 class="text-lg font-medium text-pu mb-4">AI Business Development</h1>
    <div class="flex flex-col gap-4 w-full h-full">
      <!-- <InputC label="Name" v-model="name" placeholder="The name of your product" /> -->
      <TextAreaC label="Description" rows="4" placeholder="A short description of your product" v-model="description" />
      <button class="bg-purple-500 text-white rounded-md text-sm p-2 hover:bg-purple-400 mb-8"
        :class="{ 'animate-pulse': pending, 'pointer-events-none opacity-50': !description }"
        @click="submit({ 'description': description })">{{ pending ?
        'Processing...' : 'Submit' }}</button>
      <div class="h-full grid grid-cols-2 grid-rows-2 gap-4">
        <div class=" flex gap-1 flex-col">
          <label class="text-xs font-medium">Usecase:</label>
          <div class="bg-gray-100 text-xs rounded-md p-2">
            <p v-html="use_case"></p>
          </div>
        </div>
        <div class=" flex gap-1 flex-col">
          <label class="text-xs font-medium">Market analysis:</label>

          <div class="bg-gray-100 rounded-md text-xs p-2 gap-2 flex flex-col">
            <div class="flex gap-1">
              <label>Relevant market: </label>
              <div class="font-bold" v-if="market_analysis.relevant_market">
                {{ market_analysis.relevant_market }}
              </div>
              <div class="text-gray-400" v-else>...</div>
            </div>
            <div class="flex gap-1">
              <label>Market size: </label>
              <div v-if="market_analysis.market_stats" class="font-bold">
                {{ market_analysis.market_stats.market_size?.value }}
                <a target="_blank" :href="market_analysis.market_stats?.market_size?.source">🔗</a>
              </div>
              <div class="text-gray-400" v-else>...</div>

            </div>
            <div class="flex gap-1">
              <label>CAGR: </label>
              <div v-if="market_analysis.market_stats" class="font-bold">
                {{ market_analysis.market_stats?.CAGR?.value }}
                <a target="_blank" :href="market_analysis.market_stats?.CAGR?.source">🔗</a>
              </div>
              <div class="text-gray-400" v-else>...</div>

            </div>
            <div class="flex flex-col gap-1">
              <label>Dominant actors: </label>
              <a class="text-white bg-purple-500 p-1 rounded-sm hover:bg-purple-600"
                v-if="market_analysis.dominant_actors" :href="actor.link" target="_blank"
                v-for="actor in market_analysis.dominant_actors.top_3">
                {{ actor.name }}
              </a>
              <div class="text-gray-400" v-else>...</div>

            </div>
            <div class="flex flex-col gap-1">
              <label>Potential customers: </label>
              <div class="text-white bg-purple-500 p-1 rounded-sm" v-if="market_analysis.potential_customers"
                v-for="group in market_analysis.potential_customers.top_3">
                {{ group.name }}
              </div>
              <div class="text-gray-400" v-else>...</div>

            </div>

          </div>
        </div>
        <div class=" flex gap-1 flex-col">
          <label class="text-xs font-medium">Patent landscape:</label>
          <div class="bg-gray-100 rounded-md text-sm p-2">
            <p>{{ }}</p>
          </div>
        </div>
        <div class="gap-1 flex flex-col">
          <label class="text-xs font-medium">SWOT:</label>
          <div class="bg-gray-100 rounded-md text-sm p-2">
            <p>{{ }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const market_analysis = ref({
  relevant_market: null,
  market_stats: null,
  dominant_actors: null,
  potential_customers: null,
})
const use_case = ref('')
// const name = ref('')
const description = ref('')
const pending = ref(false)

async function submit(input) {
  pending.value = true
  market_analysis.value.relevant_market = await $fetch('/api/market_analysis/relevant_market', {
    method: 'POST',
    body: {
      "description": input.description
    }
  })
  market_analysis.value.market_stats = await $fetch('/api/market_analysis/market_stats', {
    method: 'POST',
    body: {
      "market": market_analysis.value.relevant_market
    }
  })
  market_analysis.value.dominant_actors = await $fetch('/api/market_analysis/dominant_actors', {
    method: 'POST',
    body: {
      "market": market_analysis.value.relevant_market
    }
  })
  market_analysis.value.potential_customers = await $fetch('/api/market_analysis/potential_customers', {
    method: 'POST',
    body: {
      "market": market_analysis.value.relevant_market,
      "idea": input.description
    }
  })
  use_case.value = await $fetch('/api/market_analysis/use_case', {
    method: 'POST',
    body: {
      "description": input.description,
    }
  })
  pending.value = false
  console.log('success')
}
</script>
