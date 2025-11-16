import React from "react";

function JsonControls({ getSettings, applySettings }) {

    // Save settings as JSON file
    const handleSave = () => {

        const settings = getSettings();
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = "strudel-settings.json";
        a.click();
        URL.revokeObjectURL(url);

    };

    // Load settings from JSON file
    const handleLoad = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {

            try
            {
                const data = JSON.parse(event.target.result);
                applySettings(data);

            }
            catch (err)
            {

                alert("Invalid JSON file");

            }
        };

        reader.readAsText(file);
    };

    return (

        <div className="json-bar">

            <div className="json-inner">

                <span className="json-title">🗂 SETTINGS:</span>
                <button className="json-btn" onClick={handleSave}>💾 Save</button>

                <label className="json-btn file-label">
                    📂 Load
                    <input type="file" accept="application/json" onChange={handleLoad} />
                </label>

            </div>

        </div>

    );
}
export default JsonControls;