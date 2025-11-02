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

const handleD3Data = (event) => {
    console.log(event.detail);
};

export default function StrudelDemo() {

    const hasRun = useRef(false);

    const handlePlay = (() => {
        globalEditor.evaluate()

    })

    const handleStop = (() => {
        globalEditor.stop()
    })

    const [songText, setSongText] = useState(stranger_tune)
    const [p1Radio, setP1Radio] = useState('ON'); // 'ON' | 'HUSH'
    const [volume, setVolume] = useState(0.70); // 0..1


    //const preprocess = useCallback(
    //    (text) => text.replaceAll('<p1_Radio>', p1Radio === 'ON' ? '' : '_'),
    //    [p1Radio]
    //);
    const preprocess = useCallback(
        (text) =>
            text
                .replaceAll('<p1_Radio>', p1Radio === 'ON' ? '' : '_')
                .replaceAll('<volume>', String(Number(volume).toFixed(2))),
        [p1Radio, volume]
    );


    const handleProcess = () => {
        const processed = preprocess(songText);
        if (globalEditor) globalEditor.setCode(processed);
    };

    const handleProcessAndPlay = () => {
        handleProcess();
        if (globalEditor) globalEditor.evaluate();
    };

    useEffect(() => {

        if (!hasRun.current) {
            document.addEventListener("d3Data", handleD3Data);
            console_monkey_patch();
            hasRun.current = true;
            //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
            //init canvas
            const canvas = document.getElementById('roll');
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;
            const drawContext = canvas.getContext('2d');
            const drawTime = [-2, 2]; // time window of drawn haps
            globalEditor = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: document.getElementById('editor'),
                drawTime,
                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                prebake: async () => {
                    initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                    const loadModules = evalScope(
                        import('@strudel/core'),
                        import('@strudel/draw'),
                        import('@strudel/mini'),
                        import('@strudel/tonal'),
                        import('@strudel/webaudio'),
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });

           // document.getElementById('proc').value = stranger_tune
        }
        globalEditor.setCode(preprocess(songText));

    }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (globalEditor) {
            globalEditor.setCode(preprocess(songText));
        }
    }, [songText, preprocess]);

    useEffect(() => {
        if (globalEditor) {
            globalEditor.setCode(preprocess(songText));
            if (globalEditor.repl?.state?.started) {
                globalEditor.evaluate();
            }
        }
    }, [p1Radio, preprocess, songText]);


    return (
        <div>
            <h2>Strudel Demo</h2>
            <main>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                            <PreprocessorEditor defaultValue={songText} onChange={(e) => setSongText(e.target.value)} />
                        </div>
                        <div className="col-md-4">

                            <nav>
                                <ProcessControls onProcess={handleProcess} onProcessPlay={handleProcessAndPlay} />
                                <br />
                                <TransportControls onPlay={handlePlay} onStop={handleStop} />
                            </nav>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                            <div id="editor" />
                            <div id="output" />
                        </div>
                        <div className="col-md-4">
                            <P1RadioControls value={p1Radio} onChange={setP1Radio} />

                            <br />
                            {/*<CpmControl />*/}
                            {/*<br />*/}

                            <Slider id="volrange" label="Volume" value={volume} onChange={setVolume} />

                            {/*<br />*/}
                            {/*<FormChecks />*/}
                        </div>
                    </div>
                </div>
                <canvas id="roll"></canvas>
            </main >
        </div >
    );
}