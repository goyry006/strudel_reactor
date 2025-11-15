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
                    setChecks({ c1: true, c2: false });
                    break;

                case "2":
                    setChecks({ c1: true, c2: true });
                    break;

                case "3":
                    setChecks({ c1: false, c2: false });
                    break;

                case "v":
                    setVolume((v) => Math.max(0, v - 0.1));
                    break;

                case "b":
                    setVolume((v) => Math.min(1, v + 0.1));
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
        <div className="text-center text-muted small mt-3">
            <b>Hotkeys:</b> [1] s1 | [2] s1+d1 | [3] off | [V/B] volume | [P/S] play/stop
            <br />
            Last key: <b>{lastKey.toUpperCase()}</b>
        </div>
    );
}
export default HotkeyControls;