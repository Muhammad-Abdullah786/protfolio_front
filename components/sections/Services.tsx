'use client'

import { ArrowRight, Code, Palette, Globe, Smartphone, Settings } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import TextReveal from '@/utils/animations/text-reveal'
import Link from 'next/link'

const Services = () => {
    const services = [
        {
            icon: Code,
            title: 'Web Development',
            description: 'Creating responsive and dynamic web applications using cutting-edge technologies.',
            color: '#00194c'
        },
        {
            icon: Palette,
            title: 'UI/UX Design',
            description: 'Designing intuitive and beautiful user interfaces that enhance user experience.',
            color: '#0055ff'
        },
        {
            icon: Smartphone,
            title: 'Mobile Development',
            description: 'Building cross-platform mobile applications that work seamlessly.',
            color: '#031c50'
        },
        {
            icon: Globe,
            title: 'Digital Solutions',
            description: 'Providing end-to-end digital solutions for modern businesses.',
            color: '#2f3349'
        }
    ]

    return (
        <>
            {/* Services Section - Blue Theme */}
            <div className="bg-gradient-to-b from-blue-50 to-blue-100 pt-16 pb-32 relative z-10">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="space-y-12">
                        {/* Admin Dashboard Button */}
                        <div className="flex justify-end mb-8">
                            {/* <Link
                                href="/admin"
                                passHref>
                                <Button
                                    variant="outline"
                                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                                    <Settings className="w-5 h-5" />
                                    <span>Admin Dashboard</span>
                                </Button>
                            </Link> */}
                        </div>

                        <div className="space-y-4 text-center">
                            <h2 className="text-4xl font-bold tracking-tighter text-[1f2323]">Our Services</h2>
                            <p className="text-[333333] max-w-2xl mx-auto">
                                <TextReveal>
                                    {' '}
                                    We provide comprehensive solutions tailored to meet your digital needs and drive your business forward.
                                </TextReveal>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {services.map((service, index) => (
                                <div
                                    key={service.title}
                                    className="hover:translate-y-[-5px] transition-transform duration-200">
                                    <Card className="border-blue-200 bg-white h-full hover:border-blue-400 transition-all shadow-lg hover:shadow-blue-200">
                                        <CardContent className="p-6 space-y-4">
                                            <div
                                                className="w-12 h-12 rounded-lg flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
                                                style={{ backgroundColor: service.color }}>
                                                <service.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-blue-600">
                                                <TextReveal>{service.title}</TextReveal>
                                            </h3>
                                            <p className="text-blue-600/70">
                                                <TextReveal>{service.description}</TextReveal>
                                            </p>
                                            <div className="flex items-center text-blue-500 font-medium hover:translate-x-1 transition-transform duration-200">
                                                <TextReveal>Learn More</TextReveal> <ArrowRight className="w-4 h-4 ml-2" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Services
