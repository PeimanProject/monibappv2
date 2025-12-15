import { Box } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";

export const Equalizer = ({ audioUrl, playing }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);

  useEffect(() => {
    if (audioUrl) {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const audio = audioRef.current;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext("2d");

      const draw = () => {
        if (!analyserRef.current) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyser.getByteFrequencyData(dataArray);

        canvasContext.fillStyle = "rgb(0, 0, 0)";
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];
          canvasContext.fillStyle = `rgb(180, 180, 180)`;
          canvasContext.fillRect(x, canvas.height / 2 , barWidth, barHeight*.5);
          canvasContext.fillRect(x, (canvas.height / 2) - barHeight*.5, barWidth, barHeight*.5);
          x += barWidth + 1.5;
        }

        animationFrameIdRef.current = requestAnimationFrame(draw);
      };

      const createSourceNode = () => {
        const audioContext = audioContextRef.current;
        const audio = audioRef.current;
        if (!audioContext) return null;
        const source = audioContext.createMediaElementSource(audio);
        sourceNodeRef.current = source;
        return source;
      };

      const handlePlay = () => {
        const audioContext = audioContextRef.current;
        if (!audioContext) return;

        if (audioContext.state === "suspended") {
          audioContext.resume();
        }

        if (!sourceNodeRef.current) {
          const source = createSourceNode();
          if (!source) return;
          source.connect(analyser);
          analyser.connect(audioContext.destination);
        } else {
          sourceNodeRef.current.connect(analyser);
          analyser.connect(audioContext.destination);
        }

        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            draw();
          })
          .catch((err) => {
            console.error("Playback failed:", err);
            setIsPlaying(false);
            if (sourceNodeRef.current) {
              sourceNodeRef.current.disconnect();
            }
          });
      };

      const handlePause = () => {
        const audio = audioRef.current;
        if (audio) {
          audio.pause();
        }
        setIsPlaying(false);
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect();
        }
      };

      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);

      return () => {
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect();
        }
        if (audioContextRef.current) {
          audioContextRef.current
            .close()
            .catch((e) => console.error("Error closing audio context", e));
          audioContextRef.current = null;
        }
        if (audio) {
          audio.removeEventListener("play", handlePlay);
          audio.removeEventListener("pause", handlePause);
        }
      };
    }
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  React.useEffect(() => {
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [audioRef.current, playing]);

  return (
    <Box
      sx={{
        position: "absolute",
        right: 10,
        top: 10,
        zIndex: 99,
        width: "calc(100% - 20px)",
        height: 80,
      }}
    >
      {audioUrl && (
        <div>
          <audio
            ref={audioRef}
            src={audioUrl}
            crossOrigin="anonymous"
            style={{ display: "none" }}
            preload="metadata"
          />
          {/* <button onClick={handlePlayPause}>
            {isPlaying ? "Pause" : "Play"}
          </button> */}
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
          //   border:`1px solid red`,
              maxWidth: "600px",
              height: "80px",
            }}
          />
        </div>
      )}
    </Box>
  );
};
