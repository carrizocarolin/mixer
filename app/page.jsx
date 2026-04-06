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

const SILENT_THRESHOLD = 0.001;

export default function Page() {
  const audioRefs = useRef([]);
  const wasPausedByZeroRef = useRef(Array(TRACK_COUNT).fill(false));
  const [ready, setReady] = useState(false);
  const [volumes, setVolumes] = useState([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [master, setMaster] = useState(0.9);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    audioRefs.current = Array.from({ length: TRACK_COUNT }, (_, i) => {
      const audio = new window.Audio(FILES[i]);
      audio.loop = true;
      audio.preload = "auto";
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
      if (!audio) return;

      const finalVolume = volumes[i] * master;
      audio.volume = finalVolume;

      if (finalVolume <= SILENT_THRESHOLD) {
        if (!audio.paused) {
          audio.pause();
          wasPausedByZeroRef.current[i] = true;
        }
        return;
      }

      if (playing && (audio.paused || wasPausedByZeroRef.current[i])) {
        audio.play().catch(() => null);
        wasPausedByZeroRef.current[i] = false;
      }
    });
  }, [volumes, master, ready, playing]);

  const play = async () => {
    if (!ready) return;

    setPlaying(true);

    await Promise.all(
      audioRefs.current.map((audio, i) => {
        const finalVolume = volumes[i] * master;
        if (!audio || finalVolume <= SILENT_THRESHOLD) return Promise.resolve(null);
        wasPausedByZeroRef.current[i] = false;
        return audio.play().catch(() => null);
      })
    );
  };

  const stop = () => {
    audioRefs.current.forEach((audio, i) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      wasPausedByZeroRef.current[i] = false;
    });
    setPlaying(false);
  };

  return (
    <div
      style={{
        background: "#0a0a0b",
        color: "white",
        minHeight: "100vh",
        padding: "10px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: 14,
          maxWidth: 920,
          marginInline: "auto",
        }}
      >
        <div
          style={{
            letterSpacing: 1.5,
            fontSize: 16,
            marginBottom: 8,
          }}
        >
          Más allá de la emergencia - a 50 años de último golpe de estado cívico militar en argentina-
        </div>

        <div
          style={{
            fontSize: 10,
            opacity: 0.72,
            lineHeight: 1.45,
          }}
        >
          Textos: Daniel Quaranta
          <br />
          Voz: Carmen Baliero
          <br />
          Intervenciones sonoras: Carolina Carrizo y Daniel Quaranta
          <br />
          Diseño de interfaz: Carolina Carrizo
        </div>

        <div
          style={{
            fontSize: 10,
            marginTop: 10,
            lineHeight: 1.45,
            opacity: 0.92,
          }}
        >
          A continuación escucharás distintas versiones de cuatro poemas. Cada slide corresponde a una intervención. Podés activar más de un volumen a la vez y combinarlos libremente entre sí para construir tu propia experiencia sonora.
        </div>

        <div
          style={{
            fontSize: 10,
            marginTop: 10,
            lineHeight: 1.55,
          }}
        >
          <div style={{ color: "rgb(139,92,246)" }}>madre</div>
          <div style={{ color: "rgb(59,130,246)" }}>más allá de la emergencia</div>
          <div style={{ color: "rgb(16,185,129)" }}>palimpsesto</div>
          <div style={{ color: "rgb(245,158,11)" }}>tema con variaciones</div>
        </div>
      </div>

      <div
        style={{
          marginBottom: 14,
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          maxWidth: 920,
          marginInline: "auto",
        }}
      >
        <button
          onClick={playing ? stop : play}
          style={{
            background: "white",
            color: "black",
            border: "none",
            padding: "8px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          {playing ? "Pausar" : "Reproducir"}
        </button>

        <div style={{ width: 170 }}>
          <div style={{ fontSize: 10, marginBottom: 4 }}>
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
          display: "grid",
          gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
          gap: 6,
          alignItems: "stretch",
          width: "100%",
          maxWidth: 920,
          margin: "0 auto",
        }}
      >
        {TRACKS.map((name, i) => {
          const level = volumes[i];
          const rgb = COLORS[i];

          return (
            <div
              key={i}
              style={{
                minWidth: 0,
                padding: 6,
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                background: `linear-gradient(to bottom, rgba(${rgb}, ${0.12 + level * 0.35}), rgba(${rgb}, 0.05))`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  fontSize: 8,
                  textAlign: "center",
                  lineHeight: 1.15,
                  minHeight: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  wordBreak: "break-word",
                }}
              >
                {name}
              </div>

              <div style={{ fontSize: 9 }}>{Math.round(level * 100)}%</div>

              <div
                style={{
                  height: 110,
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
                    width: 92,
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
