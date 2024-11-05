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
// In your `file.interface.ts` (assuming this is where `PagesProps` is defined)

export interface PagesProps {
    refs: RefObject<{ [key: string]: HTMLDivElement | null }>
}
