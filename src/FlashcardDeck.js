import { Component } from "@samzofkie/component";

export class FlashcardDeck extends Component {
  constructor(...children) {
    const gap = 10;
    const padding = 10;
    super(
      'div',
      {
        display: 'flex',
        flexFlow: 'column wrap',
        gap: `${gap}px`,
        padding: `${padding}px`,
        backgroundColor: '#5a5975',
        borderRadius: '20px',
      },
      ...children
    )
    setTimeout(() => {
      const cardHeights = this.children.map(child => child.root.offsetHeight + gap);
      
      function sum(arr) {
        return arr.reduce((acc, curr) => acc + curr, 0);
      }

      let scores = [];
      for (let i=0; i<cardHeights.length-1; i++)
        scores[i] = Math.abs(sum(cardHeights.slice(0, i+1)) - sum(cardHeights.slice(i+1)));

      const middleIndex = scores.indexOf(Math.min(...scores)) + 1;
      const balancedHeight = Math.max(
        sum(cardHeights.slice(0, middleIndex)),
        sum(cardHeights.slice(middleIndex))
      ) 
      + (2 * padding);

      this.set({height: `${balancedHeight}px`});
    }, 50);
  }
}