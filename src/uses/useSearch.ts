import type { StateSearch } from "@/types/useSearch"
import axios from "axios"
import { reactive } from "vue"


export const useSearch = () => {

    const state = reactive<StateSearch>({

        search: '',
        list: null,

        error: null,
    })

    const getResultSearch = async () => {

        try {
            const { data } = await axios.get(`https://habr.com/kek/v2/publication/suggest-mention?q=${state.search}`)
            state.list = data.data
            state.error = null

            if (!data.data) state.list = null
            
        } catch (e: any) {
            state.error = e.response
            throw e
        }
        
    }

    return {
        state,
        getResultSearch,
    }
}