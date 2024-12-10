import React, { useRef, useState } from 'react';
import './player.scss';
import { BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsSkipEndCircleFill, BsFillSkipEndCircleFill } from 'react-icons/bs';

const Player = ({ audioElem, isplaying, setisplaying, currentSong, setCurrentSong, songs }) => {

  // значение ползунка
  const [musicRange, setMusicRange] = useState(0);

  // место события на разметке (input range)
  const clickRef = useRef();

  // функция паузы и воспроизведения
  const PlayPause = () => {
    setisplaying(!isplaying);
  }

  // проверяет на каком промежутке нахожится ползунов
  const checkWidth = (e) => {
    // отслеживаем значение input range
    const offset = Number(e.target.value);

    // замена значений
    audioElem.current.currentTime = offset;
    setMusicRange(offset);
  }

  // пропуск музыки на предыдущую музыку
  const skipBack = () => {
    const index = songs.findIndex(x => x.title === currentSong.title);
    if (index === 0) {
      setCurrentSong(songs[songs.length - 1])
    }
    else {
      setCurrentSong(songs[index - 1])
    }
    audioElem.current.currentTime = 0;
    setMusicRange(0);
    
  }
  
  
  // пропуск музыки на следующую музыку
  const skiptoNext = () => {
    const index = songs.findIndex(x => x.title === currentSong.title);
    
    if (index === songs.length - 1) {
      setCurrentSong(songs[0])
    }
    else {
      setCurrentSong(songs[index + 1])
    }
    audioElem.current.currentTime = 0;
    setMusicRange(0);

  }

  return (
    <div className='player_container'>
      <div className="title">
        <p>{currentSong.title}</p>
      </div>
      <div className="navigation">
        <div className="navigation_wrapper">
          <input type="range" min={0} max={currentSong.length} defaultValue={0} value={musicRange} onChange={checkWidth} ref={clickRef}/>
        </div>
      </div>
      <div className="controls">
        <BsFillSkipStartCircleFill className='btn_action' onClick={skipBack} />
        {isplaying ? <BsFillPauseCircleFill className='btn_action pp' onClick={PlayPause} /> : <BsFillPlayCircleFill className='btn_action pp' onClick={PlayPause} />}
        <BsFillSkipEndCircleFill className='btn_action' onClick={skiptoNext} />
      </div>
    </div>

  )
}

export default Player