//implementing this functionality later for Part-B
function CpmControl({ value, onChange }) {

    const handleChange = (e) => {

        const val = e.target.value;
        if (val === "") {
           onChange("");
            return;
        }
        const n = Number(val);
        if (!Number.isFinite(n)) return; 
        onChange(n); 

    };

    const handleBlur = (e) => {
        
        const n = Number(e.target.value);
        if (!Number.isFinite(n))
        {
            onChange(45.5);
        }

        else
        {
            onChange(Math.max(30, Math.min(300, n)));
        }

    };

    return (
        <>
            <div className="input-group mb-3">
                <span className="input-group-text" id="cpmLabel">CPM:</span>
                <input type="number" className="form-control" placeholder="45.5" step={0.1} aria-describedby="cpmLabel" value={value} onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={(e) => e.target.select()}
                />
            </div>
        </>
    );
}
export default CpmControl;