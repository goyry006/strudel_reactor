//Functionality for this Part-A of reactAssignment
function Slider({ id = "volrange", label = "Volume", min = 0, max = 1, step = 0.01, value, onChange }) {
    return (
        <>
            {label && <label htmlFor={id} className="form-label">{label}</label>}
            <input type="range" className="form-range" id={id} min={min}  max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
            />
        </>
    );
}
export default Slider;
