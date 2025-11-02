function Slider() {
    return (
        <>

            <label for="volRange" className="form-label">Volume</label>
            <input type="range" className="form-range" min="0" max="1" step="0.01" id="volrange" />
        </>
    );
}
export default Slider;