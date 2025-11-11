//implementing this functionality later for Part-B
function FormChecks({ checks, onChange }) {
    return (
        <>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="c1" checked={checks.c1} onChange={(e) =>
                    onChange({ ...checks, c1: e.target.checked })} />

                <label className="form-check-label" htmlFor="checkDefault">
                        s1
                    </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="c2" checked={checks.c2} onChange={(e) =>
                    onChange({ ...checks, c2: e.target.checked })} />

                <label className="form-check-label" htmlFor="checkChecked">
                        d1
                    </label>
            </div>
        </>
    );
}
export default FormChecks;