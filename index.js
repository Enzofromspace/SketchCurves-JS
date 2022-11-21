const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

let elCanvas;
let points;

const sketch = ({ canvas }) => {
  points = [
    new Point({ x:200, y:540 }),
    new Point({ x:400, y:700 }),
    new Point({ x:880, y:540 }),
    new Point({ x:600, y:700 }),
    new Point({ x:640, y:900 }),
  ];

  //add event listener and added event handlers (mousedown called when event happens)
  canvas.addEventListener('mousedown', onMouseDown);

  elCanvas = canvas;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    /*
    context.strokeStyle = '#999';
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    
    for(let i = 1; i < points.length; i ++ ) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.stroke();

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    
    for(let i = 1; i < points.length; i +=2 ) {
      context.quadraticCurveTo(points[i + 0].x, points[i + 0].y, points[i + 1].x, points[i + 1].y);
    }
    */
    context.stroke();
/*Old way to set points replaced by for loop
    context.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
    context.quadraticCurveTo(points[3].x, points[3].y, points[4].x, points[4].y);
*/
    points.forEach(point => {
      point.draw(context);
    });
  };
};

const onMouseDown = (e) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  // calc location of cursor based on scale of canvas
  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  points.forEach(point => {
    point.isDragging = point.hitTest(x, y);
  });
};

const onMouseMove = (e) => {
  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  points.forEach(point => {
    if (point.isDragging) {
      point.x = x;
      point.y = y;
    }
  });
};

const onMouseUp = () => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

canvasSketch(sketch, settings);

class Point {
  constructor({ x,y, control = false }){
    this.x = x;
    this.y = y;
    this.control = control;
  }
  
  draw(context){
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.control ? 'red' : 'black';

    context.beginPath();
    context.arc(0,0,10,0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  hitTest(x,y) {
    const dx = this.x - x;
    const dy = this.y - y;
    const dd = Math.sqrt(dx * dx + dy * dy);

    return dd < 20;
  }
}
