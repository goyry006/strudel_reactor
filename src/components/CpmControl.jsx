//implementing this functionality later for Part-B
function CpmControl({ value, onChange }) {
    return (
        <>
            <div className="input-group mb-3">
                <span className="input-group-text" id="cpmLabel">CPM:</span>
                <input type="number" className="form-control" placeholder="120" min={30} max={300} step={1} aria-describedby="cpmLabel" value={value}  onChange={(e) => {
                        const n = Number(e.target.value);
                        onChange(Number.isFinite(n) ? Math.max(30, Math.min(300, n)) : 120);
                    }}/>
            </div>
        </>
    );
}
export default CpmControl;