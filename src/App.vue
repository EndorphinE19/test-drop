<script setup lang="ts">
import { watch } from 'vue'
import UiSelect from '@/components/ui/select/index.vue'
import { useSearch } from '@/uses/useSearch'
import { debounce } from '@/helpers/debounce'
import { errorProcessing } from '@/helpers/error'

/**
 * Хук для работы с поиском
 */
 const {
    state,
    getResultSearch,
} = useSearch()

const getResultSearchDeb = debounce(getResultSearch, 300)

watch(() => state.search, () => {
    if (state.search) getResultSearchDeb()
})

</script>
<template>
  <div class="wrapper">
    <UiSelect
    v-model="state.search"
    :list="state.list">
      <template #error>
        <span
        v-if="state.error"
        class="slot-error">{{ errorProcessing(state.error) }}</span>
      </template>
    </UiSelect>
  </div>  
</template>
<style scoped lang="scss">

.wrapper {
  margin: 0 auto;
  max-width: 1280px;
  width: 100%;
}

.slot-error {
  color: red;
}
</style>