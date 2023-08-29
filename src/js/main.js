const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
  localStorage.clear();
  window.location = "info.html";
});

let levelCount = 1;
let lifts = [];
let requests = [];

if (!localStorage.getItem("saved")) {
  window.location = "info.html";
} else {
  levelCount = localStorage.getItem("levels");
  lifts = JSON.parse(localStorage.getItem("liftState"));
}
function cumulativeTop(element) {
  let top = 0;
  do {
    top += element.offsetTop || 0;
    element = element.offsetParent;
  } while (element);

  return top;
}

function moveLift(floor, lift, isFirst = false) {
  let closestLiftIndex = 0;
  let actualIndex = 0;
  let min = Infinity;
  let availableLifts = lifts.filter((lift) => !lift.moving);
  let currentFloor = 0;
  if (availableLifts.length == 0) {
    return false;
  }
  if (!lift) {
    for (let i = 0; i < availableLifts.length; i++) {
      if (Math.abs(floor - availableLifts[i].currentFloor) < Math.abs(min)) {
        min = floor - availableLifts[i].currentFloor;
        closestLiftIndex = i;
      }
    }
    actualIndex = lifts.findIndex(
      (lift) => lift.id === availableLifts[closestLiftIndex].id
    );
    currentFloor =  lifts[actualIndex].currentFloor;
    lifts[actualIndex] = {
      ...lifts[actualIndex],
      currentFloor: floor,
      moving: true,
    };
  }

  const levelNode = document.getElementById(`level-${floor}`);
  levelYCord = cumulativeTop(levelNode);

  const liftNode = document.getElementById(lift || lifts[actualIndex].id);
  const yCord = cumulativeTop(liftNode);
  liftNode.style.transitionDuration = `${Math.abs(floor - currentFloor)}s`;
  liftNode.style.transform = `translateY(${levelYCord - yCord}px)`;

  if (!isFirst) {
    setTimeout(() => {
      liftNode.style.animationName = "doors-open";
      setTimeout(() => {
        liftNode.style.animationName = "doors-close";
        setTimeout(() => {
          liftNode.style.animationName = "none";
          lifts[actualIndex].moving = false;
        }, 2000);
      }, 4500);
    }, Math.abs(floor - currentFloor) * 1000);
  }

  return true;
}

const levelsContainer = document.getElementById("level-container");
let fragment = document.createDocumentFragment();

function getFloorText(floor) {
  const floorText = document.createElement("p");
  floorText.className = "floor-text";
  floorText.innerText = `Floor ${floor}`;
  return floorText;
}

function getLift(id) {
  const lift = document.createElement("div");
  lift.className = "lift-box";
  lift.id = id;

  for (let i = 0; i < 2; i++) {
    const liftDoor = document.createElement("div");
    liftDoor.className = "lift-door";
    lift.appendChild(liftDoor);
  }
  return lift;
}

function getDirectionButton(type, floor) {
  const button = document.createElement("button");
  button.className = `lift-button ${
    type == "Up" ? "green-button" : "yellow-button"
  }`;

  button.id = `${type}-${floor}`;

  button.innerText = type;

  button.addEventListener("click", () => {
    if (!requests.includes(floor)) {
      requests.push(floor);
      runLifts();
    }
  });

  return button;
}

function runLifts() {
  if (requests.length > 0) {
    let floor = requests[0];
    if (moveLift(floor)) {
      console.log(floor, "achieved");
      requests.shift();
    } else {
      setTimeout(() => runLifts(), 4000);
    }
  }
}

function getFloorButtons(floor, maxFloor) {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";

  if (floor != maxFloor) {
    buttonContainer.appendChild(getDirectionButton("Up", floor));
  }

  if (floor !== 0) {
    buttonContainer.appendChild(getDirectionButton("Down", floor));
  }

  return buttonContainer;
}

for (let i = levelCount - 1; i >= 0; i--) {
  const level = document.createElement("div");
  level.className = "level";
  level.id = `level-${i}`;

  level.appendChild(getFloorButtons(i, levelCount - 1));

  level.appendChild(getFloorText(i));

  if (i == 0) {
    lifts.forEach((lift) => {
      const liftNode = getLift(lift.id);
      level.appendChild(liftNode);
    });
  }
  fragment.appendChild(level);
}

levelsContainer.appendChild(fragment);

window.addEventListener("load", () => {
  console.log("I was fired");
  lifts.forEach((lift) => {
    moveLift(lift.currentFloor, lift.id, true);
  });
});

window.addEventListener("beforeunload", function (e) {
  lifts = lifts.map((lift) => ({ ...lift, moving: false }));
  localStorage.setItem("liftState", JSON.stringify(lifts));
});
