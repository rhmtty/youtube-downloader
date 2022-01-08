import { useEffect, useState } from 'react'
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import Videos from "./Videos";
import axios from 'axios'

const URL = 'https://server-youtube-downloader.herokuapp.com/'

const notify = (msg, { success }) => {
    if(success) {
        return toast.success(msg)
    }
    return toast.error(msg)
}

const socket = io(URL)

const Home = () => {
    const[videos, setVideos] = useState([])

    useEffect(() => {
        socket.on('VIDEO_DONWLOADED', data => {
            notify(`${data} Downloaded`, { success: true })
            window.location.reload()
        })

        socket.on('VIDEO_STARTED', data => {
            notify(`Download Started ${data}`, { success: true })
        })

        axios.get(`${URL}api/downloads`)
            .then(res => {
                setVideos(res.data)
            }).catch(error => {
                console.log(error)
            })
    }, [])

    const downloadVideo = event => {
        event.preventDefault()

        const youtubeUrl = event.target.elements.youtubeUrl.value

        axios.post(`${URL}api/downloads`, { youtubeUrl })
            .then(res => {
                notify('Fetching video details...', { success: true })
            })
            .catch(error => {
                notify('Something went wrong', { success: false })
            })
    }

    return (
        <div>
            <div className="p-5 mb-4 bg-light rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">
                        Download Your favorite Youtube videos
                    </h1>
                </div>
                <form onSubmit={downloadVideo}>
                    <div>
                        <label for="youtubeUrl" className="form-label">Enter Link</label>
                        <input type="url" id="youtubeUrl" className="form-control" required/>
                        <div id="urlHelpBlock" className="form-text">
                            E.g https://www.youtube.com/watch?v=PCicKydX5GE
                        </div>
                        <br />
                        <button type='submit' className="btn btn-primary btn-lg">Download</button>
                        <Toaster />
                    </div>
                </form>
            </div>
            <h3>Downloaded Videos</h3>
            <div className='row' style={{ margin: 10 }}>
                {videos.map(video => {
                    return <Videos video={video} />
                })}
            </div>
        </div>
    )
}

export default Home;