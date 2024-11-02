'use client'
import { Pages, Services } from '@/components/sections'

import React from 'react'

const Home = () => {
    return (
        <div className="flex min-h-[100dvh] flex-col">
            <main className="flex-1">
                <Services />
                <Pages />
            </main>
        </div>
    )
}

export default Home

