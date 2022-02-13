import { useEffect, useState, RefObject } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addCrumbData } from "../../data/addCrumbData";
import { iThought } from "../../data/iThought";
import { loadThoughtData } from "../../data/loadThoughtData";
import "./index.scss"
import * as d3 from 'd3'
import React from "react";
import miserables from "./miserables.json"

const data = {
    nodes: [
        {
            "id": "Myriel",
            "group": 1
        },
        {
            "id": "Napoleon",
            "group": 1
        },
        {
            "id": "Mlle.Baptistine",
            "group": 1
        }],
    links: [
        {
            "source": "Napoleon",
            "target": "Myriel",
            "value": 2
        },
        {
            "source": "Mlle.Baptistine",
            "target": "Myriel",
            "value": 2
        }
    ]
}

export const Brainstorm = ({ setLoading }: { setLoading: React.Dispatch<React.SetStateAction<boolean>> }
) => {
    let { brainId, thoughtId } = useParams();
    const [thought, setThought] = useState({} as iThought);
    const navigate = useNavigate();
    const [crumbs, setCrumbs] = useState([] as iThought[]);
    const ref: RefObject<HTMLDivElement> = React.createRef()

    // Copyright 2021 Observable, Inc.
    // Released under the ISC license.
    // https://observablehq.com/@d3/force-directed-graph
    function ForceGraph({
        nodes, // an iterable of node objects (typically [{id}, …])
        links // an iterable of link objects (typically [{source, target}, …])
    }: { nodes: any[], links: any[] }, {
        nodeId = (d: { id: any; }) => d.id, // given d in nodes, returns a unique identifier (string)
        nodeGroup, // given d in nodes, returns an (ordinal) value for color
        nodeGroups, // an array of ordinal values representing the node groups
        nodeTitle, // given d in nodes, a title string
        nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
        nodeStroke = "#fff", // node stroke color
        nodeStrokeWidth = 1.5, // node stroke width, in pixels
        nodeStrokeOpacity = 1, // node stroke opacity
        nodeRadius = 5, // node radius, in pixels
        nodeStrength,
        linkSource = ({ source }: any) => source, // given d in links, returns a node identifier string
        linkTarget = ({ target }: any) => target, // given d in links, returns a node identifier string
        linkStroke = "#999", // link stroke color
        linkStrokeOpacity = 0.6, // link stroke opacity
        linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        linkStrength,
        colors = d3.schemeTableau10, // an array of color strings, for the node groups
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        invalidation // when this promise resolves, stop the simulation
    }: any = {}) {
        // Compute values.
        // @ts-ignore
        const N = d3.map(nodes, nodeId).map(intern);
        // @ts-ignore
        const LS = d3.map(links, linkSource).map(intern);
        // @ts-ignore
        const LT = d3.map(links, linkTarget).map(intern);
        // @ts-ignore
        if (nodeTitle === undefined) nodeTitle = (_: any, i: string | number) => N[i];
        const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
        console.log(nodeTitle)
        // @ts-ignore
        const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
        const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
        const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);


        // Replace the input nodes and links with mutable objects for the simulation.
        nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
        links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

        // Compute default domains.
        if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

        // Construct the scales.
        const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

        // Construct the forces.
        const forceNode = d3.forceManyBody();
        // @ts-ignore
        const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);
        if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
        if (linkStrength !== undefined) forceLink.strength(linkStrength);

        const simulation = d3.forceSimulation(nodes)
            .force("link", forceLink)
            .force("charge", forceNode)
            .force("center", d3.forceCenter())
            .on("tick", ticked);

        const svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        const link = svg.append("g")
            .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
            .attr("stroke-opacity", linkStrokeOpacity)
            .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
            .attr("stroke-linecap", linkStrokeLinecap)
            .selectAll("line")
            .data(links)
            .join("line");

        const node = svg.append("g")
            .attr("fill", nodeFill)
            .attr("stroke", nodeStroke)
            .attr("stroke-opacity", nodeStrokeOpacity)
            .attr("stroke-width", nodeStrokeWidth)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", nodeRadius)
            //@ts-ignore
            .call(drag(simulation));

        //@ts-ignore
        if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
        //@ts-ignore
        if (L) link.attr("stroke", ({ index: i }) => L[i]);
        //@ts-ignore
        if (G) node.attr("fill", ({ index: i }) => color(G[i]));
        //@ts-ignore
        if (T) node.append("title").text(({ index: i }) => T[i]);
        if (invalidation != null) invalidation.then(() => simulation.stop());

        function intern(value: { valueOf: () => any; } | null): any {
            return value !== null && typeof value === "object" ? value.valueOf() : value;
        }

        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        }

        function drag(simulation: d3.Simulation<any, undefined>) {
            function dragstarted(event: { active: any; subject: { fx: any; x: any; fy: any; y: any; }; }) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event: { subject: { fx: any; fy: any; }; x: any; y: any; }) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event: { active: any; subject: { fx: null; fy: null; }; }) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

        return Object.assign(svg.node(), { scales: { color } });
    }

    useEffect(() => {
        //draw()
        const chart = ForceGraph(data, {
            // @ts-ignore
            nodeId: d => d.id,
            // @ts-ignore
            nodeGroup: d => d.group,
            // @ts-ignore
            nodeTitle: d => `${d.id}\n${d.group}`,
            // @ts-ignore
            linkStrokeWidth: l => Math.sqrt(l.value),
            // @ts-ignore
            width: 600,
            height: 600//,
            // @ts-ignore
            //invalidation // a promise to stop the simulation when the cell is re-run
        })
    }, [])

    useEffect(() => {
        // const asyncCall = async () => {
        //     if (!brainId) {
        //         navigate("jerry/32f9fc36-6963-9ee0-9b44-a89112919e29");
        //     } else if (!thoughtId) {
        //         navigate(`${brainId}/32f9fc36-6963-9ee0-9b44-a89112919e29`);
        //     } else {
        //         setLoading(true);
        //         try {
        //             const retrievedThought = await loadThoughtData(thoughtId, brainId);
        //             setThought(retrievedThought);
        //             setCrumbs(await addCrumbData(retrievedThought));
        //         } catch (e) {
        //             console.error(e);
        //             alert(e);
        //         }
        //         setLoading(false);
        //     }
        // }
        // asyncCall();
    }, [thoughtId, brainId, navigate, setLoading]);

    return <div className="brainstorm">
        <div className='HelloD3' ref={ref}>
            <svg width="500" height="500">
            </svg>
        </div>

    </div>
};
