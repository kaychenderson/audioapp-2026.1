"use client"

import { useEffect, useRef, useState } from "react";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import musics from "./data/musics";

export default function Home() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [audioIndex, setAudioIndex] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = volume;

    if (playing) {
      audio.play();
    }
  }, [audioIndex, playing, volume]);

  const playPause = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }

    setPlaying(!playing);
  };

  const changeVolume = (value: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = value;
    setVolume(value);
  };

  const changeMusic = (index: number) => {
    setAudioIndex(index);
  };

  return (
    <div className="flex bg-purple-950 w-125 mr-auto ml-auto p-4 gap-4">
      
      <div>
        <ul>
          {musics.map((music, index) => (
            <li
              key={index}
              onClick={() => changeMusic(index)}
              className="w-50 cursor-pointer mb-4"
            >
              <h1>{music.nome}</h1>

              <img
                src={music.imagem}
                alt={`Imagem da música ${music.nome}`}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="items-center flex flex-col rounded-2xl border-gray-500 border-2 w-50 p-4 gap-4">

        <audio
          ref={audioRef}
          src={musics[audioIndex].url}
        />

        <h2>{musics[audioIndex].nome}</h2>

        <button onClick={playPause} className="text-5xl">
          {playing ? <FaPauseCircle /> : <FaPlayCircle />}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
        />

      </div>
    </div>
  );
}