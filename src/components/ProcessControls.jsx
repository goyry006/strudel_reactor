function ProcessControls({ onProcess, onProcessPlay }) {
    return (
        <div className="btn-group" role="group" aria-label="processing">
            <button id="process" className="btn btn-outline-primary" onClick={onProcess}>
                Preprocess
            </button>
            <button id="process_play" className="btn btn-outline-primary" onClick={onProcessPlay}>
                Proc & Play
            </button>
        </div>
    );
}

export default ProcessControls; 
