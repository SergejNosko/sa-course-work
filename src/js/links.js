import * as data from '../../graph.json';

class Links {
  constructor() {
    this.links = data.links;
  }

  add = (source, target) => {
    this.links.push({ source, target });
  }
}

export default Links;
