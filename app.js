window.addEventListener("load", createChart);
document.body.addEventListener("click", createChart);

function createChart() {
    const myChart = document.getElementById('myChart');
    const chart = new CanvasJS.Chart(myChart,
    {
      title:{
        text: "Date-Wise Weight Log"
    },
    axisX:{
        title: "Date",
        gridThickness: 1
    },
    axisY: {
        title: "Weight"
    },
    data: [
    {        
        type: "area",
        // dataPoints: [//array
        // { x: new Date('2012-01-31'), y: 20},
        // { x: new Date(2012, '02', 11), y: 60}
        // ]
          dataPoints: getDataPoints()
    }
    ]
});

    chart.render();
}

function getDataPoints() {
  const log = JSON.parse(localStorage.getItem('log'));
  const dataPoints = [];
  let x = '', y = 10;
  for (const item of log) {
    x = new Date(item.x);
    y = item.y;
    dataPoints.push({'x': x, 'y': y});
  }

  dataPoints.sort(compareFn);
  return dataPoints;
}

function compareFn(a, b) {
  if (a.x < b.x) {
    return -1;
  } else if (a.x > b.x) {
    return 1;
  }
  return 0;
}

const dateField = document.getElementById("date");
const weightKgField = document.getElementById("weightKg");
const weightGField = document.getElementById("weightG");
const addBtn = document.getElementById("submit");
const clearBtn = document.getElementById("clear");
const deleteBtn = document.getElementById("clearLast");

document.body.onload = today(dateField, weightKgField, weightGField);
function today(target, kg, g) {
  const now = new Date();
  let month = (now.getMonth() + 1);               
  let day = now.getDate();
  if (month < 10) 
      month = "0" + month;
  if (day < 10) 
      day = "0" + day;
  const today = now.getFullYear() + '-' + month + '-' + day;
  target.value = today;

  const log = JSON.parse(localStorage.getItem("log"));
  setWeights(log, kg, g);
}

function setWeights(log, kg, g) {
  log.sort(compareFn);
  const weight = log[log.length - 1]?.y??10.000;
  kg.value = parseInt(weight);

  const G = (weight * 1000 - Number(kg.value) * 1000);
  let newG = '';
  if (G / 100 >= 1)
    newG = G;
  else if (G / 10 >= 1)
    newG = '0' + G;
  else
    newG = '00' + G;
  g.value = newG;
}

addBtn.addEventListener("click", () => addLog(dateField, weightKgField, weightGField));

clearBtn.addEventListener('click', () => {
  const log = [];
  localStorage.setItem('log', JSON.stringify(log));
  setWeights(JSON.parse(localStorage.getItem('log')), weightKgField, weightGField)
});

deleteBtn.addEventListener('click', clearLast);

function addLog(dField, kgField, gField) {
  const todaysLog = {'x':'', 'y':''};
  todaysLog.x = dField.value;
  
  const G = gField.value;
  let newG = '';
  if (G / 100 >= 1)
    newG = G;
  else if (G / 10 >= 1)
    newG = '0' + G;
  else
    newG = '00' + G;

  todaysLog.y = Number(kgField.value + '.' + newG);

  const log = JSON.parse(localStorage.getItem('log'))??[];
  log.push(todaysLog);

  localStorage.setItem('log', JSON.stringify(log));
}

function clearLast() {
  const log = JSON.parse(localStorage.getItem('log'))??[];
  log.pop();
  localStorage.setItem('log', JSON.stringify(log));
}