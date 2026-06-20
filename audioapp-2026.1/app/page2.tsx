"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaPauseCircle,
  FaPlayCircle,
  FaForward,
  FaBackward,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
} from "react-icons/fa";

import musics from "./data/musics";

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [audioIndex, setAudioIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = volume;

    if (playing) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [playing, volume, audioIndex]);

  const playPause = () => {
    setPlaying((prev) => !prev);
  };

  const changeVolume = (value: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = value;
    setVolume(value);
  };

  const changeMusic = (index: number) => {
    setAudioIndex(index);
    setCurrentTime(0);
    setDuration(0);
  };

  const nextMusic = () => {
    setAudioIndex((prev) =>
      prev === musics.length - 1 ? 0 : prev + 1
    );

    setCurrentTime(0);
    setDuration(0);
  };

  const previousMusic = () => {
    setAudioIndex((prev) =>
      prev === 0 ? musics.length - 1 : prev - 1
    );

    setCurrentTime(0);
    setDuration(0);
  };

  const forward10 = () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = Math.min(
      audio.currentTime + 10,
      duration
    );
  };

  const rewind10 = () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = Math.max(
      audio.currentTime - 10,
      0
    );
  };

  const changeProgress = (value: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-950 via-indigo-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

        {/* Playlist */}
        <div className="w-full md:w-1/3">
          <h2 className="text-2xl font-bold mb-4">
            Playlist
          </h2>

          <ul className="space-y-3">
            {musics.map((music, index) => (
              <li
                key={index}
                onClick={() => changeMusic(index)}
                className={`cursor-pointer rounded-xl p-3 transition-all duration-300 ${
                  audioIndex === index
                    ? "bg-purple-600 scale-105 shadow-lg"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                <img
                  src={music.imagem}
                  alt={music.nome}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />

                <h3 className="font-semibold text-center">
                  {music.nome}
                </h3>
              </li>
            ))}
          </ul>
        </div>

        {/* Player */}
        <div className="flex-1 bg-black/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8 flex flex-col items-center">

          <audio
            ref={audioRef}
            src={musics[audioIndex].url}
            preload="metadata"
            onEnded={nextMusic}
            onLoadedMetadata={(e) => {
              setDuration(
                e.currentTarget.duration || 0
              );
            }}
            onDurationChange={(e) => {
              setDuration(
                e.currentTarget.duration || 0
              );
            }}
            onTimeUpdate={(e) => {
              setCurrentTime(
                e.currentTarget.currentTime
              );
            }}
          />

          <img
            src={musics[audioIndex].imagem}
            alt={musics[audioIndex].nome}
            className="w-72 h-72 object-cover rounded-2xl shadow-2xl mb-6"
          />

          <h1 className="text-3xl font-bold text-center">
            {musics[audioIndex].nome}
          </h1>

          <p className="text-gray-300 mt-2">
            Tocando agora
          </p>

          {/* Controles */}
          <div className="flex items-center gap-6 text-4xl my-8">

            <button
              onClick={previousMusic}
              className="hover:scale-110 transition"
            >
              <FaStepBackward />
            </button>

            <button
              onClick={rewind10}
              className="hover:scale-110 transition"
            >
              <FaBackward />
            </button>

            <button
              onClick={playPause}
              className="text-6xl hover:scale-110 transition"
            >
              {playing ? (
                <FaPauseCircle />
              ) : (
                <FaPlayCircle />
              )}
            </button>

            <button
              onClick={forward10}
              className="hover:scale-110 transition"
            >
              <FaForward />
            </button>

            <button
              onClick={nextMusic}
              className="hover:scale-110 transition"
            >
              <FaStepForward />
            </button>

          </div>

          {/* Barra de progresso */}
          <div className="w-full max-w-xl">

            <input
              type="range"
              min="0"
              max={duration || 1}
              step="0.1"
              value={currentTime}
              onInput={(e) =>
                changeProgress(
                  Number(
                    (e.target as HTMLInputElement)
                      .value
                  )
                )
              }
              className="w-full cursor-pointer"
            />

            <div className="flex justify-between mt-2 text-sm text-gray-300">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

          </div>

          {/* Volume */}
          <div className="flex items-center gap-4 mt-8 w-full max-w-md">

            <FaVolumeUp className="text-xl" />

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) =>
                changeVolume(
                  Number(e.target.value)
                )
              }
              className="w-full"
            />

          </div>

        </div>
      </div>
    </div>
  );
}