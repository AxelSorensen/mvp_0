<template>
  <div class="grid grid-rows-[auto,1fr] items-center h-screen p-8">
    <div class="flex flex-col w-full h-full gap-4">
      <h1 class="text-lg w-full text-center font-medium">AI Business Development</h1>
      <div class="flex gap-1 flex-col justify-between">
        <label class="text-xs text-gray-600">Description:</label>
        <textarea type="text" class="bg-gray-100 p-2 rounded-md w-full text-sm" v-model="description"
          placeholder="A short description of your idea" rows="4" />
      </div>
      <button class="bg-purple-500 text-white rounded-md text-sm p-2 hover:bg-purple-400 mb-8"
        :class="{ 'animate-pulse': pending, 'pointer-events-none opacity-50': !description }"
        @click="submit({ 'description': description })">{{ pending ?
          'Processing...' : 'Submit' }}</button>
    </div>

    <div v-if="page == null" class="w-full h-full flex overflow-hidden justify-between gap-4">
      <div @click="page = idx" :class="{ 'animate-pulse': pending, 'pointer-events-none': !use_case }"
        class="bg-gray-100 w-full text-sm rounded-md grid grid-rows-[2.5rem,1fr] hover:bg-purple-50 gap-2 cursor-pointer hover:ring-2 ring-inset ring-purple-400 border-dashed p-2 overflow-scroll"
        v-for="(usecase, idx) in use_case.usecases || 5">
        <div class="rounded-md font-medium line-clamp-2">
          <p>

            {{ usecase?.title }}</p>
        </div>
        <div class="text-ellipsis" v-html="usecase?.description"></div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-purple-400" v-for="score in usecase?.novelty_score"></div>
        </div>
      </div>
    </div>
    <div v-else class="w-full h-full flex flex-col gap-4 overflow-hidden">
      <div class="flex text-xs gap-2 items-center">
        <div @click="page = idx"
          :class="{ 'bg-purple-100 text-purple-700 cursor-default': page == idx, 'bg-gray-100 hover:bg-gray-200 cursor-pointer': page != idx }"
          class="overflow-hidden  rounded-sm whitespace-nowrap text-ellipsis p-2"
          v-for="(usecase, idx) in use_case.usecases  ">
          {{
          usecase.title }}</div>
      </div>
      <div class=" w-full h-full grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col custom-container gap-1 max-h-32 min-h-[2rem]">
            <label class="text-xs font-medium">Usecase:</label>

            <div class="bg-gray-100 text-xs overflow-scroll rounded-md flex-grow p-2">
              <p class="text-ellipsis" v-html="use_case.usecases?.[page]?.description"></p>
            </div>

          </div>
          <div class="flex flex-col custom-container gap-1">
            <label class="text-xs font-medium">Market analysis:</label>

            <div class="bg-gray-100 overflow-scroll rounded-md flex flex-col text-xs p-2 gap-2 flex-grow">
              <div class="flex gap-1">
                <label class="text-nowrap">Relevant market: </label>
                <div class="font-bold truncate" v-if="market_analysis[page].relevant_market">
                  {{ market_analysis[page].relevant_market }}
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
                  v-for="   actor    in    market_analysis.dominant_actors.top_3   ">
                  {{ actor.name }}
                </a>
                <div class="text-gray-400" v-else>...</div>

              </div>
              <div class="flex flex-col gap-1">
                <label>Potential customers: </label>
                <div class="text-white bg-purple-500 p-1 rounded-sm" v-if="market_analysis.potential_customers"
                  v-for="   group    in    market_analysis.potential_customers.top_3   ">
                  {{ group.name }}
                </div>
                <div class="text-gray-400" v-else>...</div>

              </div>

            </div>

          </div>
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col custom-container gap-1 max-h-[300px] min-h-[2rem]">
            <label class="text-xs font-medium">Patent landscape:</label>
            <div class="bg-gray-100 overflow-scroll rounded-md text-sm p-2 flex-grow">
              <p>{{ }}</p>
            </div>
          </div>
          <div class="flex flex-col custom-container gap-1">
            <label class="text-xs font-medium">SWOT:</label>
            <div class="rounded-md grid grid-rows-2 grid-cols-2 gap-4 custom-container">
              <div class="bg-gray-100 rounded-md p-2 flex-grow flex flex-col overflow-scroll gap-1 "
                v-for="   category    in    swot_categories   ">
                <p class="text-xs font-bold">{{ category }}</p>
                <p class="text-xs" v-for="   element    in    swot[category]   ">- {{ element }}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
const market_analysis = ref({
  0: {
    relevant_market: null,
    market_stats: null,
    dominant_actors: null,
    potential_customers: null,
  },
  1: {
    relevant_market: null,
    market_stats: null,
    dominant_actors: null,
    potential_customers: null,
  },
  2: {
    relevant_market: null,
    market_stats: null,
    dominant_actors: null,
    potential_customers: null,
  },
  3: {
    relevant_market: null,
    market_stats: null,
    dominant_actors: null,
    potential_customers: null,
  },
  4: {
    relevant_market: null,
    market_stats: null,
    dominant_actors: null,
    potential_customers: null,
  },
})




const swot_categories = ['Strengths', 'Weaknesses', 'Opportunities', 'Threats']
const use_case = ref('')
const page = ref(null)
const swot = ref('')
// const name = ref('')
const description = ref('')
const pending = ref(false)

// watch(page, async (current_page) => {
//   if (market_analysis.value[current_page].relevant_market == null) {
//     market_analysis.value[current_page].relevant_market = await $fetch('/api/relevant_market', {
//       method: 'POST',
//       body: {
//         "description": use_case.value.usecases[current_page].description
//       }
//     })
//   }
// })

async function submit(input) {
  pending.value = true
  use_case.value = await $fetch('/api/use_cases', {
    method: 'POST',
    body: {
      "description": input.description,
    }
  })

  // market_analysis.value.market_stats = await $fetch('/api/market_stats', {
  //   method: 'POST',
  //   body: {
  //     "market": market_analysis.value.relevant_market
  //   }
  // })
  // market_analysis.value.dominant_actors = await $fetch('/api/dominant_actors', {
  //   method: 'POST',
  //   body: {
  //     "market": market_analysis.value.relevant_market
  //   }
  // })
  // market_analysis.value.potential_customers = await $fetch('/api/potential_customers', {
  //   method: 'POST',
  //   body: {
  //     "market": market_analysis.value.relevant_market,
  //     "idea": input.description
  //   }
  // })
  // swot.value = await $fetch('/api/swot', {
  //   method: 'POST',
  //   body: {
  //     "description": input.description,
  //     "market_analysis": market_analysis.value,
  //     "usecase": use_case.value
  //   }
  // })
  pending.value = false
  // console.log('success')
}
</script>
