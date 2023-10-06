export type SearchTypeDTO = {
    alias: string
    type: string
    name: string | null
    avatar: string | null
}

export type StateSearch = {
    search: string
    list: SearchTypeDTO[] | null
    error: any | null
}