import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  group: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
}

const data = {
  nodes: [
    { id: '1', name: 'Financiamento', group: 1 },
    { id: '2', name: 'SUVs', group: 2 },
    { id: '3', name: 'Troca/Retoma', group: 1 },
    { id: '4', name: 'Test Drive', group: 3 },
    { id: '5', name: 'Populares', group: 2 },
    { id: '6', name: 'Seguro', group: 3 },
  ],
  links: [
    { source: '1', target: '2' },
    { source: '2', target: '4' },
    { source: '3', target: '1' },
    { source: '5', target: '1' },
    { source: '4', target: '6' },
    { source: '6', target: '2' },
  ]
};

const AutoGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 280;
    const height = 260;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation<Node>(data.nodes as any)
      .force('link', d3.forceLink<Node, Link>(data.links as any).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-120))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('stroke', '#334155')
      .attr('stroke-width', 1);

    const node = svg.append('g')
      .selectAll('circle')
      .data(data.nodes)
      .enter().append('circle')
      .attr('r', 7)
      .attr('fill', d => d.group === 1 ? '#22c55e' : d.group === 2 ? '#3b82f6' : '#f59e0b')
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    node.append('title').text(d => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => { simulation.stop(); };
  }, []);

  return (
    <div style={{ width: '100%', height: '260px', background: '#0f172a', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default AutoGraph;
