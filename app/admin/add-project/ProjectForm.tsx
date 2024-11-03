// 'use client'

// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Label } from '@/components/ui/label'
// import { useToast } from '@/hooks/use-toast'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { X, Upload } from 'lucide-react'
// import URL from '@/apiURL'

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
//     const { toast } = useToast()
//     const router = useRouter()
//     const searchParams = useSearchParams()
//     const categoryId = searchParams.get('categoryId')

//     useEffect(() => {
//         // Redirect or show an error if no categoryId is found
//         if (!categoryId) {
//             toast({
//                 title: 'Error',
//                 description: 'Category ID is missing.',
//                 variant: 'destructive'
//             })
//             router.push('/admin')
//         }
//     }, [categoryId, router, toast])

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedFiles = event.target.files
//         if (selectedFiles) {
//             setFiles(Array.from(selectedFiles))
//         }
//     }

//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault()

//         if (!categoryId) {
//             toast({
//                 title: 'Error',
//                 description: 'Category ID is missing.',
//                 variant: 'destructive'
//             })
//             return
//         }

//         if (files.length === 0) {
//             toast({
//                 title: 'Error',
//                 description: 'At least one file is required.',
//                 variant: 'destructive'
//             })
//             return
//         }

//         const formDataToSend = new FormData()
//         formDataToSend.append('title', formData.title)
//         formDataToSend.append('description', formData.description)
//         formDataToSend.append('technologies', JSON.stringify(formData.technologies))
//         formDataToSend.append('categoryId', categoryId)

//         files.forEach((file) => {
//             formDataToSend.append('files', file)
//         })

//         try {
//             // const response = await axios.post(`${URL}/file/create/${categoryId}`, formDataToSend, {
//             const response = await axios.post(`http://localhost:3000/v1/file/create/${categoryId}`, formDataToSend, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             })
//             console.log(response.data)
//             // alert('Project submitted successfully.')
//             toast({
//                 title: 'Success!',
//                 description: 'Project submitted successfully.'
//             })

//             setFormData({ title: '', description: '', technologies: [] })
//             setFiles([])
//             // router.push('/admin')
//         } catch (error) {
//             console.error('Error submitting project:', error)
//             // alert('An error occurred while submitting the form.')
//             toast({
//                 title: 'Error',
//                 description: 'An error occurred while submitting the form.',
//                 variant: 'destructive'
//             })
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

//                         <Button
//                             type="submit"
//                             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
//                             Submit Project
//                         </Button>
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
import URL from '@/apiURL'

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

        const formDataToSend = new FormData()
        formDataToSend.append('title', formData.title)
        formDataToSend.append('description', formData.description)
        formDataToSend.append('technologies', JSON.stringify(formData.technologies))
        formDataToSend.append('categoryId', categoryId)

        files.forEach((file) => {
            formDataToSend.append('files', file)
        })

        try {
            const response = await axios.post(`${URL}file/create/${categoryId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(response.data)
            alert('Success: Project submitted successfully.')

            setFormData({ title: '', description: '', technologies: [] })
            setFiles([])
        } catch (error) {
            console.error('Error submitting project:', error)
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
                                            <X className="h-4 w-4" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                            disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Project'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-64">
                        <CardContent className="flex flex-col items-center justify-center p-4">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <p className="mt-2 text-lg font-semibold text-blue-800">Creating Project...</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
