// export const captureVideoFrame = (videoUrl: string, callback: (thumbnailUrl: string) => void) => {
//     const video = document.createElement('video')
//     video.src = videoUrl
//     video.crossOrigin = 'anonymous'
//     video.currentTime = 1 // Capture the frame at 1 second
//     video.addEventListener('loadeddata', () => {
//         const canvas = document.createElement('canvas')
//         canvas.width = video.videoWidth
//         canvas.height = video.videoHeight
//         const ctx = canvas.getContext('2d')
//         ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
//         callback(canvas.toDataURL('image/jpeg'))
//     })
// }

export const captureVideoFrame = (videoUrl: string, callback: (thumbnailUrl: string) => void) => {
    const video = document.createElement('video')
    video.src = videoUrl
    video.crossOrigin = 'anonymous'

    // Wait for the video to load enough data
    video.addEventListener('loadeddata', () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Increase delay to give video enough time to buffer
        video.currentTime = 3 // Capture at 3 seconds or later

        // Capture the frame when the video reaches the desired time
        video.addEventListener('seeked', () => {
            if (ctx) {
                // Ensure that the video dimensions are valid
                canvas.width = video.videoWidth || 640
                canvas.height = video.videoHeight || 360
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

                // Log the dimensions to ensure proper video and canvas sizes
                console.log(`Captured frame at 3s - Video dimensions: ${canvas.width}x${canvas.height}`)

                // Return the base64-encoded image data URL
                callback(canvas.toDataURL('image/jpeg'))
            }
        })
    })

    // Optional: Add an error listener to capture issues with video loading
    video.addEventListener('error', () => {
        console.error('Error loading video for frame capture:', videoUrl)
        callback('') // If error occurs, return an empty string or fallback thumbnail
    })
}
