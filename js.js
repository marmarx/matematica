function factor(n){
  if (n < 2) return [n]

  let fatores = [];
  let divisor = 2;

  while (n > 1) {
    while (n % divisor === 0){
      fatores.push(divisor);
      n /= divisor;
    }
    divisor++;
    if(divisor * divisor > n && n > 1) {
      fatores.push(n);
      break;
    }
  }
  return fatores;
}

const func = val => document.getElementById("demo").innerHTML = factor(val)
