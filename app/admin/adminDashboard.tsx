// admin/adminDashboard.tsx

'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Category } from '@/types/project'
import { useRouter } from 'next/navigation'
import { Plus, Edit, FileText } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import URL from '@/apiURL'

export default function AdminDashboard() {
    const [pages, setPages] = useState<Category[]>([])
    const [editingPage, setEditingPage] = useState<Category | null>(null)
    const [newPage, setNewPage] = useState({ title: '', description: '' })
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        fetchPages()
    })

    const fetchPages = async () => {
        try {
            const response = await axios.get('https://portfolio-backend-kohl-seven.vercel.app/v1/category/getAll')
            // const response = await axios.get('http://localhost:3000/v1/category/getAll')
            setPages(response.data.data)
        } catch (error) {
            console.error('Error fetching pages:', error)
            toast({ title: 'Error', description: 'Failed to fetch pages', variant: 'destructive' })
        }
    }

    const handleEditPage = (page: Category) => {
        setEditingPage(page)
    }

    const handleNewPage = () => {
        setEditingPage(null)
        setNewPage({ title: '', description: '' })
    }

    const handleSubmitPage = async (e: React.FormEvent) => {
        e.preventDefault()
        const pageData = editingPage ? editingPage : newPage

        try {
            if (editingPage) {
                // await axios.put(`http://localhost:3000/v1/category/update/${editingPage._id}`, pageData)
                await axios.put(`${URL}/category/update/${editingPage._id}`, pageData)
                toast({ title: 'Success', description: 'Page updated successfully', variant: 'default' })
            } else {
                // await axios.post('http://localhost:3000/v1/category', pageData)
                await axios.post(`${URL}/category`, pageData)
                toast({ title: 'Success', description: 'Page created successfully', variant: 'default' })
            }
            fetchPages() // Refresh the list of pages
            setEditingPage(null) // Reset the editing page
            setNewPage({ title: '', description: '' }) // Clear the form fields
        } catch (error) {
            console.error('Error saving page:', error)
            toast({ title: 'Error', description: 'Failed to save page', variant: 'destructive' })
            // Do not alter authentication state here
        }
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Pages Overview</CardTitle>
                        <CardDescription>Manage your website pages</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            {pages.map((page) => (
                                <div
                                    key={page._id}
                                    className="mb-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold">{page.title}</h3>
                                            <p className="text-sm text-muted-foreground">{page.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditPage(page)}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push(`/admin/add-project?categoryId=${page._id}`)}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Content
                                            </Button>
                                        </div>
                                    </div>
                                    <Separator className="my-4" />
                                </div>
                            ))}
                        </ScrollArea>
                        <Button
                            onClick={handleNewPage}
                            className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Page
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{editingPage ? 'Edit Page' : 'Create New Page'}</CardTitle>
                        <CardDescription>{editingPage ? 'Update the details of an existing page' : 'Add a new page to your website'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmitPage}
                            className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="pageTitle"
                                    className="text-sm font-medium">
                                    Page Title
                                </label>
                                <Input
                                    id="pageTitle"
                                    placeholder="Enter page title"
                                    value={editingPage ? editingPage.title : newPage.title}
                                    onChange={(e) =>
                                        editingPage
                                            ? setEditingPage({ ...editingPage, title: e.target.value })
                                            : setNewPage({ ...newPage, title: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="pageDescription"
                                    className="text-sm font-medium">
                                    Page Description
                                </label>
                                <Textarea
                                    id="pageDescription"
                                    placeholder="Enter page description"
                                    value={editingPage ? editingPage.description : newPage.description}
                                    onChange={(e) =>
                                        editingPage
                                            ? setEditingPage({ ...editingPage, description: e.target.value })
                                            : setNewPage({ ...newPage, description: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full">
                                <FileText className="h-4 w-4 mr-2" />
                                {editingPage ? 'Update Page' : 'Create Page'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
