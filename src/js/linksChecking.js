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

export const buildFullGraph = (node, link, start, end) => {
  const newLinks = [];
  if (start < end) {
    for (let i = start; i < end; i++) {
      for (let j = 0; j < node.length; j++) {
        if (i !== j) {
           newLinks.push({
            source: i, 
            target: j,
          });
        }
      }
    }
  } else {
    for (let i = start - 1; i >= end; i--) {
      for (let j = node.length - 1; j >= 0; j--) {
        if (i !== j) {
          newLinks.push({
            source: i,
            target: j,
          });
        }
      }
    }
  }
  
  return newLinks;
}

const findLinksAsync = (node, link, i, j) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(buildFullGraph(node, link, i, j));
    }, 100);
  });
}

const calculateWayWidth = (node, link) => {
  return link.reduce((sum, l) => {
    const sourceNode = node[l.source];
    const targetNode = node[l.target];
    const width = Math.sqrt(Math.pow((targetNode.x - sourceNode.x), 2) + Math.pow((targetNode.y - sourceNode.y), 2));

    return sum + width;
  }, 0);
}

export const optimize = async (link, node) => {
  const waysArray = [];
  let firstPart;
  let secondPart;
  let foundLinks;

  for (let i = 0; i < node.length; i++) {
    const filteredLinks = [];
    for (let j = 0; j < node.length; j++) {
      if (i !== j) {
        if (i === 0) {
          foundLinks = await findLinksAsync(node, link, i, j + 1);
        } else if (i === node.length - 1) {
          foundLinks = await findLinksAsync(node, link, i, 0);
        } else {
          firstPart = await findLinksAsync(node, link, i, 0);
          secondPart = await findLinksAsync(node, link, i, j + 1);
          foundLinks = [...firstPart, ...secondPart];
        }
      }
    }

    // check for existence and duplication in the source link array
    foundLinks = foundLinks.filter((l, i) => {
      const isExist = isLinkExist(link, l.source, l.target);
      const isIntersect = isLinkIntersect(node, link, l.source, l.target);

      return !isExist && !isIntersect;
    });

    // check for existence and duplication in the target link array
    foundLinks.forEach(l => {
      const isExist = isLinkExist(filteredLinks, l.source, l.target);
      const isIntersect = isLinkIntersect(node, filteredLinks, l.source, l.target);

      if (!isExist && !isIntersect) {
        filteredLinks.push({
          source: l.source,
          target: l.target,
        });
      }
    });

    waysArray.push(filteredLinks);
  }

  const optimalWidth = waysArray.map((l, i) => {
    const width = calculateWayWidth(node, l);

    return {
      i,
      width,
    }
  }).sort((cur, next) => {
    return cur.width > next.width ? 1 : -1;
  });

  return waysArray[optimalWidth[0].i];
}
