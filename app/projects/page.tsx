'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import TextReveal from '@/utils/animations/text-reveal'
import { useRouter } from 'next/navigation'
import { Project, ProjectCarouselProps } from '@/types/project'

const ProductCarousel: React.FC<ProjectCarouselProps> = ({ categoryId, categoryTitle, categoryDisc }) => {
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>([])

    // check kya ye video hai ya image
    const isVideo = (url: string) => {
        const videoExtensions = ['mp4', 'webm', 'ogg']
        return videoExtensions.some((extension) => url.endsWith(extension))
    }

    const handleCardClick = (projectCardID: number) => {
        router.push(`/projects/${projectCardID}`)
    }

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/v1/file/allProducts/category/${categoryId}`)
                setProjects(response?.data)
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching projects:', error)
            }
        }
        fetchProjects()
    }, [categoryId])

    const titleWords = categoryTitle.split(' ')
    return (
        <div className="bg-white relative -mt-20 rounded-t-[3rem] shadow-2xl">
            <div className="max-w-7xl mx-auto px-8 pt-32 pb-16">
                <div className="space-y-4 mb-16">
                    <h1 className="text-6xl font-bold tracking-tighter text-[1f2323]">
                        {titleWords.map((word, index) => (
                            <TextReveal key={index}>{word} </TextReveal>
                        ))}
                    </h1>
                    <p className="text-[333333] text-lg">
                        <TextReveal>{categoryDisc}</TextReveal>
                    </p>
                </div>

                {/* Projects Carousel - Fixed Version */}
                <div className="relative">
                    <Carousel
                        opts={{
                            align: 'start',
                            loop: true,
                            dragFree: true,
                            skipSnaps: false
                        }}
                        className="w-full">
                        <div className="relative flex items-center">
                            <CarouselContent className="-ml-2 md:-ml-4">
                                {projects &&
                                    Array.isArray(projects) &&
                                    projects.map((project, index) => (
                                        <CarouselItem
                                            key={project._id}
                                            className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                                            onClick={() => handleCardClick(project._id)}>
                                            <div className="h-full">
                                                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none overflow-hidden h-full shadow-xl hover:shadow-2xl transition-shadow duration-300">
                                                    <CardContent className="p-0 flex flex-col h-full">
                                                        <div className="aspect-[4/3] relative overflow-hidden">
                                                            <img
                                                                src={
                                                                    isVideo(project.imageUrl[0]) && project.imageUrl[1]
                                                                        ? project.imageUrl[1]
                                                                        : project.imageUrl[0]
                                                                }
                                                                alt={`${project.title} preview`}
                                                                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                                                            />
                                                        </div>
                                                        <div className="p-6 space-y-4 flex flex-col flex-grow bg-white/10 backdrop-blur-sm">
                                                            <h3 className="text-xl font-semibold text-white">
                                                                <TextReveal>{project.title}</TextReveal>
                                                            </h3>
                                                            <p className="text-sm text-blue-50/90 flex-grow">
                                                                <TextReveal>{project.description}</TextReveal>
                                                            </p>
                                                            <div className="flex flex-wrap gap-2 mt-auto">
                                                                {project.technologies.map((tech) => (
                                                                    <span
                                                                        key={tech}
                                                                        className="px-3 py-1 text-xs rounded-full bg-white/20 text-white backdrop-blur-sm">
                                                                        <TextReveal>{tech}</TextReveal>
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                            </CarouselContent>

                            <div className="absolute left-0 right-0 w-full">
                                <CarouselPrevious className="absolute -left-16 top-1/2 -translate-y-1/2 bg-blue-600 text-white hover:bg-blue-700 border-none z-10" />
                                <CarouselNext className="absolute -right-16 top-1/2 -translate-y-1/2 bg-blue-600 text-white hover:bg-blue-700 border-none z-10" />
                            </div>
                        </div>
                    </Carousel>
                </div>
            </div>
        </div>
    )
}

export default ProductCarousel
