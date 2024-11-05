// 'use client'
// import { Services } from '@/components/sections'
// import Pages from './projects/page'
// import React, { useRef } from 'react'

// const Home = () => {
//     // Define refs with a type that maps strings to HTMLDivElement or null
//     const refs = useRef<{ [key: string]: HTMLDivElement | null }>({})

//     // Function to scroll to a specific category section
//     const scrollToSection = (categoryId: string) => {
//         const sectionRef = refs.current[categoryId]
//         if (sectionRef) {
//             sectionRef.scrollIntoView({ behavior: 'smooth' })
//         }
//     }

//     return (
//         <div className="flex min-h-[100dvh] flex-col">
//             <main className="flex-1">
//                 <Services scrollToSection={scrollToSection} />
//                 <Pages refs={refs} />
//             </main>
//         </div>
//     )
// }

// export default Home

'use client'
import { Services } from '@/components/sections'
import Pages from './projects/page'
import React, { useRef } from 'react'

const Home = () => {
    // Define refs with a type that maps strings to HTMLDivElement or null
    const refs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    // Function to scroll to a specific category section
    const scrollToSection = (categoryId: string) => {
        const sectionRef = refs.current[categoryId]
        if (sectionRef) {
            sectionRef.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div className="flex min-h-[100dvh] flex-col">
            <main className="flex-1">
                <Services scrollToSection={scrollToSection} />
                <Pages refs={refs} />
            </main>
        </div>
    )
}

export default Home
