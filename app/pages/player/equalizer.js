import { Box } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import _ from "lodash";

const Equalizer = ({ audioUrl, playing, audioRef, backgroundColor, verse }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  // const audioRef = useRef(null);
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
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyser.getByteFrequencyData(dataArray);
        const max = _.maxBy(dataArray) || 1; // Ensure max is at least 1

        canvasContext.fillStyle = backgroundColor
          ? backgroundColor
          : "rgb(0, 0, 0)";
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.0;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / max) * (canvas.height / 2);

          // Modify barHeight to create the wave effect
          const normalizationFactor = i / (bufferLength / 2); // 0 at start, 1 at end
          const multiplier = Math.sin(normalizationFactor * Math.PI); // Wave-like shape
          barHeight *= multiplier; // Apply the wave effect, make sure barHeight is not NaN

          canvasContext.fillStyle = `rgb(255, 255, 255)`;
          canvasContext.fillRect(
            x,
            canvas.height / 2 - barHeight,
            barWidth,
            barHeight
          );
          canvasContext.fillRect(x, canvas.height / 2, barWidth, barHeight);
          x += barWidth + 3;
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

  React.useEffect(() => {
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [audioRef.current, playing]);

  return (
    <Box sx={{ height: 100 }}>
      <Box
        sx={{
          position: "absolute",
          right: verse ? 80 : 40,
          top: 20,
          zIndex: 99,
          width: verse ? "calc(100% - 160px)" : "calc(100% - 80px)",
          height: 60,
          ...(backgroundColor && { backgroundColor }),
        }}
      >
        {audioUrl && (
          <div>
            {/* <audio
            ref={audioRef}
            src={audioUrl}
            crossOrigin="anonymous"
            style={{ display: "none" }}
            preload="metadata"
          /> */}
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                maxWidth: "600px",
                height: "60px",
              }}
            />
          </div>
        )}
      </Box>
    </Box>
  );
};

export default Equalizer;
