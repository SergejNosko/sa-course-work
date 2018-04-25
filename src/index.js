import Nodes from './js/nodes';
import Links from './js/links';
import Graph from './js/graph';
import { buildFullGraph } from './js/linksChecking';

import './css/style.scss';

const nodes = new Nodes();
const links = new Links();
const graph = new Graph();

graph.restart(nodes, links, true);

buildFullGraph(nodes, links);

setTimeout(() => { 
  graph.restart(nodes, links, false);
}, 3000);
