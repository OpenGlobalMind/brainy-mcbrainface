import * as d3 from "d3";
import { rectCollide } from "./rectCollide"

const width = 1000;
const height = 1000;

const drag = simulation => {

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

const maxNameLength = 50;
const charMult = 7;
const lineLength = 300;

export function ForceGraph(svgElement, thoughtClicked) {
  const simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody())
    .force("link", d3.forceLink().distance(lineLength).id(d => d.id).strength(.02))
    // .force("x", d3.forceX().strength(.01))
    // .force("y", d3.forceY().strength(.01))
    .force('collision', rectCollide().size(d => {
      console.log(d)
      return [d.name.length > maxNameLength ? maxNameLength * charMult :
        d.name.length * charMult
        , 30]
    }))
    //    .force('collision', rectCollide().size(function(d){return [d.width,d.height]}))
    .on("tick", ticked);

  const svg = d3.select(svgElement)
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const g = svg.append("g");

  let link = g.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.2)
    .selectAll("line");

  let node = g.append("g")
    .attr("fill", "#000")
    .attr("stroke-width", 1.5)
    .selectAll("text")

  function ticked() {
    node.attr("x", d => d.x)
      .attr("y", d => d.y);

    link.attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  }

  // // TODO: invalidation
  //invalidation.then(() => simulation.stop());
  let transform;
  const zoom = d3.zoom().on("zoom", e => {
    g.attr("transform", (transform = e.transform));
    // g.style("stroke-width", 3 / Math.sqrt(transform.k));
    // points.attr("r", 3 / Math.sqrt(transform.k));
  });

  return {
    svg: svg
      .call(zoom)
      .call(zoom.transform, d3.zoomIdentity)
      .node(),
    update({ nodes, links }) {
      // for (const node of nodes) {
      //   if (!node.x) {
      //     node.x = 0
      //     node.y = 0
      //   }
      // }

      // Make a shallow copy to protect against mutation, while
      // recycling old nodes to preserve position and velocity.
      const old = new Map(node.data().map(d => [d.id, d]));
      nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
      links = links.map(d => Object.assign({}, d));



      node = node
        .data(nodes, d => d.id)
        .join(enter => enter.append("text")
          // .attr("width", 100)
          // .attr("height", 10)
          .text(d => {
            let name = d.name
            if (name.length > maxNameLength) {
              name = name.substring(0,maxNameLength) + "…"
            }
            return "🔵" + name
          })
          //.attr("filter","url(#bg-text)")
          .call(drag(simulation))
          .call(node => node.append("title").text(d => d.name)))
        .on("click", thoughtClicked);

      link = link
        .data(links, d => [d.source, d.target])
        .join("line");
      simulation.nodes(nodes);
      simulation.force("link").links(links);
      simulation.alpha(1).restart().tick();
      ticked(); // render now!
    }
  };
}