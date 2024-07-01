<template>
  <div @click.self="modal_open = false; settings_open = false"
    class="absolute w-screen h-screen flex text-sm justify-center items-center p-8 z-10 bg-black bg-opacity-20"
    v-if="modal_open">

    <div class="bg-gray-100 p-8 rounded-md relative">
      <Icon @click="modal_open = false" name="heroicons:x-mark-16-solid"
        class="text-purple-500 cursor-pointer hover:text-purple-600 absolute right-3 top-3" size="1.5rem" />
      <div v-if="!settings_open" v-html="modal_content" class="max-h-[70vh] max-w-[600px] text-sm overflow-scroll">
      </div>
      <div class="flex flex-col gap-4" v-else>
        <div>
          <p class="font-bold mb-2">Usecase</p>
          <div class="flex gap-4 justify-between text-xs">
            <p>Temperature (0-1)</p>
            <input v-model.number="usecase_temp" type="text" class="rounded-sm bg-white p-1 w-16">
          </div>
        </div>
        <div>
          <p class="font-bold mb-2">Market</p>
          <div class="flex flex-col gap-2 text-xs">
            <div class="flex gap-4 justify-between">
              <p>Search type</p>
              <select class="h-6 rounded-sm outline-none" v-model="market_parameters.type">
                <option disabled value="">Please select one</option>
                <option>neural</option>
                <option>keyword</option>
              </select>

            </div>
            <div class="flex gap-4 justify-between">
              <p>Temperature (0-1)</p>
              <input v-model.number="market_parameters.temp" type="text" class="rounded-sm bg-white p-1 w-16">

            </div>
            <div class="flex gap-4 justify-between">
              <p># of pages searched</p>
              <input v-model.number="market_parameters.pages" type="text" class="rounded-sm bg-white p-1 w-16">

            </div>
            <div class="flex gap-4 justify-between">
              <p>Characters extracted (per source)</p>
              <input v-model.number="market_parameters.characters" type="text" class="rounded-sm bg-white p-1 w-16">

            </div>

          </div>
        </div>
        <div>

          <p class="font-bold mb-2">Patent</p>
          <div class="flex flex-col gap-2 text-xs">
            <div class="flex gap-4 justify-between">
              <p>Search type</p>
              <select class="h-6 rounded-sm outline-none" v-model="patent_parameters.type">
                <option disabled value="">Please select one</option>
                <option>neural</option>
                <option>keyword</option>
              </select>

            </div>
            <div class="flex gap-4 justify-between">
              <p>Temperature (0-1)</p>
              <input v-model.number="patent_parameters.temp" type="text" class="rounded-sm bg-white p-1 w-16">

            </div>
            <div class="flex gap-4 justify-between">
              <p># of pages searched</p>
              <input v-model.number="patent_parameters.pages" type="text" class="rounded-sm bg-white p-1 w-16">

            </div>
            <div class="flex gap-4 justify-between">
              <p>Characters extracted (per source)</p>
              <input v-model.number="patent_parameters.characters" type="text" class="rounded-sm bg-white p-1 w-16">

            </div>
          </div>
        </div>
        <button @click="resetSettings" class="bg-gray-200 mt-4 text-xs hover:bg-gray-300 p-1 rounded-sm">Reset to
          default</button>


      </div>
    </div>

  </div>
  <div class="grid grid-rows-[auto,1fr] items-center h-screen p-8">
    <div class="flex flex-col w-full h-full gap-4">
      <h1 class="text-lg w-full text-center font-medium">AI Business Development</h1>
      <Icon @click="openModal()" name="heroicons:cog-6-tooth-16-solid"
        class="text-gray-400 cursor-pointer hover:text-purple-600 absolute mr-8 right-0" size="1.5rem" />
      <div class="flex gap-1 flex-col justify-between">
        <label class="text-xs text-gray-600">Description:</label>
        <textarea type="text" class="bg-gray-100 p-2 rounded-md w-full text-sm" v-model="description"
          placeholder="A short description of your idea" rows="4" />
      </div>
      <div class="flex flex-col justify-center items-center gap-2 mb-4">
        <button
          class="bg-purple-500 flex items-center w-full justify-center text-white rounded-md text-sm h-8 p-2 hover:bg-purple-400"
          :class="{ 'pointer-events-none opacity-50': !description || loading.usecase }" @click="submit">
          <div v-if="loading.usecase" class="flex items-center">
            <div
              class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]">
            </div>
          </div>
          <div v-else>Submit</div>
        </button>
        <div v-if="use_case"
          class="text-xs text-purple-500 flex items-center hover:cursor-pointer  justify-start hover:bg-purple-50 rounded-md p-2 gap-2"
          @click="other_usecases">
          <p class="         whitespace-nowrap text-ellipsis">
            Try
            something different

          </p>
          <Icon name="heroicons:arrow-path-16-solid" class="text-purple-500 cursor-pointer" size="1rem" />
        </div>
      </div>


    </div>

    <div v-if="page == null" class="w-full h-full flex overflow-hidden justify-between gap-4">
      <div @click="page = idx"
        class="bg-gray-100 w-full text-sm rounded-md hover:bg-purple-50 gap-2 cursor-pointer hover:ring-2 ring-inset ring-purple-400 border-dashed p-2 overflow-scroll"
        :class="{ 'pointer-events-none opacity-50': !use_case.usecases || loading.usecase }"
        v-for="(usecase, idx) in use_case.usecases || 5">
        <div v-if="loading.usecase" class=" h-full row-span-2 flex justify-center items-center">
          <div v-if="loading.usecase" class="flex items-center row-span-2">
            <div
              class="inline-block h-8 w-8 text-gray-400 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]">

            </div>
          </div>
        </div>
        <div v-else class=" grid gap-2 grid-rows-[2.5rem,1fr]">
          <div class="rounded-md font-medium line-clamp-2">

            <p>
              {{ usecase?.title }}</p>
          </div>
          <div class="text-ellipsis" v-html="usecase?.description"></div>
          <!-- <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-purple-400" v-for="score in usecase?.novelty_score"></div>
        </div> -->
        </div>

      </div>
    </div>

    <div v-else class="w-full h-full flex flex-col gap-4 overflow-hidden">
      <div class="flex text-xs gap-2 items-center">
        <div>
          <Icon @click="page = null" name="heroicons:chevron-left-16-solid"
            class="text-purple-500 hover:text-purple-600 cursor-pointer" size="1.5rem" />
        </div>
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

            <div @click="openModal(use_case.usecases?.[page]?.description)"
              class="bg-gray-100 text-xs overflow-scroll rounded-md flex-grow p-2">
              <div v-if="loading.elaborate" class="flex h-full items-center justify-center">
                <div
                  class="inline-block text-gray-400 h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]">
                </div>
              </div>
              <p v-else class="text-ellipsis" v-html="use_case.usecases?.[page]?.description"></p>
            </div>
            <div @click="elaborate" class="flex justify-end ">
              <div class="flex group items-center gap-1 cursor-pointer">
                <Icon name="heroicons:sparkles-solid" class="text-purple-500 group-hover:text-purple-600 "
                  size=".8rem" />
                <div class="text-xs font-bold text-purple-500 group-hover:text-purple-600">Elaborate</div>
              </div>

            </div>
          </div>
          <div class="flex flex-col custom-container gap-1">
            <div class="flex items-center gap-2">
              <label class="text-xs font-medium">Market analysis:</label>
              <div @click="get_market_analysis"
                class="text-xs cursor-pointer hover:bg-purple-200 bg-purple-100 text-purple-500 px-2 rounded-sm">
                Fetch
              </div>
            </div>

            <!-- <div v-if="market_format == 'structured'"
              class="bg-gray-100 overflow-scroll rounded-md flex flex-col text-xs p-2 gap-2 flex-grow">
              <div class="flex gap-1">
                <label class="text-nowrap">Relevant market: </label>
                <div class="font-bold truncate" v-if="market_analysis[page].relevant_market">
                  {{ market_analysis[page].relevant_market }}
                </div>
                <div class="text-gray-400" v-else>...</div>
              </div>

              <div class="flex gap-1">
                <label>Market size: </label>
                <div v-if="market_analysis[page].market_stats" class="font-bold">
                  {{ market_analysis[page].market_stats.market_size?.value }}
                  <a target="_blank" :href="market_analysis[page].market_stats?.market_size?.source">🔗</a>
                </div>
                <div class="text-gray-400" v-else>...</div>
              </div>
              <div class="flex gap-1">
                <label>CAGR: </label>
                <div v-if="market_analysis[page].market_stats" class="font-bold">
                  {{ market_analysis[page].market_stats?.CAGR?.value }}
                  <a target="_blank" :href="market_analysis[page].market_stats?.CAGR?.source">🔗</a>
                </div>
                <div class="text-gray-400" v-else>...</div>
              </div>
              <div class="flex flex-col gap-1">
                <label>Dominant actors: </label>
                <a class="text-blue-900 bg-blue-200 p-1 rounded-sm hover:bg-blue-300"
                  v-if="market_analysis[page].dominant_actors" :href="actor.link" target="_blank"
                  v-for="   actor    in    market_analysis[page].dominant_actors.top_3   ">
                  {{ actor.name }}
                </a>
                <div class="text-gray-400" v-else>...</div>

              </div>
              <div class="flex flex-col gap-1">
                <label>Potential customers: </label>
                <div class="font-bold  rounded-sm" v-if="market_analysis[page].potential_customers"
                  v-for="   group    in    market_analysis[page].potential_customers.top_3   ">
                  - {{ group.name }}
                </div>
                <div class="text-gray-400" v-else>...</div>

              </div>

            </div> -->
            <div @click="openModal(market_analysis[page].freeform)"
              class="bg-gray-100 overflow-scroll rounded-md flex flex-col text-xs p-2 gap-2 flex-grow">
              <div v-if="loading.market" class="flex items-center w-full h-full justify-center">
                <div
                  class="inline-block h-8 w-8 text-gray-400 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                  role="status">
                </div>
              </div>
              <div v-else v-html="market_analysis[page].freeform
      ">
              </div>
            </div>
            <!-- <div class="flex text-xs justify-evenly min-h-6 rounded-sm overflow-hidden">
              <div @click="market_format = 'structured'"
                class="flex p-1 justify-center  items-center w-full cursor-pointer" :class="{
          'bg-purple-200 text-purple-700 cursor-auto select-none':
            market_format == 'structured', 'bg-gray-100 flex': market_format == 'freeform'
        }
          ">Structured</div>
              <div @click="market_format = 'freeform'"
                class="flex p-1 justify-center w-full bg-gray-100  items-center cursor-pointer select-none" :class="{
          'bg-purple-200 text-purple-700 w-full justify-center p-1 items-center flex cursor-auto':
            market_format == 'freeform'
        }
          ">Free form</div>
            </div> -->

          </div>
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col custom-container gap-1 max-h-[300px] min-h-[2rem]">
            <div class="flex items-center gap-2">
              <label class="text-xs font-medium">Similar patents:</label>
              <div @click="get_patents"
                class="text-xs cursor-pointer hover:bg-purple-200 bg-purple-100 text-purple-500 px-2 rounded-sm">
                Fetch
              </div>
            </div>

            <div class="bg-gray-100 overflow-scroll rounded-md p-2 flex-grow gap-2 flex flex-col text-xs ">
              <div v-if="loading.patents" class="flex h-full items-center justify-center">
                <div
                  class="inline-block text-gray-400 h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]">
                </div>
              </div>
              <a v-else class="p-2 bg-blue-200 hover:bg-blue-300 text-blue-900 rounded-md cursor-pointer"
                v-for=" patent  in  patents?.[page]?.results " :href="patent.url" target="_blank">{{ patent.name
                }}</a>

            </div>
          </div>
          <div class=" flex flex-col custom-container gap-1">

            <label class="text-xs gap-1 flex font-medium">SWOT:<p class="text-gray-400">(Coming soon)</p></label>
            <div class="rounded-md grid grid-rows-2 grid-cols-2 gap-4 custom-container">
              <div class="bg-gray-100 rounded-md p-2 flex-grow flex flex-col overflow-scroll gap-1 "
                v-for="       category        in        swot_categories       ">
                <p class="text-xs font-bold">{{ category }}</p>
                <p class="text-xs" v-for="       element        in        swot[category]       ">- {{ element }}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const loading = ref({ market: false, usecase: false, patent: false, elaborate: false })
const old_usecases = ref([])
const modal_open = ref(false)
const modal_content = ref('')
const usecase_temp = ref(0.2)
const market_parameters = ref({
  temp: 0.2,
  type: 'neural',
  pages: 5,
  characters: 500
})
const patent_parameters = ref({
  temp: 0.2,
  type: 'neural',
  pages: 5,
  characters: 500
})

// const market_format = ref('structured')
const market_analysis = ref({
  0: {
    relevant_market: null,
    market_stats: null,
    dominant_actors: null,
    potential_customers: null,
    freeform: null
  },
  1: {
    relevant_market: null,
    market_stats: null,
    dominant_actors: null,
    potential_customers: null,
    freeform: null
  },
  2: {
    relevant_market: null,
    market_stats: null,
    dominant_actors: null,
    potential_customers: null,
    freeform: null
  },
  3: {
    relevant_market: null,
    market_stats: null,
    dominant_actors: null,
    potential_customers: null,
    freeform: null
  },
  4: {
    relevant_market: null,
    market_stats: null,
    dominant_actors: null,
    potential_customers: null,
    freeform: null,
  },
})

const swot_categories = ['Strengths', 'Weaknesses', 'Opportunities', 'Threats']
const use_case = ref('')
const page = ref(null)
const swot = ref('')
const patents = ref({})
// const name = ref('')
const description = ref('')
const settings_open = ref(false)

async function get_patents() {
  loading.value.patents = true
  patents.value[page.value] = await $fetch('/api/patent_search', {
    method: 'POST',
    body: {
      "idea": description.value,
      "usecase": use_case.value.usecases[page.value].description,
      "parameters": patent_parameters.value
    }
  })
  loading.value.patents = false
}

async function get_market_analysis() {
  // if (market_format.value == 'structured') {
  //   await get_relevant_market(page.value)
  //   await get_market_stats(page.value)
  //   await get_dominant_actors(page.value)
  //   await get_potential_customers(page.value)
  // }
  // else {
  get_free_form(page.value)
  // }
}

function openModal(content) {
  if (content != null) {
    modal_content.value = content
    modal_open.value = true
  } else {
    modal_open.value = true
    settings_open.value = true
  }

}



async function get_free_form(current_page) {
  loading.value.market = true
  market_analysis.value[current_page].freeform = await $fetch('/api/market_freeform', {
    method: 'POST',
    body: {
      "description": use_case.value.usecases[current_page].description,
      "parameters": market_parameters.value
    }
  })
  loading.value.market = false
}

async function get_market_stats(current_page) {
  market_analysis.value[current_page].market_stats = await $fetch('/api/market_stats', {
    method: 'POST',
    body: {
      "market": market_analysis.value[current_page].relevant_market
    }
  })
}

function resetSettings() {
  usecase_temp.value = 0.2
  market_parameters.value.temp = 0.2
  market_parameters.value.type = 'neural'
  market_parameters.value.pages = 5
  market_parameters.value.characters = 500
  patent_parameters.value.temp = 0.2
  patent_parameters.value.type = 'neural'
  patent_parameters.value.pages = 5
  patent_parameters.value.characters = 500
}

async function get_potential_customers(current_page) {
  market_analysis.value[current_page].potential_customers = await $fetch('/api/potential_customers', {
    method: 'POST',
    body: {
      "market": market_analysis.value[current_page].relevant_market,
      "idea": use_case.value.usecases[current_page].description
    }
  })
}

async function get_dominant_actors(current_page) {
  market_analysis.value[current_page].dominant_actors = await $fetch('/api/dominant_actors', {
    method: 'POST',
    body: {
      "market": market_analysis.value[current_page].relevant_market
    }
  })
}

async function get_relevant_market(current_page) {
  market_analysis.value[current_page].relevant_market = await $fetch('/api/relevant_market', {
    method: 'POST',
    body: {
      "description": use_case.value.usecases[current_page].description
    }
  })
}

async function elaborate() {
  loading.value.elaborate = true
  use_case.value.usecases[page.value].description = await $fetch('/api/elaborate', {
    method: 'POST',
    body: {
      "description": use_case.value.usecases[page.value].description,
      "idea": description.value
    }
  })
  loading.value.elaborate = false
}

async function submit() {
  loading.value.usecase = true
  old_usecases.value = []
  use_case.value = await $fetch('/api/usecases', {
    method: 'POST',
    body: {
      "description": description.value,
      "usecase_temp": usecase_temp.value
    }
  })
  loading.value.usecase = false
}

async function other_usecases() {
  loading.value.usecase = true
  use_case.value.usecases?.map(usecase => old_usecases.value.push(usecase.title))
  use_case.value = await $fetch('/api/other_usecases', {
    method: 'POST',
    body: {
      "description": description.value,
      "usecases": old_usecases.value.toString(),
    }
  })
  loading.value.usecase = false
}
</script>
