'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCarousel from '@/components/ProductCarousel'
const Pages = () => {
    const [categories, setCategories] = useState<any[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3000/v1/category/getAll')
                setCategories(response.data.data)
                // console.log(response.data.data)
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }
        fetchCategories()
    }, [])

    return (
        <div>
            {Array.isArray(categories) &&
                categories.map((category) => (
                    <div key={category._id}>
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
