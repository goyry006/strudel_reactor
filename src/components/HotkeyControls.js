import { useEffect, useState } from "react";

function HotkeyControls({ setChecks, setVolume, onPlay, onStop }) {

    const [lastKey, setLastKey] = useState("");

    useEffect(() => {

        const handleKey = (e) => {

            const key = e.key.toLowerCase();
            setLastKey(key);

            switch (key)
            {
                case "1":
                    setChecks(prev => ({ ...prev, c1: !prev.c1 }));  /*checking the s1*/
                    break;

                case "2":
                    setChecks(prev => ({ ...prev, c2: !prev.c2 })); /*checking the d1*/
                    break;

                case "3":
                    setChecks({ c1: false, c2: false }); /*unchecking both d1 & s1*/
                    break;

                case "v":
                    setVolume((v) => Math.max(0, v - 0.1)); /*volume -ve*/
                    break;

                case "b":
                    setVolume((v) => Math.min(1, v + 0.1)); /*volume +ve*/
                    break;

                case "p":
                    onPlay();
                    break;

                case "s":
                    onStop();
                    break;

                default:
                    break;

            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);

    }, [setChecks, setVolume, onPlay, onStop]);

    return (
        <div className="hotkey-bar">
            <div className="hotkey-inner">
                <span className="hotkey-title">🎧 Hotkeys:</span>
                <span className="hotkey-list">
                    [<b>1</b>] s1 &nbsp;|&nbsp; [<b>2</b>] d1 &nbsp;|&nbsp; [<b>3</b>] off &nbsp;|&nbsp;
                    [<b>V</b>/<b>B</b>] volume &nbsp;|&nbsp; [<b>P</b>/<b>S</b>] play/stop
                </span>
                <span className="hotkey-last">
                    Last key: <b>{lastKey ? lastKey.toUpperCase() : "—"}</b>
                </span>
            </div>
        </div>
    );



}
export default HotkeyControls;