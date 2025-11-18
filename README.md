# **STRUDel – Interactive Web Music Sequencer**

This web-based application is an interactive music sequencer developed using React, D3.js, and the Strudel.cc framework. It allows users to write musical patterns, process them in real time, and visualize their playback through both graphical and audio components.

## **Overview**

The system enables users to compose short musical phrases and experiment with sound directly in the browser. By integrating Strudel’s live coding environment with the Web Audio API, the application processes user input dynamically and provides immediate feedback through sound output and visualization.

The interface has been designed to replicate the experience of a lightweight digital audio workstation (DAW). It combines real-time sound generation, rhythm control, and visual feedback within a single, browser-based interface.

## Control Descriptions


1. **Preprocess:** 
   
    Prepares the user’s Strudel code by converting placeholders such as <tempoLine> and <s1> into valid syntax before playback. This step ensures that user adjustments to tempo, rhythm layers, and volume are reflected in the processed output.

3. **Proc & Play:**
   
    Combines preprocessing and playback in one step. It automatically applies the user’s latest settings and initiates the music sequence without requiring two separate actions.

5. **Play:**
   
    Executes the currently loaded Strudel code, beginning real-time sound output through the browser’s audio engine.

7. **Stop:**
   
    Stops all sound generation and resets the playback state. It is an immediate stop function for testing or composition refinement.

9. **Pattern Toggle (p1: ON / HUSH):**
    
    This toggle switches the primary pattern layer on or off. “ON” maintains the main rhythmic structure, while “HUSH” silences it temporarily without resetting user configurations.

11. **Volume Slider:**

    The volume slider controls the master gain level of all active sounds. Adjusting the slider updates the gain node in real time, which directly affects the amplitude of the Web Audio context.
    It provides precise volume management and displays the numeric value alongside the slider.
    Internally, volume changes also trigger a code re-render to maintain consistency between the visual display and Strudel playback.
    The value range is normalized between 0 and 1, allowing fine-grained control over loudness without clipping or distortion.

12. **CPM (Cycles Per Minute):**

    The CPM control determines the playback speed of the composition. It converts user input from CPM to CPS (Cycles Per Second), which is required by Strudel’s timing engine.
    Changes to CPM automatically adjust the <tempoLine> in the code, synchronizing both rhythmic playback and visual rendering.
    A default of 45.5 CPM is provided, representing a moderate tempo suitable for electronic rhythm patterns.
    Values are clamped between 30 and 300 to prevent unrealistic speeds or audio desynchronization.

13. **FormCheck (Layer Toggles):**

    The FormCheck component enables or disables additional rhythmic layers within the music. Two key layers are available:

- **s1 (Snare Layer):** Adds a repeating snare pattern to enrich rhythm.

- **d1 (Hi-Hat Layer):** Adds a hi-hat pattern (hh(3,8)) with gain adjustment for softer balance.

    When checked, these options append corresponding Strudel commands (s("bd sn"), s("hh(3,8)").gain(0.7)) to the main stack.
    This system allows dynamic layering of beats during playback and is frequently used for creating contrast or rhythm variation in live compositions.

9. **Radio Buttons (Audio Effects):**

    The radio buttons select one of three global sound effects applied to the entire playback:

- **Reverb:** Simulates room acoustics using mainStack.room(0.9) to produce spatial depth.

- **Echo:** Adds delay and repetition with mainStack.delay(0.4) for rhythmic echo.

- **Distortion:** Applies an overdrive effect using mainStack.distort(0.8) to produce a more aggressive timbre.

    Each effect modifies the Strudel chain before evaluation, allowing users to experiment with different sonic textures without altering their base code.

10. **Hotkeys:**

    The application includes keyboard shortcuts to support live performance and faster interaction:

- **1:** Toggles the snare layer (s1).

- **2:** Toggles the hi-hat layer (d1).

- **3:** Silences all playback (uncheck both).

- **V / B:** Decrease or increase volume.

- **P / S:** Play or stop the playback instantly.

    These hotkeys are intended to replicate the live-coding performance environment found in Strudel and TidalCycles, allowing on-the-fly improvisation and immediate feedback during demonstrations.

11. **Theme Toggle (Light / Dark Mode):**

    The theme toggle switch dynamically changes between light and dark modes by setting the HTML root attribute data-theme.
    It instantly updates CSS variables such as --hero-bg1, --txt, and --muted, allowing global color transformation without reloading the page.
    The dark mode improves contrast for D3 visuals and aligns with modern music production interfaces.
    This toggle is fully reactive and stored temporarily in the browser’s runtime, ensuring seamless transitions without external dependencies.

12. **Beats Visualizer (Canvas Piano Roll):**

    The Beats panel displays the rhythmic and melodic content of the live music using a canvas-based piano roll visualization.
    It is powered by Strudel’s drawPianoroll function, which renders horizontal bars corresponding to note lengths and positions.
    The system continuously updates in real time as the user modifies patterns or applies preprocessing.
    
    Each bar represents a note event—its position maps to timing, and its height corresponds to pitch.
    The visualization provides immediate feedback on rhythmic accuracy, layering, and tempo.
    The canvas automatically resizes with the browser window and adjusts for high-DPI displays using the devicePixelRatio property.
    This ensures crisp visuals suitable for performance projection or marking demonstrations.

13. **JSON Controls (Save and Load Configuration):**

    The JSON system allows users to preserve or reload complete session states for consistent playback.
    When Save is clicked, the application serializes key values—including pattern state, volume, CPM, selected effects, and checkbox settings—into a downloadable .json file.
    When Load is used, the system reads that file, parses it, and restores every saved parameter into the interface.
    
    This ensures reproducibility of results between sessions, allowing a user to continue where they left off without manually reconfiguring settings.
    The feature also supports demonstration marking, since assessors can reload the same configuration used in the video proof.
    Internally, JSON handling is done through the File API, ensuring privacy and zero server-side storage.
    It provides persistence, consistency, and a reusable template for sharing musical configurations across users or performances.

14. **D3 Graph (Live Note Visualization):**

    The D3 Graph provides a real-time visual representation of all note data produced by Strudel’s playback engine.
    It listens for d3Data events emitted by the Web Audio context and parses each note’s pitch (MIDI value) before plotting it dynamically using D3.js.
    
    The graph automatically scales its axes to fit the range of incoming notes, showing how pitch evolves across time.
    A gradient stroke transitions from green to red, visually representing note intensity, while a subtle Gaussian blur filter adds glow for clarity.
    Each new note smoothly animates into the graph through D3’s transition engine, creating a fluid waveform-like motion.
    
    The purpose of this component is to help visualize the structure of musical layers—whether percussive, melodic, or harmonic.
    It enhances feedback for the performer by showing the relationship between rhythmic density, pitch range, and real-time playback events.
    It also helps demonstrate data-binding concepts between live music code and real-time SVG rendering, bridging creative coding and data visualization

## **Quirks and Usage Guidelines**

1. Audio will only start after few seconds the user’s first click to the proc and play or jst play , patiently wait until the graph starts appears.

2. Changes to CPM, volume, or effect selections automatically trigger re-rendering.

3. The system performs best in Google Chrome or Microsoft Edge.

4. JSON loading replaces existing settings, so users should save configurations before loading a new one.

5. The dark theme is visually optimized for low-light or performance environments

## **Demonstration Video**

[🎥 Watch the STRUDel Demo on YouTube](https://youtu.be/ypw1xvHAL88)
   
   I have added the recorded video into the zipped file as well.

## **Bonus Points and Evidence**

1. Real-time D3 visualization synchronized with musical playback.

2. Integrated hotkey system for live performance.

3. JSON persistence system for configuration storage.

4. Responsive glassmorphic UI design based on dynamic theme toggling.

5. Video demonstration.

## **Song Code Attribution**

Patterns adapted and customized from the Strudel.cc Bakery 
"theres no soul here" @by froos 
@date 23-08-21
@version 1.0
Additional layering logic and gain adjustments were implemented to enhance rhythm and tonal balance.

## **AI Tools Used**

ChatGPT was used solely to assist with debugging layout inconsistencies, refining alignment of UI components (notably CPM and Navbar controls), and preparing initial documentation drafts.
All code implementation, testing, and design verification were manually completed in Visual Studio Code.
AI inputs were restricted to descriptive problem-solving and phrasing support, and all outputs were revised to comply with academic integrity requirements.

## **References**

1. W3Schools.com. (n.d.). https://www.w3schools.com/graphics/canvas_intro.asp
2. Contributors, M. O. J. T. a. B. (n.d.). Checks and radios. https://getbootstrap.com/docs/5.3/forms/checks-radios/#without-labels
3. W3Schools.com. (n.d.-b). https://www.w3schools.com/react/react_forms_radio.asp
4. W3Schools.com. (n.d.-c). https://www.w3schools.com/js/js_json.asp
