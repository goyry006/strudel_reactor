import React, { useEffect, useRef, useState } from "react";
import {
    select,
    scaleLinear,
    line,
    axisBottom,
    axisLeft,
    curveMonotoneX,
    max,
    transition,
} from "d3";

export default function Graph() {
    const svgRef = useRef(null);
    const [data, setData] = useState([]);

    // Listen for Strudel HAP events
    useEffect(() => {
        const handleD3Event = (event) => {
            const raw = event.detail || [];
            const parsed = raw
                .map((entry) => {
                    const match = entry.match(/note:(\d+(\.\d+)?)/);
                    return match ? parseFloat(match[1]) : null;
                })
                .filter((v) => v !== null);
            setData(parsed);
        };

        document.addEventListener("d3Data", handleD3Event);
        return () => document.removeEventListener("d3Data", handleD3Event);
    }, []);

    useEffect(() => {
        const svg = select(svgRef.current);
        const width = svgRef.current.clientWidth || 600;
        const height = svgRef.current.clientHeight || 300;
        const margin = { top: 40, right: 30, bottom: 45, left: 75 };

        svg.selectAll("*").remove();

        if (data.length === 0) {
            svg
                .append("text")
                .attr("x", width / 2)
                .attr("y", height / 2)
                .attr("text-anchor", "middle")
                .attr("fill", "gray")
                .text("Waiting for Strudel data...");
            return;
        }

        const x = scaleLinear()
            .domain([0, data.length - 1])
            .range([margin.left, width - margin.right]);

        const y = scaleLinear()
            .domain([0, max(data) + 5])
            .range([height - margin.bottom, margin.top]);

        // === Gradient ===
        const defs = svg.append("defs");
        const gradient = defs
            .append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", y(0))
            .attr("x2", 0)
            .attr("y2", y(max(data)));

        gradient
            .selectAll("stop")
            .data([
                { offset: "0%", color: "#00ff77" },
                { offset: "100%", color: "#ff004c" },
            ])
            .enter()
            .append("stop")
            .attr("offset", (d) => d.offset)
            .attr("stop-color", (d) => d.color);

        // === Glow ===
        const defsGlow = svg.append("defs");
        const filter = defsGlow.append("filter").attr("id", "glow");
        filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "blur");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "blur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // === Line Generator ===
        const lineGen = line()
            .x((d, i) => x(i))
            .y((d) => y(d))
            .curve(curveMonotoneX);

        svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "url(#line-gradient)")
            .attr("stroke-width", 2.5)
            .attr("filter", "url(#glow)")
            .attr("d", lineGen)
            .transition(transition().duration(500))
            .attr("d", lineGen);

        // === X-axis (keep numbers only) ===
        const xAxis = axisBottom(x).ticks(6);
        const gx = svg
            .append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxis);
        gx.selectAll("text").style("fill", "#66ffff").style("font-size", "10px");
        gx.selectAll(".domain, .tick line").attr("stroke", "#66ffff").attr("opacity", 0.3);

        // === Y-axis ===
        const yAxis = axisLeft(y).ticks(6);
        const gy = svg
            .append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxis);
        gy.selectAll("text").style("fill", "#66ffff").style("font-size", "10px");
        gy.selectAll(".domain, .tick line").attr("stroke", "#66ffff").attr("opacity", 0.3);

        // === Gridlines ===
        svg
            .append("g")
            .attr("class", "grid")
            .attr("transform", `translate(${margin.left},0)`)
            .call(
                axisLeft(y)
                    .tickSize(-width + margin.left + margin.right)
                    .tickFormat("")
            )
            .selectAll("line")
            .attr("stroke", "#00ffff")
            .attr("stroke-opacity", 0.05);

        // === Only Y-axis label (no X label) ===
        svg
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("fill", "#66ffff")
            .attr("font-size", "11px")
            .text("Note Value (Pitch / MIDI Number)");
    }, [data]);

    return (
        <div className="glass-card h-100 beats-card">
            <div className="card-head">
                🎵 <span style={{ color: "#66ffff" }}>LIVE NOTE GRAPH</span>
            </div>
            <div className="card-body">
                <svg
                    ref={svgRef}
                    width="100%"
                    height="320px"
                    className="border border-primary rounded p-2"
                ></svg>
            </div>
        </div>
    );
}
