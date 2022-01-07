import axios from "axios";
const FileDownload = require('js-file-download')

const URL = 'http://localhost:3000'

const VideoDownloader = props => {
    console.log(props);
    const { video } = props
    const { _id, title, thumbnail } = video

    const downloadVideo =  async event => {
        const videoId = event.target.id
        const filename = event.target.title
        console.log(filename);

        axios.get(`${URL}/api/downloads/${videoId}/downloadfile`, {
            responseType: 'blob'
        }).then(response => {
            FileDownload(response.data, `${filename}.mp4`)
        })
    }

    const removeVideo = async event => {
        const videoId = event.target.title
        axios.delete(`${URL}/api/downloads/${videoId}`)
            .then(response => {
                window.location.reload()
            })
    }

    return (
        <div className="card" style={{ width: '18rem' }}>
            <img src={thumbnail} alt='thumbnail' class="card-img-top" />
            <div className="card-body">
                <h6 className="card-text">{title}</h6>
                <button id={_id} className="btn btn-success rounded" style={{ width: '100px' }} onClick={downloadVideo} title={title}>Download</button>
                <button title={_id} className="btn btn-danger rounded" onClick={removeVideo}>Delete</button>
            </div> 
        </div>
    )
}

export default VideoDownloader