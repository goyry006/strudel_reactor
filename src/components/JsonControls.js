import React from "react";

function JsonControls({ getSettings, applySettings }) {

    // Save settings as JSON file
    const handleSave = () => {

        const settings = getSettings();
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" }); // Convert to formatted JSON blob
        const url = URL.createObjectURL(blob); // Create temporary URL for download
        const a = document.createElement("a");

        a.href = url;
        a.download = "strudel-settings.json";
        a.click();
        URL.revokeObjectURL(url); // Free memory

    };

    // Load settings from JSON file
    const handleLoad = (e) => {

        const file = e.target.files[0]; // Get uploaded file

        if (!file) return; // Exit if no file selected

        const reader = new FileReader();
        reader.onload = (event) => {

            try
            {
                const data = JSON.parse(event.target.result); // Parse JSON content
                applySettings(data); // Apply to app 

            }

            catch (err)
            {

                alert("Invalid JSON file");

            }
        };

        reader.readAsText(file); // Read file as text
    };

    return (

        // Persistent control bar for saving/loading JSON configuration
        <div className="json-bar">

            <div className="json-inner">

                <span className="json-title">🧩 SETTINGS:</span>

                {/* Save configuration button */}
                <button className="json-btn" onClick={handleSave}>💾 Save</button>

                {/* Load configuration file input */}
                <label className="json-btn file-label">
                    📂 Load
                    <input type="file" accept="application/json" onChange={handleLoad} />
                </label>

            </div>

        </div>

    );
}
export default JsonControls;