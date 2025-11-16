// === Graph.js ===
// React component for visualising Strudel .log() output in real time using D3
// Compatible with your console_monkey_patch.js (dispatches 'd3Data' events)

import React, { useEffect, useRef, useState } from "react";
import {
    select,
    scaleLinear,
    line,
    axisBottom,
    axisLeft,
    curveMonotoneX,
    max,
} from "d3";

export default function Graph() {
    const svgRef = useRef(null);
    const [data, setData] = useState([]); // stores parsed HAP values

    // === Listen for d3Data events from console_monkey_patch.js ===
    useEffect(() => {
        const handleD3Event = (event) => {
            // event.detail is an array of up to 100 strings from console logs
            const raw = event.detail || [];
            const parsed = raw.map((entry) => {
                // Extract "note:XX" numeric values from strings
                const match = entry.match(/note:(\d+(\.\d+)?)/);
                return match ? parseFloat(match[1]) : null;
            }).filter((v) => v !== null);
            setData(parsed);
        };

        document.addEventListener("d3Data", handleD3Event);
        return () => document.removeEventListener("d3Data", handleD3Event);
    }, []);

    // === Draw / Update graph ===
    useEffect(() => {
        const svg = select(svgRef.current);
        const width = svgRef.current.clientWidth || 600;
        const height = svgRef.current.clientHeight || 300;
        const margin = { top: 20, right: 20, bottom: 30, left: 50 };

        // Clear previous drawings
        svg.selectAll("*").remove();

        if (data.length === 0) {
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height / 2)
                .attr("text-anchor", "middle")
                .attr("fill", "gray")
                .text("Waiting for Strudel data...");
            return;
        }

        // === Define scales ===
        const x = scaleLinear()
            .domain([0, data.length - 1])
            .range([margin.left, width - margin.right]);

        const y = scaleLinear()
            .domain([0, max(data)])
            .range([height - margin.bottom, margin.top]);

        // === Define line generator ===
        const lineGen = line()
            .x((d, i) => x(i))
            .y((d) => y(d))
            .curve(curveMonotoneX);

        // === Draw path ===
        svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#00ffff")
            .attr("stroke-width", 2)
            .attr("d", lineGen);

        // === Draw axes ===
        svg
            .append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(axisBottom(x).ticks(5));

        svg
            .append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(axisLeft(y).ticks(5));

    }, [data]);

    // === Responsive resizing ===
    useEffect(() => {
        const resizeHandler = () => setData((d) => [...d]);
        window.addEventListener("resize", resizeHandler);
        return () => window.removeEventListener("resize", resizeHandler);
    }, []);

    return (
        <div className="glass-card h-100 beats-card">
            <div className="card-head">D3 LIVE GRAPH</div>
            <div className="card-body">
                <svg
                    ref={svgRef}
                    width="100%"
                    height="300px"
                    className="border border-primary rounded p-2"
                ></svg>
            </div>
        </div>
    );
}
