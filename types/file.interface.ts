import { RefObject } from 'react'
export interface CustomFile {
    name: string
    size: number
    type: string
    // Add any other properties you need
}

export interface ServicesProps {
    scrollToSection: (categoryId: string) => void
}
// TODO: this is working if error roll back to below

export interface PagesProps {
    refs: RefObject<{ [key: string]: HTMLDivElement | null }>
}
