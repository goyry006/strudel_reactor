let originalLog = null;
const logArray = [];


export default function console_monkey_patch() {

    //If react multicalls this, do nothing
    if (originalLog) return;

    originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    //Overwrite console.log function
    console.log = function (...args) {
        const msg = args.join(" ");

        // Capture only Strudel "[hap]" messages for D3
        if (msg.startsWith("%c[hap]"))
        {

            logArray.push(msg.replace("%c[hap] ", ""));

            if (logArray.length > 100) logArray.splice(0, 1);

            const event = new CustomEvent("d3Data", { detail: [...logArray] });
            document.dispatchEvent(event);

            // still show them faintly in console for debugging
            originalLog.apply(console, ["%c[hap captured]", "color:gray", ...args]);

            return;

        }

        // Ignore only repetitive "sound not found" spam
        if (msg.includes("sound") && msg.includes("not found")) return;

        if (msg.includes("[getTrigger]") && msg.includes("error")) return;

        // Keep everything else visible
        originalLog.apply(console, args);

    };

    console.error = function (...args) {

        const msg = args.join(" ");
       
        if (msg.includes("[getTrigger]") || msg.includes("not found")) return;

        originalError.apply(console, args);
    };

    // --- Override console.warn ---
    console.warn = function (...args) {

        const msg = args.join(" ");

        if (msg.includes("not found")) return;

        originalWarn.apply(console, args);

    };

}

export function getD3Data() {
    return [...logArray];
}

export function subscribe(eventName, listener) {
    document.addEventListener(eventName, listener);
}

export function unsubscribe(eventName, listener) {
    document.removeEventListener(eventName, listener);
}
