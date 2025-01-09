import './App.css';
import Player from './Player/Player';
import { songsdata } from './Player/audios';
import { useRef, useState, useEffect, useCallback } from 'react';

const App = () => {
  const [songs, setSongs] = useState(songsdata);
  const [isplaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(songsdata[0]);

  // место события на разметке (audio тег)
  const audioElem = useRef();

  // воспроизведение и остановка музыки
  useEffect(() => {
    if (isplaying) {
      audioElem.current.play();
    }
    else {
      audioElem.current.pause();
    }
  }, [isplaying, currentSong])

  // функция по обновлению времени музыки
  const onPlaying = () => {
    // длина аудио-файла
    const duration = audioElem.current.duration || 0;
    // текущее время аудио-фалйа
    const ct = audioElem.current.currentTime || 0;

    // обновление данных => progress: текущее значение музыки (может быть 0 или другое), length: длина аудио-файла
    setCurrentSong({ ...currentSong, "progress": ct, "length": duration })
  }

  // перемешивание музыки
  const mixMusicFunc = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    setCurrentSong(songs[randomIndex]);
    console.log(randomIndex);
  }, [setCurrentSong, songs]);

  return (
    <div className="App">
      <audio src={currentSong.url} ref={audioElem} onTimeUpdate={onPlaying} onEnded={mixMusicFunc}/>
      <Player
        songs={songs}
        setSongs={setSongs}

        isplaying={isplaying}
        setIsPlaying={setIsPlaying}

        audioElem={audioElem}

        currentSong={currentSong}
        setCurrentSong={setCurrentSong}

        mixMusicFunc={mixMusicFunc}
      />
    </div>
  );
}

export default App;
