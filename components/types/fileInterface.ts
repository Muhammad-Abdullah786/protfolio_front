import { RefObject } from 'react'
export interface CustomFile {
    name: string
    size: number
    type: string
}

export interface ServicesProps {
    scrollToSection: (categoryId: string) => void
}
// TODO: this is working if error roll back to below

export interface PagesProps {
    // Change from `export default interface` to `export interface`
    refs: RefObject<{ [key: string]: HTMLDivElement | null }>
}
