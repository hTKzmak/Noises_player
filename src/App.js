import './App.css';
import Player from './Player/Player';
import { songsdata } from './Player/audios';
import { useRef, useState, useEffect, useCallback } from 'react';
import PlayerMobile from './PlayerMobile/PlayerMobile';

const App = () => {
  // песни (json)
  const [songs, setSongs] = useState(songsdata);
  // играет ли музыка
  const [isplaying, setIsPlaying] = useState(false);
  // текущая музыка (стоит первая ммузыка по index)
  const [currentSong, setCurrentSong] = useState(songsdata[0]);

  // отображение плеера
  const [showPlayer, setShowPlayer] = useState(true);
  const [showMobilePlayer, setShowMobilePlayer] = useState(true);

  // перемешивать список музыки (true - да; false - нет)
  const [mixMusic, setMixMusic] = useState(false);

  // повторение музыки (1 - не повторяется ни список, ни музыка; 2 - повторяется только список; 3 - повторяется только трек)
  const [repeatValue, setRepeatValue] = useState(1)

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


  // ФУНКЦИОНАЛ ПЛЕЕРА

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



  // ОПЦИИ

  // перемешивание музыки (может повторно воспроизводиться музыка, которая была прошлой)
  // пример вывода индекса в консоли
  // 1 Player.jsx:110
  // 4 Player.jsx:110 (4 раза выводится)
  // 5 Player.jsx:110
  const mixMusicFunc = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    setCurrentSong(songs[randomIndex]);
  }, [setCurrentSong, songs]);


  const repeatMusicFunc = () => {
    const index = songs.findIndex(x => x.title === currentSong.title);

    switch (repeatValue) {
      // первая опция: если индекс последней музыки равен длине всего списка музыки, то музыка останавливается
      case 1:
        if (index === songs.length - 1) {
          setIsPlaying(false)
        } else {
          skiptoNext()
        }
        break

      // вторая опция: будет заново воспроизводиться весь список музыки
      case 2:
        skiptoNext()
        break

      // третья опция: будет заново воспроизводиться только конкретная музыка
      case 3:
        setCurrentSong(songs[index]);
        break
      default:
        skiptoNext()
        break
    }
  }

  return (
    <div className="App">
      <audio
        src={currentSong.url}
        ref={audioElem}
        onTimeUpdate={onPlaying}
        onEnded={() => {
          if (mixMusic) {
            mixMusicFunc(); // Вызов функции для перемешивания музыки, если условие выполнено
          }
          repeatMusicFunc(); // Вызов функции для обработки завершения
        }}
      />

      <PlayerMobile
        isplaying={isplaying}
        setIsPlaying={setIsPlaying}

        currentSong={currentSong}

        setShowPlayer={setShowPlayer}
        
        showMobilePlayer={showMobilePlayer}
        setShowMobilePlayer={setShowMobilePlayer}
      />

      <Player
        songs={songs}
        setSongs={setSongs}

        isplaying={isplaying}
        setIsPlaying={setIsPlaying}

        audioElem={audioElem}

        currentSong={currentSong}
        setCurrentSong={setCurrentSong}

        mixMusicFunc={mixMusicFunc}
        mixMusic={mixMusic}
        setMixMusic={setMixMusic}

        skipBack={skipBack}
        skiptoNext={skiptoNext}
        repeatValue={repeatValue}
        setRepeatValue={setRepeatValue}

        showPlayer={showPlayer}
        setShowPlayer={setShowPlayer}
      />
    </div>
  );
}

export default App;