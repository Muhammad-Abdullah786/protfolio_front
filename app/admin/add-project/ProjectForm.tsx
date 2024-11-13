// 'use client'

// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { X, Upload, Loader2 } from 'lucide-react'
// import URL from '@/apiURL'

// // Set your Cloudinary cloud name and unsigned upload preset here:
// const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME ?? ''
// const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET ?? ''

// if (!CLOUD_NAME || !UPLOAD_PRESET) {
//     console.error('Error: Cloudinary configuration is missing.')
// }

// interface FormData {
//     title: string
//     description: string
//     technologies: string[]
// }

// export default function SimpleProjectForm() {
//     const [formData, setFormData] = useState<FormData>({
//         title: '',
//         description: '',
//         technologies: []
//     })
//     const [files, setFiles] = useState<File[]>([])
//     const [isLoading, setIsLoading] = useState(false)
//     const router = useRouter()
//     const searchParams = useSearchParams()
//     const categoryId = searchParams.get('categoryId')

//     useEffect(() => {
//         if (!categoryId) {
//             alert('Error: Category ID is missing.')
//             router.push('/admin')
//         }
//     }, [categoryId, router])

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedFiles = event.target.files
//         if (selectedFiles) {
//             setFiles(Array.from(selectedFiles))
//         }
//     }

//     // Helper to generate a unique upload ID for chunking
//     const generateUniqueUploadId = () => {
//         return `uqid-${Date.now()}`
//     }

//     // Chunk upload function
//     const uploadChunkedFile = async (file: File) => {
//         const chunkSize = 5 * 1024 * 1024 // 5MB
//         const totalChunks = Math.ceil(file.size / chunkSize)
//         const uniqueUploadId = generateUniqueUploadId()

//         const uploadChunk = async (start: number, end: number) => {
//             const formData = new FormData()
//             formData.append('file', file.slice(start, end))
//             formData.append('cloud_name', CLOUD_NAME)
//             formData.append('upload_preset', UPLOAD_PRESET)

//             const contentRange = `bytes ${start}-${end - 1}/${file.size}`

//             try {
//                 const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, formData, {
//                     headers: {
//                         'X-Unique-Upload-Id': uniqueUploadId,
//                         'Content-Range': contentRange
//                     }
//                 })

//                 if (response.status !== 200) {
//                     throw new Error('Chunk upload failed.')
//                 }

//                 return response.data // Return the response data for this chunk
//             } catch (error) {
//                 console.error('Error uploading chunk:', error)
//                 throw error
//             }
//         }

//         // Create an array of promises to upload each chunk in parallel
//         const chunkUploadPromises = []
//         for (let i = 0; i < totalChunks; i++) {
//             const start = i * chunkSize
//             const end = Math.min(start + chunkSize, file.size)
//             chunkUploadPromises.push(uploadChunk(start, end))
//         }

//         // Wait for all chunks to be uploaded
//         const responses = await Promise.all(chunkUploadPromises)
//         console.log('All chunks uploaded:', responses)
//         return responses[responses.length - 1] // Return the last response as the final file URL or metadata
//     }

//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault()

//         if (!categoryId) {
//             alert('Error: Category ID is missing.')
//             return
//         }

//         if (files.length === 0) {
//             alert('Error: At least one file is required.')
//             return
//         }

//         setIsLoading(true)

//         try {
//             const formDataToSend = new FormData()
//             formDataToSend.append('title', formData.title)
//             formDataToSend.append('description', formData.description)
//             formDataToSend.append('technologies', JSON.stringify(formData.technologies))
//             formDataToSend.append('categoryId', categoryId)

//             // Upload files and get the URLs
//             const fileUrls = []
//             for (const file of files) {
//                 const uploadResponse = await uploadChunkedFile(file) // This will get the URL of the uploaded file
//                 fileUrls.push(uploadResponse.url) // Push the URL to the fileUrls array
//             }

//             // Add the URLs to formData
//             formDataToSend.append('imageUrl', JSON.stringify(fileUrls)) // Send URLs to backend

//             // Send the formData (now including image URLs) to the backend
//             await axios.post(`${URL}/file/create/${categoryId}`, formDataToSend)

//             alert('Success: Project submitted successfully.')
//             setFormData({ title: '', description: '', technologies: [] })
//             setFiles([])
//         } catch (error) {
//             alert('Error: An error occurred while submitting the form.')
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     const addTechnology = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Enter' && formData.technologies.length < 5) {
//             e.preventDefault()
//             const newTech = e.currentTarget.value.trim()
//             if (newTech && !formData.technologies.includes(newTech)) {
//                 setFormData((prev) => ({
//                     ...prev,
//                     technologies: [...prev.technologies, newTech]
//                 }))
//                 e.currentTarget.value = ''
//             }
//         }
//     }

//     const removeTechnology = (techToRemove: string) => {
//         setFormData((prev) => ({
//             ...prev,
//             technologies: prev.technologies.filter((tech) => tech !== techToRemove)
//         }))
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
//             <Card className="max-w-2xl mx-auto shadow-lg">
//                 <CardHeader className="bg-blue-600 text-white">
//                     <CardTitle className="text-2xl font-bold">Submit New Project</CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6">
//                     <form
//                         onSubmit={handleSubmit}
//                         className="space-y-6">
//                         <div>
//                             <Label
//                                 htmlFor="title"
//                                 className="text-blue-800 font-semibold">
//                                 Project Title
//                             </Label>
//                             <Input
//                                 id="title"
//                                 value={formData.title}
//                                 onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
//                                 required
//                                 placeholder="Enter project title"
//                                 className="mt-1 border-blue-200 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>

//                         <div>
//                             <Label
//                                 htmlFor="description"
//                                 className="text-blue-800 font-semibold">
//                                 Description
//                             </Label>
//                             <Textarea
//                                 id="description"
//                                 value={formData.description}
//                                 onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//                                 required
//                                 placeholder="Enter project description"
//                                 rows={4}
//                                 className="mt-1 border-blue-200 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>

//                         <div>
//                             <Label
//                                 htmlFor="file"
//                                 className="text-blue-800 font-semibold">
//                                 Project Files
//                             </Label>
//                             <div className="mt-1 flex items-center">
//                                 <Input
//                                     id="file"
//                                     type="file"
//                                     onChange={handleFileChange}
//                                     multiple
//                                     required
//                                     className="hidden"
//                                 />
//                                 <label
//                                     htmlFor="file"
//                                     className="cursor-pointer flex items-center justify-center w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                                     <Upload className="mr-2 h-5 w-5" />
//                                     Choose Files
//                                 </label>
//                             </div>
//                             {files.length > 0 && <div className="mt-2 text-sm text-blue-600">{files.length} file(s) selected</div>}
//                         </div>

//                         <div>
//                             <Label
//                                 htmlFor="technologies"
//                                 className="text-blue-800 font-semibold">
//                                 Technologies
//                             </Label>
//                             <Input
//                                 id="technologies"
//                                 onKeyDown={addTechnology}
//                                 placeholder="Type and press Enter to add technologies"
//                                 className="mt-1 border-blue-200 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                             <div className="flex flex-wrap gap-2 mt-2">
//                                 {formData.technologies.map((tech) => (
//                                     <span
//                                         key={tech}
//                                         className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
//                                         {tech}
//                                         <button
//                                             type="button"
//                                             onClick={() => removeTechnology(tech)}
//                                             className="ml-2 text-blue-600 hover:text-blue-800">
//                                             <X className="h-4 w-4" />
//                                         </button>
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="flex justify-end">
//                             <Button
//                                 type="submit"
//                                 disabled={isLoading}
//                                 className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300">
//                                 {isLoading ? (
//                                     <>
//                                         <Loader2 className="animate-spin h-5 w-5" />
//                                         <span>Uploading...</span>
//                                     </>
//                                 ) : (
//                                     <span>Submit Project</span>
//                                 )}
//                             </Button>
//                         </div>
//                     </form>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }

'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Upload, Loader2 } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { AlertState } from '@/components/types/fileInterface'
import URL from '@/apiURL'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME ?? ''
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET ?? ''

if (!CLOUD_NAME || !UPLOAD_PRESET) {
    // console.error('Error: Cloudinary configuration is missing.')
}

interface FormData {
    title: string
    description: string
    technologies: string[]
}

export default function SimpleProjectForm() {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        technologies: []
    })
    const [files, setFiles] = useState<File[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [alertState, setAlertState] = useState<AlertState>({
        isOpen: false,
        title: '',
        description: '',
        onClose: () => {}
    })
    const router = useRouter()
    const searchParams = useSearchParams()
    const categoryId = searchParams.get('categoryId')

    useEffect(() => {
        if (!categoryId) {
            showAlert('Error', 'Category ID is missing.', () => router.push('/admin'))
        }
    }, [categoryId, router])

    const showAlert = (title: string, description: string, onClose: () => void = () => {}) => {
        setAlertState({ isOpen: true, title, description, onClose })
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files
        if (selectedFiles) {
            setFiles(Array.from(selectedFiles))
        }
    }

    const generateUniqueUploadId = () => {
        return `uqid-${Date.now()}`
    }

    const uploadChunkedFile = async (file: File) => {
        const chunkSize = 5 * 1024 * 1024
        const totalChunks = Math.ceil(file.size / chunkSize)
        const uniqueUploadId = generateUniqueUploadId()

        const uploadChunk = async (start: number, end: number) => {
            const formData = new FormData()
            formData.append('file', file.slice(start, end))
            formData.append('cloud_name', CLOUD_NAME)
            formData.append('upload_preset', UPLOAD_PRESET)

            const contentRange = `bytes ${start}-${end - 1}/${file.size}`

            try {
                const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, formData, {
                    headers: {
                        'X-Unique-Upload-Id': uniqueUploadId,
                        'Content-Range': contentRange
                    }
                })

                if (response.status !== 200) {
                    throw new Error('Chunk upload failed.')
                }

                return response.data
            } catch (error) {
                // console.error('Error uploading chunk:', error)
                // use alert
                showAlert('Error', 'Failed to upload file.')
                throw error
            }
        }

        const chunkUploadPromises = []
        for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize
            const end = Math.min(start + chunkSize, file.size)
            chunkUploadPromises.push(uploadChunk(start, end))
        }

        const responses = await Promise.all(chunkUploadPromises)
        // console.log('All chunks uploaded:', responses)

        return responses[responses.length - 1]
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!categoryId) {
            showAlert('Error', 'Category ID is missing.')
            return
        }

        if (files.length === 0) {
            showAlert('Error', 'At least one file is required.')
            return
        }

        setIsLoading(true)

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('title', formData.title)
            formDataToSend.append('description', formData.description)
            formDataToSend.append('technologies', JSON.stringify(formData.technologies))
            formDataToSend.append('categoryId', categoryId)

            const fileUrls = []
            for (const file of files) {
                const uploadResponse = await uploadChunkedFile(file)
                fileUrls.push(uploadResponse.url)
            }

            formDataToSend.append('imageUrl', JSON.stringify(fileUrls))

            await axios.post(`${URL}/file/create/${categoryId}`, formDataToSend)

            showAlert('Success', 'Project submitted successfully.', () => {
                setFormData({ title: '', description: '', technologies: [] })
                setFiles([])
            })
        } catch (error) {
            showAlert('Error', 'An error occurred while submitting the form.')
        } finally {
            setIsLoading(false)
        }
    }

    const addTechnology = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && formData.technologies.length < 5) {
            e.preventDefault()
            const newTech = e.currentTarget.value.trim()
            if (newTech && !formData.technologies.includes(newTech)) {
                setFormData((prev) => ({
                    ...prev,
                    technologies: [...prev.technologies, newTech]
                }))
                e.currentTarget.value = ''
            }
        }
    }

    const removeTechnology = (techToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            technologies: prev.technologies.filter((tech) => tech !== techToRemove)
        }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader className="bg-blue-600 text-white">
                    <CardTitle className="text-2xl font-bold">Submit New Project</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6">
                        <div>
                            <Label
                                htmlFor="title"
                                className="text-blue-800 font-semibold">
                                Project Title
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                required
                                placeholder="Enter project title"
                                className="mt-1 border-blue-200 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="description"
                                className="text-blue-800 font-semibold">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                required
                                placeholder="Enter project description"
                                rows={4}
                                className="mt-1 border-blue-200 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="file"
                                className="text-blue-800 font-semibold">
                                Project Files
                            </Label>
                            <div className="mt-1 flex items-center">
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={handleFileChange}
                                    multiple
                                    required
                                    className="hidden"
                                />
                                <label
                                    htmlFor="file"
                                    className="cursor-pointer flex items-center justify-center w-full px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <Upload className="mr-2 h-5 w-5" />
                                    Choose Files
                                </label>
                            </div>
                            {files.length > 0 && <div className="mt-2 text-sm text-blue-600">{files.length} file(s) selected</div>}
                        </div>

                        <div>
                            <Label
                                htmlFor="technologies"
                                className="text-blue-800 font-semibold">
                                Technologies
                            </Label>
                            <Input
                                id="technologies"
                                onKeyDown={addTechnology}
                                placeholder="Type and press Enter to add technologies"
                                className="mt-1 border-blue-200 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => removeTechnology(tech)}
                                            className="ml-2 text-blue-600 hover:text-blue-800">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <span>Submit Project</span>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <AlertDialog
                open={alertState.isOpen}
                onOpenChange={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertState.title}</AlertDialogTitle>
                        <AlertDialogDescription>{alertState.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => {
                                setAlertState((prev) => ({ ...prev, isOpen: false }))
                                alertState.onClose()
                            }}>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
