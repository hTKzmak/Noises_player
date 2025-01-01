import React, { useEffect, useRef, useState } from 'react';
import './player.scss';
import { BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsFillSkipEndCircleFill } from 'react-icons/bs';
import { ReactComponent as Volume } from '../assets/volume.svg'
import { ReactComponent as Mix } from '../assets/mix.svg'
import { ReactComponent as MixOn } from '../assets/mix_on.svg'
import { ReactComponent as Repeat } from '../assets/repeat.svg'
import { ReactComponent as Download } from '../assets/download.svg'

const Player = ({ audioElem, isplaying, setIsPlaying, currentSong, setCurrentSong, songs }) => {

  // место события на разметке (input range)
  const inputRef = useRef();

  const volumeRef = useRef();
  const [showVolume, setShowVolume] = useState(false);
  const [volumeCount, setVolumeCount] = useState(1);

  const [mixMusic, setMixMusic] = useState(false);

  // функция паузы и воспроизведения
  const PlayPause = () => {
    setIsPlaying(!isplaying);
  }

  // проверяет на каком промежутке нахожится ползунов
  const checkWidth = (e) => {
    // отслеживаем значение input range
    const offset = Number(e.target.value);

    // замена значений текущего времени аудио файла на значение ползунка
    audioElem.current.currentTime = offset;

    // Обновляем состояние currentSong
    setCurrentSong({
      ...currentSong,
      progress: offset, // значение ползунка
      length: audioElem.current.duration // Убедимся, что длина актуальна
    });
  }

  // стилизуем фон ползунка
  useEffect(() => {
    const ratio = (inputRef.current.value / currentSong.length) * 100 || 0;

    const activeColor = "#f7f7f7";
    const inactiveColor = "#626262";

    inputRef.current.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`

  }, [currentSong.progress, currentSong.length]);

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
  }

  // пропуск музыки на следующую музыку
  const skiptoNext = () => {
    const index = songs.findIndex(x => x.title === currentSong.title);

    if (mixMusic) {
      // Если перемешивание включено, выбираем случайную песню
      mixMusicFunc()
    } else {
      // Если перемешивание выключено, переходим к следующей песне
      if (index === songs.length - 1) {
        setCurrentSong(songs[0]);
      } else {
        setCurrentSong(songs[index + 1]);
      }
    }

    audioElem.current.currentTime = 0; // Сброс времени проигрывания
  };



  // ОПЦИИ:
  // скачивание файла
  const downloadMusicFunc = async () => {
    const a = document.createElement('a');
    a.href = currentSong.url;
    a.download = 'filename'; // Укажите нужное имя файла
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // перемешивание музыки 
  const mixMusicFunc = () => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    setCurrentSong(songs[randomIndex]);
  }

  useEffect(() => {
    if (mixMusic && currentSong.progress === currentSong.length) {
      mixMusicFunc()
    }
  }, [currentSong.length, currentSong.progress, mixMusic, mixMusicFunc])

  return (
    <div className='player_container'>
      <div className="controls">
        <button onClick={skipBack}>
          <BsFillSkipStartCircleFill className='btn_action' />
        </button>
        {isplaying ?
          <button onClick={PlayPause}>
            <BsFillPauseCircleFill className='btn_action pp' />
          </button>
          :
          <button onClick={PlayPause}>
            <BsFillPlayCircleFill className='btn_action pp' />
          </button>
        }
        <button onClick={skiptoNext}>
          <BsFillSkipEndCircleFill className='btn_action' />
        </button>
      </div>
      <div className="info-and-navigation">
        <div className="music_info">
          <img src={currentSong.artwork} alt="#" />
          <div className="music_info_text">
            <p className='title'>{currentSong.title}</p>
            <p className='artist'>{currentSong.artist}</p>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={currentSong.length}
          value={currentSong.progress || 0}
          onChange={checkWidth}
          ref={inputRef}
        />
      </div>
      <div className="options">
        <button onClick={() => setShowVolume(!showVolume)}>
          <Volume />
        </button>

        {showVolume ? (
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volumeCount}
            ref={volumeRef}
            onChange={(e) => {
              setVolumeCount(e.target.value)
              audioElem.current.volume = e.target.value
            }}
          />
        )
          :
          (
            <>
              <button>
                <Repeat />
              </button>
              <button onClick={() => { setMixMusic(!mixMusic) }}>
                {mixMusic === false ? <Mix /> : <MixOn />}
              </button>
              <button onClick={downloadMusicFunc}>
                <Download />
              </button>
            </>
          )
        }
      </div>
    </div >

  )
}

export default Player