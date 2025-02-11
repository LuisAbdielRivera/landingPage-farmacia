const app = Vue.createApp({
  data() {
    return {
      searchInput: "",
      dataColumns: ["title", "topic", "views"],
      dataset: []
    };
  },
  methods: {
    async fetchVideos() {
      try {
        const response = await fetch("http://localhost:5000/videos");
        this.dataset = await response.json();
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    }
  },
  mounted() {
    this.fetchVideos();
  }
})

app.component("database-website-component", {
  template: '#grid-template',
  props: {
    entries: Array,
    columns: Array,
    filterKey: String
  },
  data() {
    return {
      sortKey: '',
      sortOrders: this.columns.reduce((o, key) => ((o[key] = 1, o)), {})
    }
  },
  computed: {
    filteredData() {
      let data = this.entries
      if (this.filterKey) {
        data = data.filter(row =>
          Object.keys(row).some(key =>
            String(row[key]).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1
          )
        )
      }
      const key = this.sortKey
      if (key) {
        const order = this.sortOrders[key]
        data = data.slice().sort((a, b) => {
          a = a[key]
          b = b[key]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
  methods: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    sortBy(key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    }
  }
})

app.mount("#database-website")