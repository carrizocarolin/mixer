"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const TRACK_COUNT = 12;

const TRACKS = [
  "madre A","madre B","madre C",
  "más allá de la emergencia A","más allá de la emergencia B","más allá de la emergencia C","más allá de la emergencia D",
  "palimpsesto A","palimpsesto B","palimpsesto C",
  "tema con variaciones A","tema con variaciones B"
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
  "/audios/variaciones-b.mp3"
];

const COLORS = [
  "139,92,246","139,92,246","139,92,246",
  "59,130,246","59,130,246","59,130,246","59,130,246",
  "16,185,129","16,185,129","16,185,129",
  "245,158,11","245,158,11"
];

export default function Page() {
  const audioRefs = useRef(Array.from({ length: TRACK_COUNT }, () => new Audio()));

  const [volumes, setVolumes] = useState(Array(TRACK_COUNT).fill(0.7));
  const [master, setMaster] = useState(0.9);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    audioRefs.current.forEach((a, i) => {
      a.src = FILES[i];
      a.loop = true;
    });
  }, []);

  useEffect(() => {
    audioRefs.current.forEach((a, i) => {
      a.volume = volumes[i] * master;
    });
  }, [volumes, master]);

  const play = async () => {
    await Promise.all(audioRefs.current.map(a => a.play().catch(()=>{})));
    setPlaying(true);
  };

  const stop = () => {
    audioRefs.current.forEach(a => a.pause());
    setPlaying(false);
  };

  return (
    <div style={{ background:"#0a0a0b", color:"white", minHeight:"100vh", padding:"20px" }}>

      {/* TEXTO */}
      <div style={{ textAlign:"center", marginBottom:30 }}>
        <div style={{ letterSpacing:2 }}>Más allá de la emergencia</div>

        <div style={{ fontSize:12, opacity:0.6, marginTop:10 }}>
          Textos: Daniel Quaranta<br/>
          Voz: Carmen Baliero<br/>
          Intervenciones sonoras: Carolina Carrizo y Daniel Quaranta<br/>
          Diseño de interfaz: Carolina Carrizo
        </div>

        <div style={{ fontSize:12, marginTop:10 }}>
          A continuación podrás escuchar distintas intervenciones realizadas sobre cuatro poemas,
          así como también interactuar libremente con la mezcla.
        </div>

        <div style={{ fontSize:12, marginTop:10 }}>
          <div style={{ color:"rgb(139,92,246)" }}>madre</div>
          <div style={{ color:"rgb(59,130,246)" }}>más allá de la emergencia</div>
          <div style={{ color:"rgb(16,185,129)" }}>palimpsesto</div>
          <div style={{ color:"rgb(245,158,11)" }}>tema con variaciones</div>
        </div>
      </div>

      {/* CONTROLES */}
      <div style={{ marginBottom:20 }}>
        <button onClick={playing ? stop : play}>
          {playing ? "Pausar" : "Reproducir"}
        </button>
      </div>

      {/* MIXER */}
      <div style={{ display:"flex", gap:10, overflowX:"auto" }}>
        {TRACKS.map((name, i) => {
          const level = volumes[i];
          const rgb = COLORS[i];

          return (
            <div key={i}
              style={{
                width:70,
                padding:10,
                border:"1px solid rgba(255,255,255,0.1)",
                background:`rgba(${rgb},${0.1 + level*0.3})`
              }}
            >
              <div style={{ fontSize:10 }}>{name}</div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volumes[i]}
                onChange={(e)=>{
                  const v = [...volumes];
                  v[i]=parseFloat(e.target.value);
                  setVolumes(v);
                }}
                style={{ transform:"rotate(-90deg)", width:150 }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
