export const annotateNode = (annotations, elementId) => {
  const selectors = annotations
    .map(annotation => annotation.selector)
    .sort((a, b) => {
      return b.length - a.length;
    });

  const regEx = new RegExp(selectors.join("|"), "g");
  const selectorToAnnotation = annotations.reduce((map, annotation) => {
    map[annotation.selector] = annotation;
    return map;
  }, {});
  const node = document.getElementById(elementId);
  const nodes = getNodeChildren(node).filter(filterTextNode);
  nodes.forEach(splitTextNode(regEx));

  getNodeChildren(node)
    .filter(filterTextNode)
    .filter(withoutSpan)
    .forEach(wrapMatchInSpan(selectors, selectorToAnnotation));
};

const wrapMatchInSpan = (selector, selectorToAnnotation) => {
  return node => {
    if (selector.includes(node.nodeValue)) {
      const span = document.createElement("span");
      span.classList.add("annotation");
      span.dataset.id = selectorToAnnotation[node.nodeValue].id;
      span.dataset.selector = selectorToAnnotation[node.nodeValue].selector;
      span.appendChild(document.createTextNode(node.nodeValue));
      node.replaceWith(span);
    }
  };
};

const withoutSpan = node => {
  while (node.parentNode && node.parentNode.id !== "source") {
    node = node.parentNode;
    if (node.tagName === "SPAN") {
      return false;
    }
  }

  return true;
};

const splitTextNode = regEx => {
  return node => {
    Array.from(node.nodeValue.matchAll(regEx)).reduce(
      (acc, match) => {
        const rest = acc.node.splitText(match.index - acc.index);
        return {
          node: rest.splitText(match[0].length),
          index: match.index + match[0].length
        };
      },
      { node, index: 0 }
    );
  };
};

const filterTextNode = node => {
  return node.nodeType === Node.TEXT_NODE;
};

const getNodeChildren = (node, nodes) => {
  nodes = nodes || [];
  nodes.push(node);
  if (node.hasChildNodes()) {
    Array.from(node.childNodes).forEach(child => {
      return getNodeChildren(child, nodes);
    });
  }
  return nodes;
};
