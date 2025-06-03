// speed control for clock hands
const speedRange = document.getElementById('speed-range');

speedRange.addEventListener('input', function() {
  const speed = this.value;
  document.documentElement.style.setProperty('--period', 60/speed + 's');
});

// freeze hands at current position
const toggleBtn = document.getElementById("toggle-btn");
const clock = document.querySelector(".clock");
let isPaused = false;

toggleBtn.addEventListener("click", () => {
  isPaused = !isPaused;
  clock.classList.toggle("paused", isPaused);
  toggleBtn.textContent = isPaused ? "Start" : "Stop";
});

// resize clock
function updateRadius() {
  const clock = document.querySelector('.clock');
  const numbers = document.querySelectorAll('.number');
  const radius = clock.offsetWidth / 2.3; // tweak factor as needed

  numbers.forEach(num => {
    num.style.setProperty('--r', radius + 'px');
  });

  hour_hand = document.querySelector('.hour-hand');
  minute_hand = document.querySelector('.minute-hand');
  hour_hand.style.setProperty('height', radius/30 + 'em');
  minute_hand.style.setProperty('height', radius/20 + 'em');
}
window.addEventListener('resize', updateRadius);
window.addEventListener('load', updateRadius);

// change numbers colors
const hourHand = document.querySelector(".hour-hand");
const minuteHand = document.querySelector(".minute-hand");
// const secondHand = document.querySelector(".second-hand");
const numbers = [...document.querySelectorAll(".number")];

const numberAngles = {
  1: 210, 2: 240, 3: 270, 4: 300, 5: 330, 6: 360,
  7: 30, 8: 60, 9: 90, 10: 120, 11: 150, 12: 180,
};

// Keep track of numbers already toggled during this pass
const toggledThisPass = new Set();

// Get rotation angle from transform matrix
function getHandAngle(hand) {
  const transform = getComputedStyle(hand).transform;
  if (transform === "none") return 0;
  const values = transform.split("(")[1].split(")")[0].split(",");
  const [a, b] = [parseFloat(values[0]), parseFloat(values[1])];
  return (Math.round(Math.atan2(b, a) * (180 / Math.PI)) + 360) % 360;
}

// Returns true if two angles are within margin, wrapping around 360°
function isNear(a1, a2, margin = 1) {
  const diff = Math.abs((a1 - a2 + 360) % 360);
  return diff <= margin || diff >= 360 - margin;
}

function checkHandPositions() {
  const hour = getHandAngle(hourHand);
  const minute = getHandAngle(minuteHand);
  // const second = getHandAngle(secondHand);

  numbers.forEach((el, i) => {
    const num = i + 1;
    const target = numberAngles[num];

    // const shouldToggle = isNear(hour, target) || isNear(minute, target) || isNear(second, target);
    const shouldToggle = isNear(hour, target) || isNear(minute, target);

    if (shouldToggle) {
      if (!toggledThisPass.has(num)) {
        el.classList.toggle("black");
        el.classList.toggle("white");
        toggledThisPass.add(num);
      }
    } else {
      toggledThisPass.delete(num); // allow toggle again on next hit
    }
  });
  requestAnimationFrame(checkHandPositions);
}

requestAnimationFrame(checkHandPositions);