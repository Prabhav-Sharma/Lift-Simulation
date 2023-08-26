const floorInput = document.getElementById("floor-input");
const liftInput = document.getElementById("lift-input");
const submitButton = document.getElementById("submit-button");

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

let levelCount = 0;
let liftCount = 0;

floorInput.addEventListener("input", (e) => {
  levelCount = e.target.value;
});

liftInput.addEventListener("input", (e) => {
  console.log(e.target.value === 4);
  liftCount = e.target.value;
});

const submitHandler = () => {
  levelCount = Number(levelCount);
  liftCount = Number(liftCount);
  if (
    levelCount > 0 &&
    liftCount > 0 &&
    liftCount <= 10 &&
    levelCount > liftCount
  ) {
    let lifts = [];
    for (let i = 1; i <= liftCount; i++) {
      const lift = getLift(`lift-${i}`);
      lifts.push({ id: lift.id, currentFloor: 0, moving: false });
    }
    localStorage.setItem("liftState", JSON.stringify(lifts));
    localStorage.setItem("saved", true);
    localStorage.setItem("levels", levelCount);

    window.location = "index.html";
  } else {
    resetState();
  }
};

function resetState() {
  alert(
    levelCount < liftCount
      ? "The no. of lifts must be less than floors"
      : "Please input numbers less than 10 and more than 0"
  );
  levelCount = 0;
  liftCount = 0;
  floorInput.value = levelCount;
  liftInput.value = levelCount;
}

window.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    submitHandler();
  }
});

submitButton.addEventListener("click", submitHandler);
