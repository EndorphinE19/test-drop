<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { SearchTypeDTO } from '@/types/useSearch'
import { defaultImage } from '@/constans/image'

const emit = defineEmits(['update:modelValue', 'filled'])

const {
    limit,
    theme,
    list,
    modelValue,
} = defineProps<{
    limit?: number,
    theme?: string,
    list: SearchTypeDTO[] | null,
    modelValue: string,
}>()

const value = computed({
  get() {
    return modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})


/**
 * Показываем Dropdown
 */
const visibleDropdown = ref<boolean>(false)
const switchDropdown = () => {
    if (list) visibleDropdown.value = !visibleDropdown.value  
} 

/**
 * Выбранные пользватели/компании
 */
const selectedElem = ref<SearchTypeDTO[]>([])
const addSelected = (elem: SearchTypeDTO) => {
    if (selectedElem.value.length < 3) {
        if (selectedElem.value.every(item => item.alias !== elem.alias)) selectedElem.value.push(elem)
    }
}
const addSelectElemKey = (event: Event) => {

    if (event.keyCode === 13) {
        const elem = document.querySelector('.hover')
        const data = elem && JSON.parse(String(elem.getAttribute('data-elem')))
        addSelected(data)
    }
    
}

/**
 * Очищаем выбранное значение
 */
const removeSelectedElem = (alias: string) => {
    selectedElem.value = selectedElem.value.filter(item => item.alias !== alias)
}

watch(() => list, () => {
    if (list && Array.isArray(list)) switchDropdown()
    addEventKey()
})

/**
 * Закрытие dropdown вне окна
 */
 const handlerClickDocument = (event: Event) => {
  const itsElement = /dropdown/.test(event.target.className)
  if (visibleDropdown.value && !itsElement) switchDropdown()
}

/**
 * Взаимодействие с клавитурой
 */
const countActiveElem = ref<number>(0)
const handlerKeyElem = (event: Event) => {
    const listChildElem = event.target.nextSibling.childNodes;

    if (event.keyCode === 40) {
        const prev = listChildElem[countActiveElem.value].previousSibling

        if (list && (countActiveElem.value < list.length)) countActiveElem.value++
        if ('classList' in listChildElem[countActiveElem.value]) listChildElem[countActiveElem.value].classList.add('hover')
        if (prev && listChildElem[countActiveElem.value].previousSibling.classList.contains('hover')) listChildElem[countActiveElem.value].previousSibling.classList.remove('hover')
        
    }
    if (event.keyCode === 38) {
        const next = listChildElem[countActiveElem.value].previousSibling

        if (list && (countActiveElem.value > 1)) countActiveElem.value--
        if (next && listChildElem[countActiveElem.value].nextSibling.classList.contains('hover')) listChildElem[countActiveElem.value].nextSibling.classList.remove('hover')
        if ('classList' in listChildElem[countActiveElem.value]) listChildElem[countActiveElem.value].classList.add('hover')
        
    }

}
const addEventKey = () => {
   document.addEventListener('keyup', handlerKeyElem, false)
   document.addEventListener('keyup', addSelectElemKey, false)
}

/**
 * Приводим к строке текущий элемент в итерации
 */
const formattingElemInString = (item: SearchTypeDTO) => JSON.stringify(item)

onMounted(() => {
    document.addEventListener('click', handlerClickDocument, false)
})

onUnmounted(() => {
    document.removeEventListener('click', handlerClickDocument, false)
    document.removeEventListener('keyup', handlerKeyElem, false)
})

</script>
<template>
    <div class="select">
        <h3 class="select__subtitle">
            <span class="select__require">*</span>
            Пользователь или компания
        </h3>
        <slot name="error"></slot>
        <label for="search"></label>
        <div
        @click.stop="switchDropdown"
        class="search"
        :class="{ 'search-min': theme === 'theme-min' }">
            <template v-if="selectedElem.length">
                <div
                v-for="item in selectedElem"
                :key="item.alias"
                class="select__chips chips">
                    {{ item.alias }}
                    <div
                    @click.stop="removeSelectedElem(item.alias)"
                    class="chips__delete">&#10006;</div>
                </div>
            </template>
            <input v-model="value" id="search" class="select__search" type="text"/>
            <div v-if="visibleDropdown" class="dropdown search__dropdown">
                <div
                v-for="item in list"
                :key="item.alias"
                @click.stop="addSelected(item)"
                class="dropdown__elem"
                :data-elem="formattingElemInString(item)">
                    <img class="dropdown__avatar" :src="item.avatar || defaultImage.stubImage" alt="">
                    <div class="dropdown__info">
                        <div class="dropdown__info-title">
                            {{ item.name || item.alias }}
                        </div>
                        <div class="dropdown__info-subtitle">
                            @{{ item.type === 'company' ? 'Компания' : item.alias }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>
<style lang="scss" scoped>
.select {

    width: 100%;
    min-width: 300px;
    height: 45px;

    &__search {
        appearance: none;
        border: none;
        width: 100%;
        height: 100%;
    }

    &__require {
        color: red;
    }

    &__subtitle {
        padding-bottom: 10px;
        font: {
            size: 13px;
            weight: bold;
        }
    }
}

.search {
    position: relative;
    border: 1px solid var(--main-color);
    width: auto;
    height: 100%;
    padding: 10px;
    
    display: flex;
    justify-content: flex-start;
    align-items: center;

    & > input {
        padding-left: 15px;
        outline: none;
    }

    &-min {

        border: none;
        border-bottom: 1px solid var(--main-color);

    }
}

.dropdown {
    position: absolute;
    left: 0;
    top: calc(100% + 20px);

    width: 100%;
    min-width: 300px;
    height: 320px;
    box-shadow: 0 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, .2)),0 1px 1px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .14)),0 1px 3px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, .12));
    overflow-y: auto;

    &__elem {
        max-height: 80px;

        display: flex;
        justify-content: flex-start;
        align-items: center;

        padding: 15px;

        transition: .1s linear;

        &:hover {
            cursor: pointer;
            background: rgba(var(--main-color-rgb), .1);
        }
    }

    &__info {
        padding-left: 20px;

        &-title {
            font: {
                size: 15px;
                weight: bold;
            }
        }

        &-subtitle {
            color: var(--main-color);
            font-size: 12px;
        }
    }

    &__avatar {
        width: 50px;
        height: 50px;
    }
}

.chips {
    background: var(--main-color);
    border-radius: 5px;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    color: white;

    margin-right: 5px;
    padding: 3px 10px;

    &__delete {
        cursor: pointer;
        padding-left: 5px;
        
        font-size: 10px;
    }

}

.hover {
    cursor: pointer;
    background: rgba(var(--main-color-rgb), .1);
}
</style>