import './App.css';
import { useEffect, useRef, useState, useCallback } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import P1RadioControls from "./components/P1RadioControls";
import TransportControls from "./components/TransportControls";
import ProcessControls from "./components/ProcessControls";
import PreprocessorEditor from "./components/PreprocessorEditor";
import CpmControl from "./components/CpmControl"
import Slider from "./components/Slider"
import FormChecks from "./components/FormChecks"


let globalEditor = null;

export default function StrudelDemo() {

  const hasRun = useRef(false);

  const [songText, setSongText] = useState(stranger_tune);
  const [p1Radio, setP1Radio] = useState('ON'); // 'ON' | 'HUSH'
  const [volume, setVolume] = useState(0.7);    // 0..1
  const [cpm, setCpm] = useState(120);
  const [checks, setChecks] = useState({ c1: false, c2: false });


  const handlePlay  = () => { globalEditor?.evaluate(); };
  const handleStop  = () => { globalEditor?.stop(); };

    const preprocess = useCallback(

        //(text) => text
        //        .replaceAll('<p1_Radio>', p1Radio === 'ON' ? '' : '_')
        //        .replaceAll('<volume>', String(Number(volume).toFixed(2))),
        //[p1Radio, volume]

        (text) => {
            const cps = (Number(cpm) / 60) || 2; 
            return text
                   .replaceAll('<p1_Radio>', p1Radio === 'ON' ? '' : '_')
                   .replaceAll('<volume>', String(Number(volume).toFixed(2)))
                   .replaceAll('<tempoLine>', `setcps(${cps.toFixed(3)})`);

        },

        [p1Radio, volume, cpm]
    );


  const handleProcess = () => { const processed = preprocess(songText);
        if (globalEditor) globalEditor.setCode(processed);
  };

  const handleProcessAndPlay = () => {handleProcess();
        globalEditor?.evaluate();
  };

  useEffect(() => {


    if (hasRun.current) return;
    hasRun.current = true;

    console_monkey_patch();

    const canvas = document.getElementById('roll');
    const ctx    = canvas.getContext('2d');
    const drawTime = [-3, 3]; 

    const sizeCanvas = () => {

      const ratio = window.devicePixelRatio || 1;
      const rect  = canvas.getBoundingClientRect();
      canvas.width  = Math.floor(rect.width  * ratio);
      canvas.height = Math.floor(rect.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    };
    
    requestAnimationFrame(sizeCanvas);
    window.addEventListener('resize', sizeCanvas);

    globalEditor = new StrudelMirror ({

      defaultOutput: webaudioOutput,
      getTime: () => getAudioContext().currentTime,
      transpiler,
      root: document.getElementById('editor'),
      drawTime,
      onDraw: (haps, time) => {
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPianoroll({haps,time,ctx,drawTime,fold: 1,});
      },

      prebake: async () => {

        initAudioOnFirstClick();
        const loadModules = evalScope (

          import('@strudel/core'),
          import('@strudel/draw'),
          import('@strudel/mini'),
          import('@strudel/tonal'),
          import('@strudel/webaudio'),
        );
        await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
      },
    });

    globalEditor.setCode(preprocess(songText));

    return () => window.removeEventListener('resize', sizeCanvas);
    
  },[]); // eslint-disable-next-line react-hooks/exhaustive-deps


  useEffect(() => {

        globalEditor?.setCode(preprocess(songText));

  }, [songText, preprocess]);

  
  useEffect(() => {

      if (!globalEditor) return;
      globalEditor.setCode(preprocess(songText));
      if (globalEditor.repl?.state?.started) globalEditor.evaluate();

  }, [p1Radio, volume, cpm, preprocess, songText]);

  return (

    <div className="app">

      {/*== NAVBAR == */}
      <header className="hero-nav">

        <div className="container-fluid">

          <div className="nb nb--full">

      
            <div className="nb__left">{/*logo*/}
                <div className="logo-dot" />
                <span className="logo-text">STRUDel</span>
            </div>

            
            <div className="nb__middle">
              
                <div className="form-check form-switch m-0"> {/* theme toggle */}
                    <input className="form-check-input"  type="checkbox" id="themeSwitch" aria-label="Toggle dark theme" onChange={(e) =>
                        document.documentElement.setAttribute(
                          "data-theme",
                          e.target.checked ? "dark" : "light"
                        )
                    }/>
              </div>

             
              <div className="nb__group">  {/* Preprocess | Proc & Play */}

                   <ProcessControls onProcess={handleProcess} onProcessPlay={handleProcessAndPlay} />

              </div>

              
              <div className="nb__group"> {/* Play | Stop */}

                   <TransportControls onPlay={handlePlay} onStop={handleStop} />

              </div>

              
              <div className="nb__radio">{/* p1: ON / HUSH */}

                   <span className="nb__label me-2">Pattern</span>
                   <P1RadioControls value={p1Radio} onChange={setP1Radio} />

              </div>

            </div>

            
            <div className="nb__right"> {/* RIGHT: volume */}

                   <label htmlFor="volrange" className="nb__label nb__label--vol">Volume</label>

                   <div className="nb__slider">

                       <Slider id="volrange" label="" value={volume} onChange={setVolume} />

                   </div>

                   <span className="nb__volnum">{volume.toFixed(2)}</span>

            </div>


            <div className="ms-3" style={{ minWidth: 180 }}> {/* Tempo (CPM) */}

                    <CpmControl value={cpm} onChange={setCpm} />

                    <div className="small text-muted">
                          CPS: {(cpm / 60).toFixed(3)}
                    </div>

            </div>


            <div className="ms-3" style={{ minWidth: 180 }}> {/*Form check*/}

                    <FormChecks checks={checks} onChange={setChecks} />

            </div>


          </div>

        </div>

      </header>

      {/* === HERO / PANELS === */}
      <section className="hero-wrap">

        <div className="hero-bg" />
        <div className="hero-gradient" />

        <div className="container-xl position-relative py-3">

          {/* Title */}
          <div className="text-center hero-title">

                   <h1>

                        <span className="thin">YOUR</span>{" "}
                        <span className="loud">MUSIC.</span>

                   </h1>

          </div>

           {/* Three cards */}

             
          <div className="row g-4 mt-2">

            {/* TUNE/CODE */}
            <div className="col-12 col-lg-4">

                <div className="glass-card h-100 code-card">

                    <div className="card-head">TUNE</div>

                        <div className="card-body">

                            <div className="editor-pane">

                                <PreprocessorEditor defaultValue={songText} onChange={(e) => setSongText(e.target.value)} />

                            </div>

                        </div>

                    
                </div>

            </div>


            {/* PROCESSED CODE*/}
            <div className="col-12 col-lg-4">

                <div className="glass-card h-100 repl-card">

                    <div className="card-head">PROCESSED</div>

                        <div className="card-body">

                            <div id="editor" className="repl-pane" />

                        </div>

                </div>

            </div>


            {/* BEATS */}
             <div className="col-12 col-lg-4">

                <div className="glass-card h-100 beats-card">

                    <div className="card-head">BEATS</div>

                        <div className="card-body">

                            <canvas id="roll" className="beats-canvas" />

                        </div>

                </div>

             </div>
          </div>
        </div>

      </section>

    </div>

  );

}

