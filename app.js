var winnersEl = document.querySelector('#winners');
var colors = [
  '#F9F9F9',
  '#FAE8E0',
  '#FFF4E3',
  '#E7F2F5',
  '#FCEAE6',
  '#ECEEF1',
  '#FFEDC2',
  '#DCE9F2',
  '#F5F0DF',
  '#E7F3E8',
  '#F8EBF0',
  '#FFF2D9',
];

var users = [
  '40%',
  '1000MMK',
  '20%',
  '1000MMK',
  '10%',
  '5000MMK',
  '50%',
  '1000MMK',
  '20%',
  '5000MMK',
  '10%',
  '1000MMK',
];

var startAngle = 0;
var arc = Math.PI / 6;
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;
var isSpinning = false;
var count = 0;
var hasWinner = false;

if (localStorage.getItem('__count')) {
  count = parseInt(localStorage.getItem('__count'));
}

function drawRouletteWheel() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 125;

    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 500, 500);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    ctx.font = 'normal 12px Helvetica, Arial';

    for (var i = 0; i < 12; i++) {
      var angle = startAngle + i * arc;
      ctx.fillStyle = colors[i];

      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'rgb(220,220,220)';
      ctx.fillStyle = 'black';
      ctx.translate(
        250 + Math.cos(angle + arc / 2) * textRadius,
        250 + Math.sin(angle + arc / 2) * textRadius
      );
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = users[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }

    //Arrow
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.fill();
  }
}

function spin() {
  if (isSpinning) return;
  count++;
  isSpinning = true;
  spinAngleStart = Math.random() * 10 + 10;
  // spinAngleStart = 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 200 + 500;
  // spinTimeTotal = 800;
  spinTimeout && clearTimeout(spinTimeout);
  rotateWheel();
  document.getElementById('logo').classList.add('shake');
  document.getElementById('cat').classList.add('fade-in-out', 'float-up-down');
  document.getElementById('dog').classList.add('fade-in-out', 'float-up-down');
}

function rotateWheel() {
  spinTime += 2;
  var potential = currentWinner();
  if (spinTimeTotal - spinTime < 300) {
    if (potential === '50%') {
      spinTimeTotal = spinTime + 240;
    } else if (potential === '40%') {
      if (count < 10) {
        spinTimeTotal = spinTime + 240;
      } else {
        hasWinner = true;
      }
    }
  }
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle =
    spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI) / 180;
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}

function currentWinner() {
  var degrees = (startAngle * 180) / Math.PI + 90;
  var arcd = (arc * 180) / Math.PI;
  var index = Math.floor((360 - (degrees % 360)) / arcd);
  return users[index];
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var winner = currentWinner();
  ctx.fillText(winner, 250 - ctx.measureText(winner).width / 2, 250 + 10);
  ctx.restore();
  if (hasWinner && winner === '40%') {
    count = 0;
  }
  localStorage.setItem('__count', count);
  setTimeout(() => {
    isSpinning = false;
    document.getElementById('logo').classList.remove('shake');
    document
      .getElementById('cat')
      .classList.remove('fade-in-out', 'float-up-down');
    document
      .getElementById('dog')
      .classList.remove('fade-in-out', 'float-up-down');
  }, 800);
}

function easeOut(t, b, c, d) {
  var ts = (t /= d) * t;
  var tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

drawRouletteWheel();
