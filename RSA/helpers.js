// character conversion
const charAdjust = 100
const numToChar = (n) => String.fromCharCode(n - charAdjust) || ''
const charToNum = (c) => (c.charCodeAt(0) + charAdjust) || ''

// precodification table
const createTable = (sourceTable, add = 0) => {
  if(sourceTable.length === 0) return {}

  const myMap = {}
  let num = charAdjust + add // index must have at least 3 algarisms

  sourceTable.forEach(n => {
    myMap[num] = String.fromCharCode(n)
    num++
  })

  // console.log(myMap)
  return myMap
}

// table with 1000 characters
/*
const table = createTable([
  ...Array.from({ length: 200 }, (_, index) => index + 0),
  ...Array.from({ length: 200 }, (_, index) => index + 200),
  ...Array.from({ length: 200 }, (_, index) => index + 400),
  ...Array.from({ length: 200 }, (_, index) => index + 600),
  ...Array.from({ length: 200 }, (_, index) => index + 800),
])
*/

// example table: A is at index 65, A-Z is 26 characters
const newTable = () => createTable(Array.from({ length: 26 }, (_, index) => index + 65), 65)

// square root for BigInt -> Newton's Method
const bigintSqrt = (value) => {
  if (value < 0n) throw new RangeError("Square root of negative numbers is not supported.")
  if (value < 2n) return value

  const newtonStep = (n, g0) => {
      // >> 1n is equivalent to Math.floor(val / 2)
      const g1 = (n / g0 + g0) >> 1n
      if (g0 === g1 || g0 === g1 - 1n) return g0
      return newtonStep(n, g1)
  }

  return newtonStep(value, value >> 1n)
}

// check if a number is prime
const isPrime = (numN) => {
  const num = BigInt(numN)
  // Numbers less than or equal to 1 are not prime
  if (num <= 1n) return false
  
  // 2 is the only even prime number
  if (num === 2n) return true
  
  // Exclude all other even numbers
  if (num % 2n === 0n) return false

  // Check odd factors up to the square root of the number
  const boundary = bigintSqrt(num) // BigInt(Math.sqrt(Number(num)))
  for (let i = 3n; i <= boundary; i += 2n) {
    if (num % i === 0n) return false // Found a factor, so it's not prime
  }

  return true // No factors found, it is prime
}

// find the greateast common divisor (using Euclidean algorithm)
const gcd = (aN, bN) => {
  let a = BigInt(aN)
  let b = BigInt(bN)

  return b === 0n ? a : gcd(b, a % b)
}

// module -> using modular exp
const model = (base, exp, mod) => { // (base ** exp) % mod
  let b = BigInt(base) % BigInt(mod)
  let e = BigInt(exp)
  let m = BigInt(mod)
  let res = 1n

  while (e > 0n) {
    if (e % 2n === 1n) {
      res = (res * b) % m
    }
    b = (b * b) % m
    e = e / 2n
  }
  return res.toString()
}

// inverse module
const findModInverse = (a, m) => {
  let m0 = BigInt(m)
  let y = 0n, x = 1n
  let a_big = BigInt(a)
  let m_big = BigInt(m)

  if (m_big === 1n) return 0n

  while (a_big > 1n) {
    if (m_big === 0n) return 0n
    
    // q is quocient
    let q = a_big / m_big
    let t = m_big

    // m is the rest now, the process continues using regular Euclides
    m_big = a_big % m_big
    a_big = t
    t = y

    y = x - q * y
    x = t
  }

  // x < 0 -> abs(m0)
  if (x < 0n) x += m0

  return x
}

// split number in chucks not greater than n
const splitNumber = (str, maxN) => {
  const parts = []
  let i = 0
  const maxBig = BigInt(maxN)
  
  while (i < str.length) {
    // tries to take a chunk containing N algarisms
    let chunkLength = maxN.toString().length
    let chunk = str.slice(i, i + chunkLength)

    // if the chunk is greater or equal than N, reduces it size in 1
    // while (BigInt(chunk) >= maxBig || chunk.length > str.length - i) {
    while (chunk.length > 0 && (BigInt(chunk) >= maxBig || chunk.length > str.length - i)) {
      chunkLength--
      chunk = str.slice(i, i + chunkLength)
    }

    parts.push(chunk)
    i += chunkLength
  }
  
  return parts
}