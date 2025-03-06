function startGame() {
  document.getElementById('intro').style.display = 'none';
  document.getElementById('sala1').style.display = 'block';
}

function checkFechadura1() {
  const answer = document.getElementById('fechadura1').value;
  const result = document.getElementById('result1');
  if (answer == 55) {
      result.innerHTML = 'Correto!';
      checkAllFechaduras();
  } else {
      result.innerHTML = 'Tente novamente.';
  }
}

function checkFechadura2() {
  const answer = document.getElementById('fechadura2').value;
  const result = document.getElementById('result2');
  if (answer == 53) {
      result.innerHTML = 'Correto!';
      checkAllFechaduras();
  } else {
      result.innerHTML = 'Tente novamente.';
  }
}

function checkFechadura3() {
  const answer = document.getElementById('fechadura3').value;
  const result = document.getElementById('result3');
  if (answer == 9) {
      result.innerHTML = 'Correto!';
      checkAllFechaduras();
  } else {
      result.innerHTML = 'Tente novamente.';
  }
}

function checkFechadura4() {
  const answer = document.getElementById('fechadura4').value;
  const result = document.getElementById('result4');
  if (answer == 12) {
      result.innerHTML = 'Correto!';
      checkAllFechaduras();
  } else {
      result.innerHTML = 'Tente novamente.';
  }
}

function checkAllFechaduras() {
  const result1 = document.getElementById('result1').innerHTML;
  const result2 = document.getElementById('result2').innerHTML;
  const result3 = document.getElementById('result3').innerHTML;
  const result4 = document.getElementById('result4').innerHTML;
  if (result1 === 'Correto!' && result2 === 'Correto!' && result3 === 'Correto!' && result4 === 'Correto!') {
      document.getElementById('nextRoom1').style.display = 'block';
  }
}

function nextRoom(currentRoom, nextRoom) {
  document.getElementById(currentRoom).style.display = 'none';
  document.getElementById(nextRoom).style.display = 'block';
}

function checkEnigma1() {
  const answer = document.getElementById('enigma1').value;
  const result = document.getElementById('result5');
  if (answer == 30) {
      result.innerHTML = 'Correto!';
      checkAllEnigmas();
  } else {
      result.innerHTML = 'Tente novamente.';
  }
}

function checkEnigma2() {
  const answer = document.getElementById('enigma2').value;
  const result = document.getElementById('result6');
  if (answer == 8) {
      result.innerHTML = 'Correto!';
      checkAllEnigmas();
  } else {
      result.innerHTML = 'Tente novamente.';
  }
}

function checkEnigma3() {
  const answer1 = document.getElementById('enigma3-1').value;
  const answer2 = document.getElementById('enigma3-2').value;
  const result = document.getElementById('result7');
  if ((answer1 == 3 && answer2 == 4) || (answer1 == 4 && answer2 == 3)) {
      result.innerHTML = 'Correto!';
      checkAllEnigmas();
  } else {
      result.innerHTML = 'Tente novamente.';
  }
}

function checkAllEnigmas() {
  const result5 = document.getElementById('result5').innerHTML;
  const result6 = document.getElementById('result6').innerHTML;
  const result7 = document.getElementById('result7').innerHTML;
  if (result5 === 'Correto!' && result6 === 'Correto!' && result7 === 'Correto!') {
      document.getElementById('nextRoom2').style.display = 'block';
  }
}

function checkFinalCode() {
  const codigo1 = document.getElementById('codigo1').value;
  const codigo2 = document.getElementById('codigo2').value;
  const result = document.getElementById('result8');
  if (codigo1 == 70 && codigo2 == 69) {
      result.innerHTML = 'Correto! Parabéns, vocês escaparam da Biblioteca dos Números Perdidos!';
  } else {
      result.innerHTML = 'Tente novamente.';
  }
}