<template>
  <div>
    <button v-if="page != 1" v-on:click="previousPage">Previous</button>
    <button
      v-for="pageNumber in pages.slice(page - 1, page + 5)"
      v-on:click="page = pageNumber"
    >
      {{ pageNumber }}
    </button>
    <button v-if="page < pages.length" v-on:clik="page++">-->></button>
  </div>
</template>
<script>
export default {
  data() {
    return {
        showPage: this.page
    }
  },

  props: {
    page: {
      type: Number
    },

    pages: {
      type: Array
    },

    perPage: {
      type: Number
    }
  },
  methods: {
    previousPage() {
        this.showPage--;
        this.$emit("pageChanged", this.showPage);
    },

    nextPage() {
        this.page++;
    }
  }

//   watch: {
//     page: {
//       handler: function(newVal) {
//         this.showPage = newVal;
//       }
//     },

};
</script>
<style></style>
