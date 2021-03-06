import Nodes from './js/nodes';
import Links from './js/links';
import Graph from './js/graph';
import { buildFullGraph, isLinkExist, isLinkIntersect, optimize } from './js/linksChecking';

import * as data from '../graph.json';

import './css/style.scss';

const nodes = new Nodes();
const links = new Links();
const graph = new Graph();

graph.restart(nodes, links, true);

let newLinks = buildFullGraph(nodes.nodes, links.links, 0, nodes.nodes.length);

const optimizedLinks = optimize(links.links, nodes.nodes).then(res => {
    res.forEach(l => {
      links.add(l.source, l.target);
    });

    graph.restart(nodes, links, false);
  });

// newLinks.forEach(l => {
//   const isExist = isLinkExist(links.links, l.source, l.target);
//   const isIntersect = isLinkIntersect(nodes.nodes, links.links, l.source, l.target);

//   if (!isExist && !isIntersect) {
//     links.add(l.source, l.target);
//   }
// });

// setTimeout(() => {  
//   graph.restart(nodes, links, false);
// }, 3000);
