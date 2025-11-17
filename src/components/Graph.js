import React, { useEffect, useRef, useState } from "react";
import { select, scaleLinear, line, axisBottom, axisLeft, curveMonotoneX, max, transition, } from "d3";

export default function Graph() {

    const svgRef = useRef(null);
    const [data, setData] = useState([]);

    
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
        const ratio = window.devicePixelRatio || 1;
        const rect = svgRef.current.getBoundingClientRect();
        const width = rect.width * ratio;
        const height = rect.height * ratio;

        // tell SVG to render in full pixel resolution
        svg.attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .style("width", "100%")
            .style("height", "100%")
            .style("shape-rendering", "geometricPrecision")
            .style("text-rendering", "optimizeLegibility")
            .style("image-rendering", "optimizeQuality");

        const margin = { top: 40, right: 30, bottom: 45, left: 75 };

        svg.selectAll("*").remove();

        if (data.length === 0)
        {
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


        // ===This is for Gradient ===
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

        
        // ===This is for Glow ===
        const defsGlow = svg.append("defs");
        const filter = defsGlow.append("filter")
            .attr("id", "glow")
            .attr("x", "-50%")
            .attr("y", "-50%")
            .attr("width", "200%")
            .attr("height", "200%");
        filter.append("feGaussianBlur")
            .attr("stdDeviation", "1.6")
            .attr("result", "blur");
        filter.append("feMerge")
            .selectAll("feMergeNode")
            .data(["blur", "SourceGraphic"])
            .enter()
            .append("feMergeNode")
            .attr("in", d => d);


        // ===This is for Line Generator ===
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

        // === Only Y-axis having label, not X axis ===
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
        <div className="graph-wrapper">
            <svg ref={svgRef}></svg>
        </div>
    );

}
