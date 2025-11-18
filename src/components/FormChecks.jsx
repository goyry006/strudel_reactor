//implementing this functionality later for Part-B
function FormChecks({ checks, onChange }) {
    return (
        <>
            {/* Checkbox for Snare Layer (s1) */}
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="c1" checked={checks.c1} onChange={(e) =>
                    onChange({ ...checks, c1: e.target.checked }) // updates snare layer toggle
                }/> 

                <label className="form-check-label" htmlFor="checkDefault">
                        s1
                    </label>
            </div>

            {/* Checkbox for Hi-Hat Layer (d1) */}
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="c2" checked={checks.c2} onChange={(e) =>
                    onChange({ ...checks, c2: e.target.checked }) // updates hi-hat layer toggle
                }/>

                <label className="form-check-label" htmlFor="checkChecked">
                        d1
                    </label>
            </div>
        </>
    );
}
export default FormChecks;