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
import URL from '@/apiURL'
// import { AlertState } from '@/components/types/fileInterface'

// Set your Cloudinary cloud name and unsigned upload preset here:
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME ?? ''
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET ?? ''

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
    const router = useRouter()
    const searchParams = useSearchParams()
    const categoryId = searchParams.get('categoryId')

    useEffect(() => {
        if (!categoryId) {
            alert('Error: Category ID is missing.')
            router.push('/admin')
        }
    }, [categoryId, router])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files
        if (selectedFiles) {
            setFiles(Array.from(selectedFiles))
        }
    }

    // Helper to generate a unique upload ID for chunking
    const generateUniqueUploadId = () => {
        return `uqid-${Date.now()}`
    }

    // Chunk upload function
    const uploadChunkedFile = async (file: File) => {
        const chunkSize = 8 * 1024 * 1024 // 5MB
        const totalChunks = Math.ceil(file.size / chunkSize)
        let currentChunk = 0
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

                currentChunk++
                if (currentChunk < totalChunks) {
                    const nextStart = currentChunk * chunkSize
                    const nextEnd = Math.min(nextStart + chunkSize, file.size)
                    return await uploadChunk(nextStart, nextEnd)
                } else {
                    return response.data // Return data when upload completes
                }
            } catch (error) {
                // console.error('Error uploading chunk:', error)
                throw error
            }
        }

        const start = 0
        const end = Math.min(chunkSize, file.size)
        return await uploadChunk(start, end)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!categoryId) {
            alert('Error: Category ID is missing.')
            return
        }

        if (files.length === 0) {
            alert('Error: At least one file is required.')
            return
        }

        setIsLoading(true)

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('title', formData.title)
            formDataToSend.append('description', formData.description)
            formDataToSend.append('technologies', JSON.stringify(formData.technologies))
            formDataToSend.append('categoryId', categoryId)

            // Upload files and get the URLs
            const fileUrls = []
            for (const file of files) {
                const uploadResponse = await uploadChunkedFile(file)
                if (uploadResponse && uploadResponse.url) {
                    // Check if response contains a URL
                    fileUrls.push(uploadResponse.url)
                } else {
                    throw new Error('File upload did not return a URL.') // Throw error if URL is missing
                }
            }

            // Add the URLs to formData
            formDataToSend.append('imageUrl', JSON.stringify(fileUrls))

            // Send the formData (now including image URLs) to the backend
            await axios.post(`${URL}/file/create/${categoryId}`, formDataToSend)

            alert('Success: Project submitted successfully.')
            setFormData({ title: '', description: '', technologies: [] })
            setFiles([])
        } catch (error) {
            alert('Error: An error occurred while submitting the form.')
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
                                            <X size={16} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Submit Project'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
