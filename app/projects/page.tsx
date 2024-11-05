// 'use client'
// import { useState,RefObject, useEffect } from 'react'
// import axios from 'axios'
// import ProductCarousel from '@/components/ProductCarousel'
// import URL from '@/apiURL'

// interface PagesProps {
//     refs: RefObject<{ [key: string]: HTMLDivElement | null }>
// }

// const Pages: React.FC<PagesProps> = ({ refs }) => {
//     const [categories, setCategories] = useState<any[]>([])

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const response = await axios.get(`${URL}/category/getAll`)
//                 setCategories(response.data.data)
//             } catch (error) {
//                 alert('Error fetching categories')
//             }
//         }
//         fetchCategories()
//     }, [])

//     return (
//         <div>
//             {Array.isArray(categories) &&
//                 categories.map((category) => (
//                     <div
//                         key={category._id}
//                         ref={(el) => {
//                             if (refs.current) {
//                                 refs.current[category._id as string] = el
//                             }
//                         }}>
//                         <ProductCarousel
//                             categoryId={category._id}
//                             categoryTitle={category.title}
//                             categoryDisc={category.description}
//                         />
//                     </div>
//                 ))}
//         </div>
//     )
// }

// export default Pages
'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCarousel from '@/components/ProductCarousel'
import URL from '@/apiURL'

// Remove type definition for props
const Pages = ({ refs }: any) => {
    // Use `any` for quick testing
    const [categories, setCategories] = useState<any[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${URL}/category/getAll`)
                setCategories(response.data.data)
            } catch (error) {
                alert('Error fetching categories')
            }
        }
        fetchCategories()
    }, [])

    return (
        <div>
            {Array.isArray(categories) &&
                categories.map((category) => (
                    <div
                        key={category._id}
                        ref={(el) => {
                            if (refs.current) {
                                refs.current[category._id as string] = el
                            }
                        }}>
                        <ProductCarousel
                            categoryId={category._id}
                            categoryTitle={category.title}
                            categoryDisc={category.description}
                        />
                    </div>
                ))}
        </div>
    )
}

export default Pages
