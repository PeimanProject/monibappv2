import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import _ from "lodash";

const Equalizer = ({ audioUrl, playing, audioRef }) => {
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
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
        const max = _.maxBy(dataArray) || 1; // Ensure max is at least 1

        canvasContext.fillStyle = "rgb(0, 0, 0)";
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
        //const audio = audioRef.current;
        if (!audioContext || !audio) return null;

        // Check if a source node already exists.  If so, return it.
        if (sourceNodeRef.current) {
          return sourceNodeRef.current;
        }

        try {
          const source = audioContext.createMediaElementSource(audio);
          sourceNodeRef.current = source;
          return source;
        } catch (error) {
          console.error("Error creating media element source:", error);
          return null; // Important: Return null on error to prevent further issues
        }
      };

      const handlePlay = () => {
        const audioContext = audioContextRef.current;
        if (!audioContext) return;

        if (audioContext.state === "suspended") {
          audioContext
            .resume()
            .catch((e) => console.error("Error resuming audio context", e));
        }

        let source = sourceNodeRef.current;
        if (!source) {
          source = createSourceNode();
          if (!source) return; // Exit if source creation failed
          sourceNodeRef.current = source; // Store the source
        }

        // Disconnect and reconnect, handling potential errors
        try {
          source.disconnect(); // Disconnect first
        } catch (e) {
          console.error("Error disconnect nodes:", error);
          // Ignore errors, the node might not have been connected
        }

        try {
          source.connect(analyser);
          analyser.connect(audioContext.destination);
        } catch (error) {
          console.error("Error connecting nodes:", error);
          return; // Important: Stop if connection fails
        }
        draw();
      };

      const handlePause = () => {
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
        if (sourceNodeRef.current) {
          try {
            sourceNodeRef.current.disconnect();
          } catch (e) {
            // Ignore errors
          }
        }
      };

      if (playing) {
        handlePlay();
      } else {
        handlePause();
      }

      return () => {
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
        if (sourceNodeRef.current) {
          try {
            sourceNodeRef.current.disconnect();
          } catch (e) {
            // Ignore errors
          }
        }
        if (audioContextRef.current) {
          audioContextRef.current
            .close()
            .catch((e) => console.error("Error closing audio context", e));
          audioContextRef.current = null;
        }
      };
    }
  }, [audioUrl, playing, audioRef]);

  return (
    <Box
      sx={{
        position: "absolute",
        right: 40,
        top: 20,
        zIndex: 99,
        width: "calc(100% - 80px)",
        height: 60,
      }}
    >
      {audioUrl && (
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            maxWidth: "600px",
            height: "60px",
          }}
        />
      )}
    </Box>
  );
};

export default Equalizer;
