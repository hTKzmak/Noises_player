import React, { useEffect, useRef, useState } from 'react';
import './player.scss';
import { BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsFillSkipEndCircleFill } from 'react-icons/bs';
import { ReactComponent as Volume } from '../assets/volume.svg'
import { ReactComponent as VolumeOff } from '../assets/volume_off.svg'
import { ReactComponent as VolumeHalf } from '../assets/volume_half.svg'
import { ReactComponent as MixOff } from '../assets/mix_off.svg'
import { ReactComponent as MixOn } from '../assets/mix_on.svg'
import { ReactComponent as Download } from '../assets/download.svg'
import { ReactComponent as RepeatOff } from '../assets/repeat_off.svg'
import { ReactComponent as RepeatList } from '../assets/repeat_list.svg'
import { ReactComponent as RepeatMusic } from '../assets/repeat_music.svg'

const Player = ({ audioElem, isplaying, setIsPlaying, currentSong, setCurrentSong, songs, mixMusicFunc, mixMusic, setMixMusic }) => {

  // место события на разметке (input range)
  const inputRef = useRef();

  const volumeRef = useRef();
  const [showVolume, setShowVolume] = useState(false);

  // значение громкости
  const [volumeCount, setVolumeCount] = useState(1);

  // повторение музыки (1 - не повторяется ни список, ни музыка; 2 - повторяется только список; 3 - повторяется только трек)
  const [repeatValue, setRepeatValue] = useState(1)

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

    // Если перемешивание выключено, переходим к следующей песне
    if (mixMusic) {
      mixMusicFunc()
    }
    else {
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

  // функционал перемешивания музыки в App.js (MixMusicFunc)

  // измение значения repeatValue для 3-х кликов, для повторения воспроизведения музыки
  const repeatChangerFunc = () => {
    switch (repeatValue) {
      case 1:
        setRepeatValue(2)
        break
      case 2:
        setRepeatValue(3)
        break
      case 3:
        setRepeatValue(1)
        break
      default:
        setRepeatValue(1)
        break
    }
  }

  // // тут нужно сделать функционал повтора музыки
  // useEffect(() => {
  //   if (currentSong.length === currentSong.progress) {
  //     if (repeatValue === 1) {
  //       // отсутствие повтора
  //     }
  //     else if (repeatValue === 2) {
  //       // повтор списка
  //     }
  //     else {
  //       // повтор музыки (база)
  //     }
  //   }
  // }, [repeatValue])

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
          {(() => {
            if (volumeCount === '0') {
              return (
                <VolumeOff />
              )
            } else if (volumeCount <= '0.5') {
              return (
                <VolumeHalf />
              )
            } else {
              return (
                <Volume />
              )
            }
          })()}
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
              audioElem.current.volume = e.target.value
              setVolumeCount(e.target.value)
            }}
          />
        )
          :
          (
            <>
              <button onClick={() => repeatChangerFunc()}>
                {/* {repeatValue ? <RepeatOff /> : <RepeatList />} */}
                {(() => {
                  if (repeatValue === 1) {
                    return (
                      <RepeatOff />
                    )
                  } else if (repeatValue === 2) {
                    return (
                      <RepeatList />
                    )
                  } else {
                    return (
                      <RepeatMusic />
                    )
                  }
                })()}
              </button>
              <button onClick={() => { setMixMusic(!mixMusic) }}>
                {mixMusic === false ? <MixOff /> : <MixOn />}
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