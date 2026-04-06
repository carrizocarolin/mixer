"use client";

import { useEffect, useRef, useState } from "react";

const TRACK_COUNT = 12;

const TRACKS = [
  "madre A",
  "madre B",
  "madre C",
  "más allá de la emergencia A",
  "más allá de la emergencia B",
  "más allá de la emergencia C",
  "más allá de la emergencia D",
  "palimpsesto A",
  "palimpsesto B",
  "palimpsesto C",
  "tema con variaciones A",
  "tema con variaciones B",
];

const FILES = [
  "/audios/madre-a.mp3",
  "/audios/madre-b.mp3",
  "/audios/madre-c.mp3",
  "/audios/emergencia-a.mp3",
  "/audios/emergencia-b.mp3",
  "/audios/emergencia-c.mp3",
  "/audios/emergencia-d.mp3",
  "/audios/palimpsesto-a.mp3",
  "/audios/palimpsesto-b.mp3",
  "/audios/palimpsesto-c.mp3",
  "/audios/variaciones-a.mp3",
  "/audios/variaciones-b.mp3",
];

const COLORS = [
  "139,92,246",
  "139,92,246",
  "139,92,246",
  "59,130,246",
  "59,130,246",
  "59,130,246",
  "59,130,246",
  "16,185,129",
  "16,185,129",
  "16,185,129",
  "245,158,11",
  "245,158,11",
];

export default function Page() {
  const audioRefs = useRef([]);
  const [ready, setReady] = useState(false);
  const [volumes, setVolumes] = useState(Array(TRACK_COUNT).fill(0.7));
  const [master, setMaster] = useState(0.9);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    audioRefs.current = Array.from({ length: TRACK_COUNT }, (_, i) => {
      const audio = new window.Audio(FILES[i]);
      audio.loop = true;
      return audio;
    });

    setReady(true);

    return () => {
      audioRefs.current.forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      });
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    audioRefs.current.forEach((audio, i) => {
      if (audio) {
        audio.volume = volumes[i] * master;
      }
    });
  }, [volumes, master, ready]);

  const play = async () => {
    if (!ready) return;
    await Promise.all(
      audioRefs.current.map((audio) =>
        audio.play().catch(() => {
          return null;
        })
      )
    );
    setPlaying(true);
  };

  const stop = () => {
    audioRefs.current.forEach((audio) => {
      if (audio) audio.pause();
    });
    setPlaying(false);
  };

  return (
    <div
      style={{
        background: "#0a0a0b",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{ letterSpacing: 2, fontSize: 18 }}>
          Más allá de la emergencia
        </div>

        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 10, lineHeight: 1.6 }}>
          Textos: Daniel Quaranta
          <br />
          Voz: Carmen Baliero
          <br />
          Intervenciones sonoras: Carolina Carrizo y Daniel Quaranta
          <br />
          Diseño de interfaz: Carolina Carrizo
        </div>

        <div style={{ fontSize: 12, marginTop: 14, lineHeight: 1.6, opacity: 0.9 }}>
          Instrucciones: A continuación podrás escuchar distintas intervenciones
          realizadas sobre cuatro poemas, así como también interactuar libremente
          con la mezcla.
        </div>

        <div style={{ fontSize: 12, marginTop: 14, lineHeight: 1.8 }}>
          <div style={{ color: "rgb(139,92,246)" }}>madre</div>
          <div style={{ color: "rgb(59,130,246)" }}>más allá de la emergencia</div>
          <div style={{ color: "rgb(16,185,129)" }}>palimpsesto</div>
          <div style={{ color: "rgb(245,158,11)" }}>tema con variaciones</div>
        </div>
      </div>

      <div style={{ marginBottom: 24, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={playing ? stop : play}
          style={{
            background: "white",
            color: "black",
            border: "none",
            padding: "10px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          {playing ? "Pausar" : "Reproducir"}
        </button>

        <div style={{ minWidth: 180 }}>
          <div style={{ fontSize: 12, marginBottom: 6 }}>
            Volumen general: {Math.round(master * 100)}%
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={master}
            onChange={(e) => setMaster(parseFloat(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          alignItems: "flex-end",
          paddingBottom: 20,
        }}
      >
        {TRACKS.map((name, i) => {
          const level = volumes[i];
          const rgb = COLORS[i];

          return (
            <div
              key={i}
              style={{
                width: 88,
                minWidth: 88,
                padding: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 14,
                background: `linear-gradient(to bottom, rgba(${rgb}, ${0.12 + level * 0.35}), rgba(${rgb}, 0.05))`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  textAlign: "center",
                  lineHeight: 1.3,
                  minHeight: 40,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {name}
              </div>

              <div style={{ fontSize: 11 }}>{Math.round(level * 100)}%</div>

              <div
                style={{
                  height: 220,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volumes[i]}
                  onChange={(e) => {
                    const next = [...volumes];
                    next[i] = parseFloat(e.target.value);
                    setVolumes(next);
                  }}
                  style={{
                    transform: "rotate(-90deg)",
                    width: 180,
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
