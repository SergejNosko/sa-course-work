export const check = (startFirst, endFirst, startLast, endLast) => {
  const dir1 = { 
    x: endFirst.x - startFirst.x,
    y: endFirst.y - startFirst.y,
  }
  const dir2 = { 
    x: endLast.x - startLast.x,
    y: endLast.y - startLast.y,
  }

  const a1 = -dir1.y;
  const b1 = +dir1.x;
  const d1 = -(a1 * startFirst.x + b1 * startFirst.y);

  const a2 = -dir2.y;
  const b2 = +dir2.x;
  const d2 = -(a2 * startLast.x + b2 * startLast.y);

  const seg1_line2_start = a2 * startFirst.x + b2 * startFirst.y + d2;
  const seg1_line2_end = a2 * endFirst.x + b2 * endFirst.y + d2;

  const seg2_line1_start = a1 * startLast.x + b1 * startLast.y + d1;
  const seg2_line1_end = a1 * endLast.x + b1 * endLast.y + d1;

  if (seg1_line2_start * seg1_line2_end >= 0 || seg2_line1_start * seg2_line1_end >= 0) {
    return false;
  }

  return true;
}

export const isLinkExist = (link, i, j) => {
  return link.find(l => {
    const source = l.source.hasOwnProperty('index') ? l.source.index : l.source;
    const target = l.target.hasOwnProperty('index') ? l.target.index : l.target;

    return (source === i && target === j) || (source === j && target === i);
  });
}

export const isLinkIntersect = (node, link, source, target) => {
  let isIntersect = false;

  for (let i = 0; i < link.length; i++) {
    const sourceIndex = link[i].source.hasOwnProperty('index') ? link[i].source.index : link[i].source;
    const targetIndex = link[i].target.hasOwnProperty('index') ? link[i].target.index : link[i].target;
    if (check(node[sourceIndex], node[targetIndex], node[source], node[target])) {
      isIntersect = true;
    }
  }

  return isIntersect;
}

export const buildFullGraph = (nodes, links, start, end) => {
  const node = nodes.nodes;
  const link = links.links;
  const newLinks = [];
  let foundLink;
  if (start < end) {
    for (let i = start; i < end; i++) {
      for (let j = start; j < end; j++) {
        if (i !== j) newLinks.push({ 
          source: i, 
          target: j,
        });
      }
    }
  } else {
    for (let i = start - 1; i >= end; i--) {
      for (let j = start - 1; j >= end; j--) {
        if (i !== j) newLinks.push({ 
          source: i, 
          target: j,
        });
      }
    }
  }
  
  return newLinks;
}