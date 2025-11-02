function CpmControl() {
    return (
        <div className="input-group mb-3">
            <span className="input-group-text" id="cpmLabel">CPM:</span>
            <input
                id="cpm"                 // <-- important: we read this in Proc()
                type="number"
                className="form-control"
                placeholder="120"
                aria-label="CPM"
                aria-describedby="cpmLabel"
                min="30"
                max="300"
                step="1"
                defaultValue="120"
            />
        </div>
    );
}
export default CpmControl;
