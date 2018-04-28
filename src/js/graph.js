import { check } from './linksChecking';

class Graph {
  constructor() {
    this.force = d3.layout.force()
        .size([960, 500])
        .charge(-400)
        .linkDistance(40)
        .on('tick', this.tick);

    this.drag = this.force.drag()
        .on('dragstart', this.dragstart);

    this.svg = d3.select('body').append('svg')
        .attr('width', 960)
        .attr('height', 500);

    this.linkTags = this.svg.selectAll('.link');
    this.nodeTags = this.svg.selectAll('.node');
  }

  tick = () => {
    this.linkTags.attr('x1', (d) => ( d.source.x ))
      .attr('y1', (d) => ( d.source.y ))
      .attr('x2', (d) => ( d.target.x ))
      .attr('y2', (d) => ( d.target.y )); 

    this.nodeTags.attr('cx', (d) => ( d.x ))
      .attr('cy', (d) => ( d.y ));
  }

  // dblclick = (d) => {
  //   d3.select(this).classed('fixed', d.fixed = false);
  // }

  // dragstart = (d) => {
  //   d3.select(this).classed('fixed', d.fixed = true);
  // }

  restart = (nodes, links, isFirst) => {
    this.force
      .links(links.links)
      .nodes(nodes.nodes)
      .start();

    this.linkTags = this.linkTags.data(links.links)
      .enter().append('line')
        .attr('class', 'link');

    this.nodeTags = this.nodeTags.data(nodes.nodes)
      .enter().append('circle')
        .attr('class', 'node')
        .attr('r', 12);
        // .on('dblclick', this.dblclick)
        // .call(this.drag);
    
    if (!isFirst) {
      this.linkTags = this.linkTags.attr('class', 'link_dashed');
      //this.tick();
    }
  }
}

export default Graph;
