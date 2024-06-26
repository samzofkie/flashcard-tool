import { Component } from "@samzofkie/component";

class Node extends Component {
  constructor(name, parents = []) {
    super(
      'div',
      {
        backgroundColor: '#bfbeed',
        padding: '10px',
        borderRadius: '20px',
        position: 'absolute'
      },
      name
    );
    this.hide();
    this.name = name;
    this.parents = parents;
  }
}

export class Graph extends Component {
  constructor(data) {
    const padding = 10;
    super('div', {
      padding: `${padding}px`,
      backgroundColor: '#5a5975',
      borderRadius: '20px',
      height: '1000px',
      position: 'relative',
    });

    this.elements = [];
    this.nodeMap = new Map;

    // Create Nodes
    for (const datum of data) {
      let node = new Node(datum.name);
      this.elements.push(node);
      this.nodeMap[datum.name] = node;
    }

    // Create "parent" edges between Nodes
    for (const datum of data)
      if (datum.hasOwnProperty('inherits'))
        for (let parentName of datum.inherits.split(', ')) {
          const parentNode = this.nodeMap[parentName];
          if (parentNode)
            this.nodeMap[datum.name].parents.push(parentNode);
        }

    this.append(...this.elements);

    function arrangeNodes() {
      // Find "leaves": all nodes with no decendants
      let childCount = Object.fromEntries(this.elements.map(elem => [elem.name, 0]));
      for (const elem of this.elements) {
        if (elem.hasOwnProperty('parents')) {
          for (const parent of elem.parents) {
            childCount[parent.name]++;
          }
        }
      }
      let leaves = Object.keys(childCount).filter(name => childCount[name] === 0);

      const arrayRemove = (elem, arr) => arr.splice(arr.indexOf(elem), 1);
      let x = padding, y = padding;
      while (leaves.length) {
        const node = this.elements.find(elem => elem.name === leaves[0]);

        // Get all parents of this leaf
        let chain = [node];
        let tmp = node;
        while (tmp.parents.length) {
          tmp = tmp.parents[0];
          chain.push(tmp);
        }
        chain = chain.reverse();

        // Position each link in the chain
        for (let link of chain) {
          link.set({ top: `${y}px`, left: `${x}px` });
          y += link.root.offsetHeight + padding;
          link.show();
        }

        x += Math.max(...chain.map(link => link.root.offsetWidth)) + padding;
        y = padding;
        arrayRemove(leaves[0], leaves);
      }
    }

    // Call arrangeNodes() only once all Node.roots have actually been loaded to the DOM
    const observer = new MutationObserver(() => {
      if (this.elements.every(elem => document.contains(elem.root)))
        arrangeNodes.call(this);
    });
    observer.observe(document, { attributes: false, childList: true, subtree: true });
  }
}