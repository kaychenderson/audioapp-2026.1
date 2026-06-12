"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaBackward,
  FaForward,
  FaPauseCircle,
  FaPlayCircle,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
} from "react-icons/fa";
import videos from "./data/videos";

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [videoIndex, setVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [velocity, setVelocity] = useState(1);

  const [filter, setFilter] = useState<
    "normal" | "gray" | "red" | "green" | "blue"
  >("normal");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.volume = volume;
    video.playbackRate = velocity;

    if (playing) {
      video.play().catch(() => {});
      draw();
    } else {
      video.pause();
    }
  }, [playing, volume, velocity, videoIndex]);

  useEffect(() => {
    if (playing) {
      draw();
    }
  }, [filter]);

  useEffect(() => {
    if (playing) {
      draw();
    }
  }, [filter]);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0")
    );
  };

  const playPause = () => {
    setPlaying((prev) => !prev);
  };

  const changeVolume = (value: number) => {
    const video = videoRef.current;

    if (!video) return;

    video.volume = value;
    setVolume(value);
  };

  const changeVideo = (index: number) => {
    if (index >= videos.length) {
      index = 0;
    }

    if (index < 0) {
      index = videos.length - 1;
    }

    setVideoIndex(index);
    setCurrentTime(0);
    setDuration(0);
  };

  const nextVideo = () => {
    changeVideo(videoIndex + 1);
  };

  const previousVideo = () => {
    changeVideo(videoIndex - 1);
  };

  const forward10 = () => {
    const video = videoRef.current;

    if (!video) return;

    video.currentTime = Math.min(
      video.currentTime + 10,
      duration
    );
  };

  const rewind10 = () => {
    const video = videoRef.current;

    if (!video) return;

    video.currentTime = Math.max(
      video.currentTime - 10,
      0
    );
  };

  const changeProgress = (value: number) => {
    const video = videoRef.current;

    if (!video) return;

    video.currentTime = value;
    setCurrentTime(value);
  };

  const changeVelocity = () => {
    let newVelocity = velocity + 0.5;

    if (newVelocity > 3) {
      newVelocity = 1;
    }

    const video = videoRef.current;

    if (!video) return;

    video.playbackRate = newVelocity;
    setVelocity(newVelocity);
  };

  const draw = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 450;

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (filter !== "normal") {
      const imageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        switch (filter) {
          case "gray":
            const avg = (r + g + b) / 3;

            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
            break;

          case "red":
            data[i + 1] = 0;
            data[i + 2] = 0;
            break;

          case "green":
            data[i] = 0;
            data[i + 2] = 0;
            break;

          case "blue":
            data[i] = 0;
            data[i + 1] = 0;
            break;
        }
      }

      context.putImageData(imageData, 0, 0);
    }

    if (!video.paused && !video.ended) {
      requestAnimationFrame(draw);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">

        {/* Playlist */}
        <div className="w-full md:w-1/3">
          <h2 className="text-2xl font-bold mb-4">
            Playlist de Vídeos
          </h2>

          <ul className="space-y-3">
            {videos.map((video, index) => (
              <li
                key={index}
                onClick={() => changeVideo(index)}
                className={`cursor-pointer rounded-xl p-3 transition-all duration-300 ${
                  videoIndex === index
                    ? "bg-blue-600 scale-105 shadow-lg"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                <img
                  src={video.imagem}
                  alt={video.nome}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />

                <h3 className="text-center font-semibold">
                  {video.nome}
                </h3>
              </li>
            ))}
          </ul>
        </div>

        {/* Player */}
        <div className="flex-1 bg-black/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8 flex flex-col items-center">

          <video
            ref={videoRef}
            src={videos[videoIndex].url}
            hidden
            preload="metadata"
            onLoadedMetadata={(e) =>
              setDuration(
                e.currentTarget.duration || 0
              )
            }
            onDurationChange={(e) =>
              setDuration(
                e.currentTarget.duration || 0
              )
            }
            onTimeUpdate={(e) =>
              setCurrentTime(
                e.currentTarget.currentTime
              )
            }
            onEnded={nextVideo}
          />

          <canvas
            ref={canvasRef}
            className="w-full max-w-4xl rounded-xl bg-black mb-6"
          />

          <h1 className="text-3xl font-bold text-center">
            {videos[videoIndex].nome}
          </h1>

          <p className="text-gray-400 mt-2">
            Reproduzindo vídeo
          </p>

          {/* Controles */}
          <div className="flex items-center gap-6 text-4xl my-8">

            <button
              onClick={previousVideo}
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
              onClick={nextVideo}
              className="hover:scale-110 transition"
            >
              <FaStepForward />
            </button>

          </div>

          {/* Barra de Progresso */}
          <div className="w-full max-w-3xl">
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={currentTime}
              onChange={(e) =>
                changeProgress(
                  Number(e.target.value)
                )
              }
              className="w-full cursor-pointer"
            />

            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-4 mt-6 w-full max-w-md">

            <FaVolumeUp />

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

          {/* Velocidade */}
          <button
            onClick={changeVelocity}
            className="mt-6 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Velocidade: {velocity}x
          </button>

          {/* Filtros */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">

            <button
              onClick={() => setFilter("normal")}
              className="bg-gray-600 px-4 py-2 rounded"
            >
              Normal
            </button>

            <button
              onClick={() => setFilter("gray")}
              className="bg-gray-800 px-4 py-2 rounded"
            >
              Cinza
            </button>

            <button
              onClick={() => setFilter("red")}
              className="bg-red-600 px-4 py-2 rounded"
            >
              Vermelho
            </button>

            <button
              onClick={() => setFilter("green")}
              className="bg-green-600 px-4 py-2 rounded"
            >
              Verde
            </button>

            <button
              onClick={() => setFilter("blue")}
              className="bg-blue-600 px-4 py-2 rounded"
            >
              Azul
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}