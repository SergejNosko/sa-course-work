import * as data from '../../graph.json';

class Nodes {
  constructor() {
    this.nodes = data.nodes;
  }

  add = (x, y) => {
    this.links.push({ x, y, fixed: true });
  }
}

export default Nodes;
