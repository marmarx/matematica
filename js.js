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

  let result = {}
  fatores.forEach(e => {
    if(result[e]) result[e]++
    else result[e]=1
  })

  let print = []
  Object.keys(result).forEach(k => print.push(
    `${k}<sup>${result[k]}</sup>`
  ))
  return print.join(" . ");
}

const func = val => document.getElementById("result").innerHTML = `${Number(val).toLocaleString("pt-BR",{style:"decimal"})} = ${factor(val)}`


