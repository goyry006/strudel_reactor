//implementing this functionality later for Part-B
function CpmControl({ value, onChange }) {

    // Handles real-time input changes in the CPM field
    const handleChange = (e) => {

        const val = e.target.value;

        // Allow empty input temporarily for user editing
        if (val === "") {
           onChange("");
            return;
        }
        const n = Number(val);

        // Ignore non-numeric input
        if (!Number.isFinite(n)) return; 
        onChange(n); 

    };

    // Validate and clamp value when user leaves input field
    const handleBlur = (e) => {
        
        const n = Number(e.target.value);

        // Reset to default CPM if invalid
        if (!Number.isFinite(n))
        {
            onChange(45.5);
        }

        else
        {
            // Clamp valid CPM values between 30 and 300
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