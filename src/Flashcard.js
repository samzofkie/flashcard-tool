import { Component } from "@samzofkie/component";

function bulletsFromParagraph(paragraph) {
  return new Component(
    'ul',
    {
      margin: 0,
    },
    ...paragraph.split('.')
      .filter(s => s)
      .map(sentence =>
        new Component('li', sentence + '.')
      )
  );
}

export class Flashcard extends Component {
  constructor(data) {
    super(
      'div',
      { 
        backgroundColor: '#bfbeed',
        padding: '10px',
        borderRadius: '20px',

        display: 'grid', //'flex',
        gridTemplateColumns: '40% 60%',
        //gap: '10px',
        width: '600px'
      },
      new Component(
        'div',
        {
          className: 'lefthand-column',
          display: 'flex',
          flexFlow: 'column nowrap',
          overflowWrap: 'break-word',
          //width: '200px',
          gap: '10px',
        },
        new Component(
          'code', 
          {
            fontSize: '30px',
            fontWeight: 'bold',
            //width: '200px',
          },
          data.name
        ),
        new Component(
          'code',
          {
            backgroundColor: '#5a5975',
            color: 'white',
            padding: '5px',
            borderRadius: '10px',
          },
          data.declaration
        ),
        data.hasOwnProperty('inherits') ? 
          new Component(
            'p',
            {
              margin: '0px',
              overflowWrap: 'normal,'
            },
            'Is derived from ',
            new Component('code', data.inherits),
          ) : null,
      ),
      new Component(
        'div',
        {
          className: 'righthand-column',
          display: 'flex',
          flexFlow: 'column nowrap',
          overflowWrap: 'break-word',
          //maxWidth: '400px',
        },
        bulletsFromParagraph(data.description),
      )
    );
  }
}