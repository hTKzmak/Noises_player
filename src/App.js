import './App.css';
import Player from './Player/Player';
import { songsdata } from './Player/audios';
import { useRef, useState, useEffect } from 'react';
import MiniPlayer from './MiniPlayer/MiniPlayer';

const App = () => {
  // песни (json)
  const [songs, setSongs] = useState(songsdata);
  // играет ли музыка
  const [isplaying, setIsPlaying] = useState(false);
  // текущая музыка (стоит первая ммузыка по index)
  const [currentSong, setCurrentSong] = useState(songsdata[0]);

  // отображение плеера
  const [showPlayer, setShowPlayer] = useState(true);
  const [showMiniPlayer, setShowMiniPlayer] = useState(true);

  // перемешивать список музыки (true - да; false - нет)
  const [mixMusic, setMixMusic] = useState(false);

  // повторение музыки (1 - не повторяется ни список, ни музыка; 2 - повторяется только список; 3 - повторяется только трек)
  const [repeatValue, setRepeatValue] = useState(1)

  // место события на разметке (audio тег)
  const audioElem = useRef();

  // массив с перемешанными индексами музыки
  const [mixSongsdata, setMixSongsdata] = useState([])

  // Одна из опций плеера: перемешивание музыки (данные songsdata)
  useEffect(() => {
    // Создаем копию массива songsdata
    let arrayCopy = songsdata.slice();

    let currentIndex = arrayCopy.length, temporaryValue, randomIndex;

    // Пока есть элементы для перемешивания...
    while (currentIndex !== 0) {
      // Выбираем оставшийся элемент...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // И меняем его местами с текущим элементом.
      temporaryValue = arrayCopy[currentIndex];
      arrayCopy[currentIndex] = arrayCopy[randomIndex];
      arrayCopy[randomIndex] = temporaryValue;
    }

    // Сохраняем перемешанные данные в mixedData
    setMixSongsdata(arrayCopy);
  }, [])


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
    if (mixMusic) {
      const index = mixSongsdata.findIndex(x => x.title === currentSong.title);
      if (index === 0) {
        setCurrentSong(mixSongsdata[mixSongsdata.length - 1])
      }
      else {
        setCurrentSong(mixSongsdata[index - 1])
      }
    }
    else {
      const index = songs.findIndex(x => x.title === currentSong.title);
      if (index === 0) {
        setCurrentSong(songs[songs.length - 1])
      }
      else {
        setCurrentSong(songs[index - 1])
      }
    }
    audioElem.current.currentTime = 0;
  }

  // пропуск музыки на следующую музыку
  const skiptoNext = () => {

    if (mixMusic) {
      const index = mixSongsdata.findIndex(x => x.title === currentSong.title);
      if (index === mixSongsdata.length - 1) {
        setCurrentSong(mixSongsdata[0]);
      } else {
        setCurrentSong(mixSongsdata[index + 1]);
      }
    }
    // Если перемешивание выключено, переходим к следующей песне
    else {
      const index = songs.findIndex(x => x.title === currentSong.title);
      if (index === songs.length - 1) {
        setCurrentSong(songs[0]);
      } else {
        setCurrentSong(songs[index + 1]);
      }
    }

    audioElem.current.currentTime = 0; // Сброс времени проигрывания
  };



  // ОПЦИИ

  // перемешивание музыки (наверху)

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
            skiptoNext();
          }
          repeatMusicFunc(); // Вызов функции для обработки завершения
        }}
      />

      <MiniPlayer
        isplaying={isplaying}
        setIsPlaying={setIsPlaying}

        currentSong={currentSong}

        showPlayer={showPlayer}
        setShowPlayer={setShowPlayer}

        showMiniPlayer={showMiniPlayer}
        setShowMiniPlayer={setShowMiniPlayer}
      />

      <Player
        songs={songs}
        setSongs={setSongs}

        isplaying={isplaying}
        setIsPlaying={setIsPlaying}

        audioElem={audioElem}

        currentSong={currentSong}
        setCurrentSong={setCurrentSong}

        mixMusic={mixMusic}
        setMixMusic={setMixMusic}

        skipBack={skipBack}
        skiptoNext={skiptoNext}
        repeatValue={repeatValue}
        setRepeatValue={setRepeatValue}

        showPlayer={showPlayer}
        setShowPlayer={setShowPlayer}

        showMiniPlayer={showMiniPlayer}
        setShowMiniPlayer={setShowMiniPlayer}
      />
    </div>
  );
}

export default App;