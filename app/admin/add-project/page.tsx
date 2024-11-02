import React, { Suspense } from 'react'
import SimpleProjectForm from './ProjectForm'

export default function AddProjectPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SimpleProjectForm />
        </Suspense>
    )
}
