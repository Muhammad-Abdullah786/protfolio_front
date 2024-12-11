'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { Project } from '@/components/types/project'
import URL from '@/apiURL'

const ProjectDetail = ({ params }: { params: { projectDetails: string } }) => {
    const { projectDetails } = params
    const [project, setProject] = useState<Project | null>(null)
    const [activeMediaIndex, setActiveMediaIndex] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const response = await axios.get<{ data: Project }>(`${URL}/file/projectDetails/${projectDetails}`)
                setProject(response.data.data)
            } catch (error) {
                alert('Error fetching project data')
            }
        }
        fetchProjectData()
    }, [projectDetails])

    if (!project) return <p className="text-center text-blue-600 p-4">Loading...</p>

    const isVideo = (url: string) => /\.(mp4|avi|mov|mkv)$/.test(url)

    const openModal = (index: number) => {
        setActiveMediaIndex(index)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

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
                                    className={`w-full aspect-video object-cover rounded-lg shadow-md ${
                                        activeMediaIndex === index ? 'block' : 'hidden'
                                    }`}
                                />
                            ) : (
                                <div
                                    key={index}
                                    className={`relative aspect-video overflow-hidden rounded-lg shadow-md ${
                                        activeMediaIndex === index ? 'block' : 'hidden'
                                    }`}>
                                    <Image
                                        src={url}
                                        alt={`Project media ${index + 1}`}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-lg shadow-md cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
                                        onClick={() => openModal(index)}
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-hidden">
                    <div
                        className="relative max-h-screen overflow-y-auto p-4 bg-white rounded-lg"
                        style={{ width: '90%', maxWidth: '1200px' }}>
                        <img
                            src={project.imageUrl[activeMediaIndex]}
                            alt={`Project media ${activeMediaIndex + 1}`}
                            className="cursor-pointer hover:scale-200 transition-transform duration-300 ease-in-out"
                            style={{ maxWidth: '100%', transformOrigin: 'center top' }} // Ensure zoom centers on top
                        />
                        <button
                            onClick={closeModal}
                            className="fixed top-2 right-17 text-white bg-black hover:bg-slate-900 px-3 py-1 rounded-full focus:outline-none">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProjectDetail

// 'use client'

// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import Image from 'next/image'
// import { captureVideoFrame } from '@/utils/animations/generateTumbnail'
// import { Project } from '@/components/types/project'
// import URL from '@/apiURL'

// const ProjectDetail = ({ params }: { params: { projectDetails: string } }) => {
//     const { projectDetails } = params
//     const [project, setProject] = useState<Project | null>(null)
//     const [activeMediaIndex, setActiveMediaIndex] = useState(0)
//     const [isModalOpen, setIsModalOpen] = useState(false)
//     const [videoThumbnails, setVideoThumbnails] = useState<{ [key: number]: string }>({})

//     // Fetch project details
//     useEffect(() => {
//         const fetchProjectData = async () => {
//             try {
//                 const response = await axios.get<{ data: Project }>(`${URL}/file/projectDetails/${projectDetails}`)
//                 setProject(response.data.data)
//             } catch (error) {
//                 alert('Error fetching project data')
//             }
//         }
//         fetchProjectData()
//     }, [projectDetails])

//     const isVideo = (url: string) => /\.(mp4|avi|mov|mkv)$/.test(url)

//     // Generate video thumbnails
//     useEffect(() => {
//         if (project?.imageUrl) {
//             project.imageUrl.forEach((url, index) => {
//                 if (isVideo(url)) {
//                     captureVideoFrame(url, (thumbnailUrl) => {
//                         setVideoThumbnails((prev) => ({ ...prev, [index]: thumbnailUrl }))
//                     })
//                 }
//             })
//         }
//     }, [project?.imageUrl]) // `project.imageUrl` will trigger this hook when available.

//     const openModal = (index: number) => {
//         setActiveMediaIndex(index)
//         setIsModalOpen(true)
//     }

//     const closeModal = () => {
//         setIsModalOpen(false)
//     }

//     if (!project) {
//         return <p className="text-center text-blue-600 p-4">Loading...</p>
//     }

//     return (
//         <div className="max-w-3xl mx-auto px-4 py-8 bg-white">
//             <h1 className="text-3xl font-semibold mb-4 text-blue-800">{project.title}</h1>
//             <p className="mb-6 text-gray-700 leading-relaxed">{project.description}</p>

//             <div className="mb-8">
//                 {project.imageUrl.map((url, index) =>
//                     isVideo(url) ? (
//                         <div
//                             key={index}
//                             className="relative aspect-video overflow-hidden rounded-lg shadow-md">
//                             {videoThumbnails[index] ? (
//                                 <img
//                                     src={videoThumbnails[index]}
//                                     alt={`Thumbnail for video ${index + 1}`}
//                                     className="w-full cursor-pointer"
//                                     onClick={() => openModal(index)}
//                                 />
//                             ) : (
//                                 <p>Loading thumbnail...</p>
//                             )}
//                         </div>
//                     ) : (
//                         <div
//                             key={index}
//                             className="relative aspect-video overflow-hidden rounded-lg shadow-md">
//                             <Image
//                                 src={url}
//                                 alt={`Project media ${index + 1}`}
//                                 layout="fill"
//                                 objectFit="cover"
//                                 className="rounded-lg shadow-md cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
//                                 onClick={() => openModal(index)}
//                             />
//                         </div>
//                     )
//                 )}
//             </div>

//             <div>
//                 <h2 className="text-xl font-semibold mb-3 text-blue-700">Technologies</h2>
//                 <div className="flex flex-wrap gap-2">
//                     {project.technologies.map((tech, index) => (
//                         <span
//                             key={index}
//                             className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
//                             {tech}
//                         </span>
//                     ))}
//                 </div>
//             </div>

//             {/* Modal */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-hidden">
//                     <div
//                         className="relative max-h-screen overflow-y-auto p-4 bg-white rounded-lg"
//                         style={{ width: '90%', maxWidth: '1200px' }}>
//                         <img
//                             src={project.imageUrl[activeMediaIndex]}
//                             alt={`Project media ${activeMediaIndex + 1}`}
//                             className="cursor-pointer hover:scale-200 transition-transform duration-300 ease-in-out"
//                             style={{ maxWidth: '100%', transformOrigin: 'center top' }} // Ensure zoom centers on top
//                         />
//                         <button
//                             onClick={closeModal}
//                             className="fixed top-2 right-17 text-white bg-black hover:bg-slate-900 px-3 py-1 rounded-full focus:outline-none">
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default ProjectDetail
