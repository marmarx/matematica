Vue.createApp({
  data: () => ({
    num:[
      [],
      [1,2,4,5],
      [1,2,3,4,5,6],
      [2,3,5,6],
      [1,2,4,5,7,8],
      [1,2,3,4,6,7,8,9],
      [2,3,5,6,8,9],
      [4,5,7,8],
      [4,5,6,7,8,9],
      [5,6,8,9]
    ]
  }),
  methods: {
    flip(ele){
      for(let i=0; i<this.num[ele].length; i++){
        document.getElementById(this.num[ele][i]).classList.toggle("flip");
      }
    }
  },
}).mount("#app");