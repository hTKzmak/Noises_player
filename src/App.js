import './App.css';
import Player from './Player/Player';
import { songsdata } from './Player/audios';
import { useRef, useState, useEffect } from 'react';

const App = () => {
  const [songs, setSongs] = useState(songsdata);
  const [isplaying, setisplaying] = useState(false);
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

    // обновление данных => прогресс: текущее значение музыки (может быть 0 или другое), длина: длина аудио-файла
    setCurrentSong({ ...currentSong, "progress": ct, "length": duration })
  }

  return (
    <div className="App">
      <audio src={currentSong.url} ref={audioElem} onTimeUpdate={onPlaying}/>
      <Player
        songs={songs}
        setSongs={setSongs}

        isplaying={isplaying}
        setisplaying={setisplaying}
        
        audioElem={audioElem}

        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
      />
    </div>
  );
}

export default App;
