export interface Project {
    _id: string
    title: string
    description: string
    technologies: string[]
    imageUrl: string[]
    projectUrl?: string
}

export interface ProjectCarouselProps {
    categoryId: string
    categoryTitle: string
    categoryDisc: string
}
export interface Category {
    _id: string
    title: string
    description: string
}
