'use client'

import { useRef, useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import TextReveal from '@/utils/animations/text-reveal'
import styled, { keyframes } from 'styled-components'
import { ServicesProps } from '@/components/types/fileInterface'
import URL from '@/apiURL'
import { Category } from '@/components/types/project'

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-50%)); }
`

const ScrollContainer = styled.div`
    position: relative;
    width: 100%;
    overflow: hidden;
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
`

const ScrollContent = styled.div`
    display: flex;
    width: fit-content;
    animation: ${scroll} var(--animation-duration) linear infinite;
    gap: 2rem; // Reduced gap between cards

    &:hover {
        animation-play-state: paused;
    }
`

const Services: React.FC<ServicesProps> = ({ scrollToSection }) => {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${URL}/category/getAll`)
                setCategories(response.data.data)
                setIsLoading(false)
            } catch (error) {
                // console.error('Error fetching categories:', error)
                setError('Failed to load services. Please try again later.')
                setIsLoading(false)
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        const scrollContainer = scrollRef.current
        if (scrollContainer && categories.length > 0) {
            const scrollWidth = scrollContainer.scrollWidth
            const animationDuration = 40 * (scrollWidth / 10000) // Adjusted duration for slower scroll
            scrollContainer.style.setProperty('--animation-duration', `${animationDuration}s`)
        }
    }, [categories])

    if (isLoading) {
        return <div className="text-center p-4">Loading...</div>
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>
    }

    const renderCard = (service: Category, index: number) => (
        <div
            key={`${service.title}-${index}`}
            className="flex-shrink-0 w-[350px]">
            <Card className="border-blue-200 bg-white h-full hover:border-blue-400 transition-all shadow-lg hover:shadow-blue-200">
                <CardContent className="p-8 space-y-6 min-h-[320px] flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-blue-600">{service.title}</h3>
                        <div className="text-blue-600/70">
                            <p className="text-lg">
                                {service.description.slice(0, 150)}
                                {service.description.length > 150 && (
                                    <>
                                        .....
                                        <span className="font-semibold text-blue-600 cursor-pointer hover:underline">
                                            <button
                                                onClick={() => scrollToSection(service._id)}
                                                className="read-more-button">
                                                Read More
                                            </button>
                                        </span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    return (
        <div className="bg-gradient-to-b from-blue-50 to-blue-100 pt-16 pb-32 relative z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-8">
                <div className="space-y-16">
                    <div className="space-y-4 text-center">
                        <h2 className="text-5xl font-bold tracking-tighter text-[1f2323]">Our Services</h2>
                        <p className="text-[333333] max-w-2xl mx-auto text-lg">
                            <TextReveal>
                                We provide comprehensive solutions tailored to meet your digital needs and drive your business forward.
                            </TextReveal>
                        </p>
                    </div>

                    <ScrollContainer>
                        <ScrollContent ref={scrollRef}>
                            {categories.map((service, index) => renderCard(service, index))}
                            {categories.map((service, index) => renderCard(service, index + categories.length))}
                        </ScrollContent>
                    </ScrollContainer>
                </div>
            </div>
        </div>
    )
}

export default Services
