export const check = (startFirst, endFirst, startLast, endLast) => {
  const dir1 = { 
    x: endFirst.x - startFirst.x,
    y: endFirst.y - startFirst.y,
  }
  const dir2 = { 
    x: endLast.x - startLast.x,
    y: endLast.y - startLast.y,
  }

  //считаем уравнения прямых проходящих через отрезки
  const a1 = -dir1.y;
  const b1 = +dir1.x;
  const d1 = -(a1 * startFirst.x + b1 * startFirst.y);

  const a2 = -dir2.y;
  const b2 = +dir2.x;
  const d2 = -(a2 * startLast.x + b2 * startLast.y);

  //подставляем концы отрезков, для выяснения в каких полуплоскотях они
  const seg1_line2_start = a2 * startFirst.x + b2 * startFirst.y + d2;
  const seg1_line2_end = a2 * endFirst.x + b2 * endFirst.y + d2;

  const seg2_line1_start = a1 * startLast.x + b1 * startLast.y + d1;
  const seg2_line1_end = a1 * endLast.x + b1 * endLast.y + d1;

  //если концы одного отрезка имеют один знак, значит он в одной полуплоскости и пересечения нет.
  if (seg1_line2_start * seg1_line2_end >= 0 || seg2_line1_start * seg2_line1_end >= 0) {
    return false;
  }

  return true;
}

export const buildFullGraph = (nodes, links) => {
  const node = nodes.nodes;
  const link = links.links;
  for (let i = 0; i < node.length; i++) {
    for (let j = 0; j < node.length; j++) {
      if (i === j) continue;

      let isIntersect = false;
      for (let k = 0; k < link.length; k++) {
        const sourceIndex = link[k].source.hasOwnProperty('index') ? link[k].source.index : link[k].source;
        const targetIndex = link[k].target.hasOwnProperty('index') ? link[k].target.index : link[k].target;

        if (check(node[i], node[j], node[sourceIndex], node[targetIndex])) {
          isIntersect = true;
        }
      }
      const isExist = link.find(l => {
        const source = l.source.hasOwnProperty('index') ? l.source.index : l.source;
        const target = l.target.hasOwnProperty('index') ? l.target.index : l.target;

        return (source === i && target === j) || (source === j && target === i);
      });

      if (!isIntersect && !isExist) {
        link.push({
          source: i,
          target: j,
        });
      };
    }
  }
}