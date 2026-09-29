const { createApp, ref, computed, watch } = Vue

createApp({
  setup() {
    // --- STATE ---
    const tableX = ref(newTable())

    const p_user = ref(17)
    const q_user = ref(23)
    const e_user = ref(3)

    const prev_p = ref(17)
    const prev_q = ref(23)
    const prev_e = ref(3)
    
    const message = ref('O rato roeu a roupa do rei de roma!')
    
    // --- METHOD ACTIONS ---
    const setSecureKeys = () => {
      p_user.value = 1000000007
      q_user.value = 1000000009
      console.log(p_user.value, q_user.value)
    }

    // --- COMPUTED STATE ---
    const pIsPrime = computed(() => isPrime(p_user.value))
    const qIsPrime = computed(() => isPrime(q_user.value))

    const p = computed(() => pIsPrime.value ? BigInt(p_user.value) : BigInt(prev_p.value)) 
    const q = computed(() => qIsPrime.value ? BigInt(q_user.value) : BigInt(prev_q.value))

    const p_error = computed(() => pIsPrime.value ? '' : `Error: ${p_user.value} não é um número primo, ${p.value} será usado`)
    const q_error = computed(() => qIsPrime.value ? '' : `Error: ${q_user.value} não é um número primo, ${q.value} será usado`)

    const n = computed(() => p.value * q.value)
    const euler = computed(() => (p.value - 1n) * (q.value - 1n))

    const e_gcd = computed(() => gcd((e_user.value || 3), euler.value))
    const e_coprime = computed(() => e_gcd.value === 1n)
    const e = computed(() => e_coprime.value ? BigInt(e_user.value) : BigInt(prev_e.value))
    const e_error = computed(() => {
      const used = e_user.value === prev_e.value ? 'por favor, utilize um valor adequado' : `então 𝓮 = ${e.value} será usado`
      return e_coprime.value ? '' : `Error: ${e_user.value} não é coprimo de ${euler.value}, uma vez que o MDC(${e_user.value}, ${euler.value}) é ${e_gcd.value}, ${used}`
    })

    const d = computed(() => findModInverse(e.value, euler.value))

    const codificada = computed(() => Array
      .from(message.value)
      .map(char => charToNum(char))
      .join('')
    )

    const msgBlocks = computed(() => splitNumber(codificada.value, n.value))

    const cifrada   = computed(() => msgBlocks.value.map(M => model(M, e.value, n.value)))
    const decifrada = computed(() => cifrada  .value.map(C => model(C, d.value, n.value)))

    const decodedNum = computed(() => decifrada.value.join(''))

    const chunkSize = ref(3)

    const decodedBlocks = computed(() => {
      const chunkLen = chunkSize.value
      const chunks = []

      const str = decodedNum.value
      for (let i = 0; i < str.length; i += chunkLen) {
        chunks.push(str.slice(i, i + chunkLen))
      }
      return chunks
    })

    const decodificada = computed(() => decodedBlocks.value
      .map(num => numToChar(num))
      .join('')
    )

    // --- WATCHER ---
    watch(p_user, (p) => {
      if(!pIsPrime.value) return
      prev_p.value = p
    })

    watch(q_user, (q) => {
      if(!qIsPrime.value) return
      prev_q.value = q
    })

    watch(e_user, (e) => {
      if(!e_coprime.value) return
      prev_e.value = e
    })

    return {
      p_user, q_user, p_error, q_error, p, q,
      n, euler,
      e_user, e_error, e, d,
      tableX, chunkSize,
      message, codificada, msgBlocks, cifrada,
      decifrada, decodedNum, decodedBlocks, decodificada,
      setSecureKeys
    }
  }
}).mount('#app');