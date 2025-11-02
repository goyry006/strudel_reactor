//import './App.css';
//import { useEffect, useRef, useState, useCallback } from "react";
//import { StrudelMirror } from '@strudel/codemirror';
//import { evalScope } from '@strudel/core';
//import { drawPianoroll } from '@strudel/draw';
//import { initAudioOnFirstClick } from '@strudel/webaudio';
//import { transpiler } from '@strudel/transpiler';
//import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
//import { registerSoundfonts } from '@strudel/soundfonts';
//import { stranger_tune } from './tunes';
//import console_monkey_patch, { getD3Data } from './console-monkey-patch';
//import P1RadioControls from "./components/P1RadioControls";
//import TransportControls from "./components/TransportControls";
//import ProcessControls from "./components/ProcessControls";
//import PreprocessorEditor from "./components/PreprocessorEditor";
//import CpmControl from "./components/CpmControl"
//import Slider from "./components/Slider"
//import FormChecks from "./components/FormChecks"


//let globalEditor = null;

//const handleD3Data = (event) => {
//    console.log(event.detail);
//};

//export default function StrudelDemo() {

//    const hasRun = useRef(false);

//    const handlePlay = (() => {
//        globalEditor.evaluate()

//    })

//    const handleStop = (() => {
//        globalEditor.stop()
//    })

//    const [songText, setSongText] = useState(stranger_tune)
//    const [p1Radio, setP1Radio] = useState('ON'); // 'ON' | 'HUSH'
//    const [volume, setVolume] = useState(0.70); // 0..1


//    //const preprocess = useCallback(
//    //    (text) => text.replaceAll('<p1_Radio>', p1Radio === 'ON' ? '' : '_'),
//    //    [p1Radio]
//    //);
//    const preprocess = useCallback(
//        (text) =>
//            text
//                .replaceAll('<p1_Radio>', p1Radio === 'ON' ? '' : '_')
//                .replaceAll('<volume>', String(Number(volume).toFixed(2))),
//        [p1Radio, volume]
//    );


//    const handleProcess = () => {
//        const processed = preprocess(songText);
//        if (globalEditor) globalEditor.setCode(processed);
//    };

//    const handleProcessAndPlay = () => {
//        handleProcess();
//        if (globalEditor) globalEditor.evaluate();
//    };

//    useEffect(() => {

//        if (!hasRun.current) {
//            document.addEventListener("d3Data", handleD3Data);
//            console_monkey_patch();
//            hasRun.current = true;
//            //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
//            //init canvas
//            const canvas = document.getElementById('roll');
//            canvas.width = canvas.width * 2;
//            canvas.height = canvas.height * 2;
//            const drawContext = canvas.getContext('2d');
//            const drawTime = [-2, 2]; // time window of drawn haps
//            globalEditor = new StrudelMirror({
//                defaultOutput: webaudioOutput,
//                getTime: () => getAudioContext().currentTime,
//                transpiler,
//                root: document.getElementById('editor'),
//                drawTime,
//                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
//                prebake: async () => {
//                    initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
//                    const loadModules = evalScope(
//                        import('@strudel/core'),
//                        import('@strudel/draw'),
//                        import('@strudel/mini'),
//                        import('@strudel/tonal'),
//                        import('@strudel/webaudio'),
//                    );
//                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
//                },
//            });

//           // document.getElementById('proc').value = stranger_tune
//        }
//        globalEditor.setCode(preprocess(songText));

//    }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

//    useEffect(() => {
//        if (globalEditor) {
//            globalEditor.setCode(preprocess(songText));
//        }
//    }, [songText, preprocess]);

//    useEffect(() => {
//        if (globalEditor) {
//            globalEditor.setCode(preprocess(songText));
//            if (globalEditor.repl?.state?.started) {
//                globalEditor.evaluate();
//            }
//        }
//    }, [p1Radio, preprocess, songText]);


//    return (
//        <div>
//            <h2>Strudel Demo</h2>
//            <main>

//                <div className="container-fluid">
//                    <div className="row">
//                        <div className="col-md-8" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
//                            <PreprocessorEditor defaultValue={songText} onChange={(e) => setSongText(e.target.value)} />
//                        </div>
//                        <div className="col-md-4">

//                            <nav>
//                                <ProcessControls onProcess={handleProcess} onProcessPlay={handleProcessAndPlay} />
//                                <br />
//                                <TransportControls onPlay={handlePlay} onStop={handleStop} />
//                            </nav>
//                        </div>
//                    </div>
//                    <div className="row">
//                        <div className="col-md-8" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
//                            <div id="editor" />
//                            <div id="output" />
//                        </div>
//                        <div className="col-md-4">
//                            <P1RadioControls value={p1Radio} onChange={setP1Radio} />

//                            <br />
//                            {/*<CpmControl />*/}
//                            {/*<br />*/}

//                            <Slider id="volrange" label="Volume" value={volume} onChange={setVolume} />

//                            {/*<br />*/}
//                            {/*<FormChecks />*/}
//                        </div>
//                    </div>
//                </div>
//                <canvas id="roll"></canvas>
//            </main >
//        </div >
//    );
//}


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
import console_monkey_patch from './console-monkey-patch';

import P1RadioControls from "./components/P1RadioControls";
import TransportControls from "./components/TransportControls";
import ProcessControls from "./components/ProcessControls";
import PreprocessorEditor from "./components/PreprocessorEditor";
import Slider from "./components/Slider";

let globalEditor = null;

export default function StrudelDemo() {

  const hasRun = useRef(false);

  const [songText, setSongText] = useState(stranger_tune);
  const [p1Radio, setP1Radio] = useState('ON'); // 'ON' | 'HUSH'
  const [volume, setVolume] = useState(0.7);    // 0..1

  const handlePlay  = () => { globalEditor?.evaluate(); };
  const handleStop  = () => { globalEditor?.stop(); };

  const preprocess = useCallback((text) => text
                        .replaceAll('<p1_Radio>', p1Radio === 'ON' ? '' : '_')
                        .replaceAll('<volume>', String(Number(volume).toFixed(2))
  ),[p1Radio, volume]);

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

  }, [p1Radio, volume, preprocess, songText]);

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
            {/* CODE */}
            <div className="col-12 col-lg-4">
              <div className="glass-card h-100 code-card">
                <div className="card-head">TUNE</div>
                <div className="card-body">
                  <div className="editor-pane">
                    <PreprocessorEditor
                      defaultValue={songText}
                      onChange={(e) => setSongText(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PROCESSED */}
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

