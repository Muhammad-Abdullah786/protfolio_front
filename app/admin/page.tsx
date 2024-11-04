// admin/auth.tsx

'use client'

import React, { useState, useEffect } from 'react'
import AdminDashboard from './adminDashboad'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const AdminAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated')
        if (authStatus === 'true') {
            setIsAuthenticated(true)
        }
    }, [])

    const handleLogin = (e: any) => {
        e.preventDefault()
        if (username === 'admin' && password === 'admin') {
            setIsAuthenticated(true)
            localStorage.setItem('isAuthenticated', 'true')
        } else {
            alert('Invalid username or password')
        }
    }

    // Show login form if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle>Admin Login</CardTitle>
                        <CardDescription>Please enter your credentials to access the admin dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleLogin}
                            className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Username is admin"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <Input
                                type="password"
                                placeholder="Password is admin"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button
                                type="submit"
                                className="w-full">
                                Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // If authenticated, render the Admin Dashboard
    return <AdminDashboard />
}

export default AdminAuth
