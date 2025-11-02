
function P1RadioControls({value, onChange }) {
    return (
        <>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="p1Radio" id="p1-on" checked={value === 'ON'}
                    onChange={() => onChange('ON')} />
                <label className="form-check-label" htmlFor="p1-on">
                        p1: ON
                </label>
            </div>

            <div className="form-check">
                <input className="form-check-input" type="radio" name="p1Radio" id="p1-hush" checked={value === 'HUSH'}
                    onChange={() => onChange('HUSH')} />
                <label className="form-check-label" htmlFor="p1-hush">
                        p1: HUSH
                </label>
            </div>
        </>
    );

}
export default P1RadioControls;
