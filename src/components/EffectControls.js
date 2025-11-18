import React from "react";

function EffectControls({ effect, setEffect }) {

    return (

        // Container for all audio effect radio buttons
        <div className="effect-controls text-muted small d-flex align-items-center gap-2">

            <b className="text-info">🎵 Effect:</b> 

            <label className="form-check-label"> {/* Reverb radio button - adds room ambience */}

                <input type="radio" className="form-check-input me-1" name="effect" value="reverb" checked={effect === "reverb"}
                    onChange={(e) => setEffect(e.target.value)} />
                Reverb

            </label>

            <label className="form-check-label"> {/* Echo radio button - creates delay repetition */}

                <input type="radio" className="form-check-input me-1" name="effect" value="echo" checked={effect === "echo"}
                    onChange={(e) => setEffect(e.target.value)} />
                Echo

            </label>

            <label className="form-check-label">  {/* Distortion radio button - applies overdrive effect */}

                <input type="radio" className="form-check-input me-1" name="effect" value="distortion" checked={effect === "distortion"}
                    onChange={(e) => setEffect(e.target.value)} />
                Distortion

            </label>
        </div>
    );
}

export default EffectControls;
