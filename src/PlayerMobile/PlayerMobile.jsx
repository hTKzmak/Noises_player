import './playerMobile.scss';
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from 'react-icons/bs';
import { IoClose } from "react-icons/io5";


const PlayerMobile = ({ isplaying, setIsPlaying, currentSong, setShowPlayer, showMobilePlayer, setShowMobilePlayer }) => {

    // функция паузы и воспроизведения
    const PlayPause = () => {
        setIsPlaying(!isplaying);
    }

    const removePlayer = () => {
        setIsPlaying(false)
        setShowPlayer(false)
        setShowMobilePlayer(false)
    }

    return (
        <div className="playerMobile_container" style={{display: showMobilePlayer && window.innerWidth <= 768 ? 'flex' : 'none'}} onClick={() => setShowPlayer(true)}>
            {isplaying ?
                <button onClick={(e) => { e.stopPropagation(); PlayPause(); }}>
                    <BsFillPauseCircleFill className='btn_action pp' />
                </button>
                :
                <button onClick={(e) => { e.stopPropagation(); PlayPause(); }}>
                    <BsFillPlayCircleFill className='btn_action pp' />
                </button>
            }

            <div className="music_info_text">
                <p className='title'>{currentSong.title}</p>
                <p className='artist'>{currentSong.artist}</p>
            </div>

            <button onClick={(e) => { e.stopPropagation(); removePlayer(); }}>
                <IoClose className='btn_action' />
            </button>
        </div>
    )
}

export default PlayerMobile 