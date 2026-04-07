const openMenu = (el) => { el.classList.toggle("change"); document.getElementById('options').classList.toggle('show-options') }
setTimeout(() => openMenu(document.getElementById('options-open')), 500)

const { createApp, ref } = Vue

createApp({
  data: () => ({
    scholl_name: 'EMEF PROF. LUIZ BAPTISTA',
    test_title: 'PROVA DE MATEMÁTICA',
    test_value: '10,0 pontos',
    teacher_name: 'Prof. Renata Jovanini',
    num_of_masks: 4,
    num_of_questions: 10,
    num_of_answers: 4,
    num_of_columns: 1,
    question_text: 'Questão ',
    mask_orientation: 'column',
    scale: 1,
    instructions: `• Coloque seu nome\n• Marque apenas uma alternativa por questão\n• A avaliação é *sem* consulta\n• Se colar, a prova será _zerada_\n• Em cima da mesa apenas:\n- 1 folha para cálculos\n- Lápis e borracha\n- Caneta *azul* ou *preta*\n• Não é permitido celular ou calculadora\n`,
    filled_letter: 2
  }),
  methods: {
    getLetter(num) { return String.fromCharCode(64 + num) },
    divideInt(total, n) {
      const base = Math.floor(total / n)
      const rest = total % n
      return Array.from({ length: n }, (_, i) => i < rest ? base + 1 : base)
    },
    get_number(row, col) { 
      const offset = this.num_of_qs.slice(0, row).reduce((sum, v) => sum + v, 0)
      return offset + col + 1
    },
    boldify(str) {
      let indexes = [ ...str.matchAll(/_/g) ].map(match => match.index)

      for(let i = indexes.length - 1; i > -1; i--) {
        if (i % 2 == 0) {str = str.substring(0, indexes[i]) + '<i>' + str.substring(indexes[i] + 1)}
        else {str = str.substring(0, indexes[i]) + '</i>' + str.substring(indexes[i] + 1)}
      }

      indexes = [ ...str.matchAll(/\*/g) ].map(match => match.index);

      for(let i = indexes.length - 1; i > -1; i--) {
        if (i % 2 == 0 ){str = str.substring(0, indexes[i]) + '<b>' + str.substring(indexes[i] + 1)}
        else{str = str.substring(0, indexes[i]) + '</b>' + str.substring(indexes[i] + 1)}
      }

      return str
    },
  },
  computed: {
    num_of_qs() { return this.divideInt(this.num_of_questions, this.num_of_columns) },
    mask_width() { return `${(this.question_text.length + this.num_of_answers * 7 + 2) * this.num_of_columns}ch` },
    maxQuestions() { return Math.max(...this.num_of_qs) },
    ul_col() { return this.mask_orientation === 'row' ? 1 : this.num_of_columns },
    gap() { return this.mask_orientation === 'row' ? '1em' : 0 },
    instruct() { 
      return this.boldify(this.instructions)
        .trim()
        .split('• ')
        .map(e => e.split('- '))
        .splice(1)
    }
  },
  watch: {
    mask_orientation(newVal) { document.documentElement.style.setProperty('--flex-direction', newVal) },
    mask_width(newVal) { document.documentElement.style.setProperty('--mask-width', newVal) },
    ul_col(newVal) { document.documentElement.style.setProperty('--ul-col-num', newVal) },
    scale(newVal) { document.documentElement.style.setProperty('--scale', newVal) },
    gap(newVal) { document.documentElement.style.setProperty('--gap', newVal) },
    num_of_answers(newVal) { if(newVal < this.filled_letter) this.filled_letter = newVal }
  }
})
.mount('#app')