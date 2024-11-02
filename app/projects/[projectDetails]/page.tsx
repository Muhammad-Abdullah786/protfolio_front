'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { Project } from '@/types/project'

const ProjectDetail = ({ params }: { params: { projectDetails: string } }) => {
    const { projectDetails } = params
    const [project, setProject] = useState<Project | null>(null)
    const [activeMediaIndex, setActiveMediaIndex] = useState(0)

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const response = await axios.get<{ data: Project }>(`http://localhost:3000/v1/file/projectDetails/${projectDetails}`)
                setProject(response.data.data)
            } catch (error) {
                console.error('Error fetching project data:', error)
            }
        }
        fetchProjectData()
    }, [projectDetails])

    if (!project) return <p className="text-center text-blue-600 p-4">Loading...</p>

    const isVideo = (url: string) => /\.(mp4|avi|mov|mkv)$/.test(url)

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 bg-white">
            <h1 className="text-3xl font-semibold mb-4 text-blue-800">{project.title}</h1>
            <p className="mb-6 text-gray-700 leading-relaxed">{project.description}</p>

            <div className="mb-8">
                {project.imageUrl.length > 0 && (
                    <div className="relative">
                        {project.imageUrl.map((url, index) =>
                            isVideo(url) ? (
                                <video
                                    key={index}
                                    src={url}
                                    controls
                                    className={`w-full aspect-video object-cover rounded-lg shadow-md ${activeMediaIndex === index ? 'block' : 'hidden'}`}
                                />
                            ) : (
                                <div
                                    key={index}
                                    className={`relative aspect-video ${activeMediaIndex === index ? 'block' : 'hidden'}`}>
                                    <Image
                                        src={url}
                                        alt={`Project media ${index + 1}`}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-lg shadow-md"
                                    />
                                </div>
                            )
                        )}
                        <div className="flex justify-center space-x-3 mt-4">
                            {project.imageUrl.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveMediaIndex(index)}
                                    className={`w-4 h-4 rounded-full transition-colors ${
                                        activeMediaIndex === index ? 'bg-blue-500' : 'bg-blue-200 hover:bg-blue-300'
                                    }`}
                                    aria-label={`View media ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3 text-blue-700">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProjectDetail
