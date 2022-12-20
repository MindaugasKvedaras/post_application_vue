<template>
  <div class="post-container">
    <div>
      <h1 class="title">{{ title }}</h1>
      <p class="subtitle is-6">Article created by {{ author }}</p>
    </div>
    <div>
      <p class="subtitle">{{ body }}</p>
    </div>
    <div class="date">
      <p class="subtitle is-6">Article created <i>{{ createdAt}}</i></p>
      <p class="subtitle is-6" v-if="updatedAt">Article updated <i>{{ updatedAt }}</i></p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      title: undefined,
      body: undefined,
      author: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      id: undefined,
      name: [],
      authors: [],
    };
  },


  methods: {

    getArticleById(id) {
      axios
        .get(this.$apiUrl + "/articles/" + id)
        .then(
          response => (
            (this.title = response.data.title),
            (this.body = response.data.body),
            (this.author = response.data.author),
            (this.createdAt = response.data.createdAt),
            (this.updatedAt = response.data.updatedAt)

          )
        )
        .then(response => console.log(response))
        .then(this.getAuthors)
        // .then(response => this.getAuthorsById(response.data.author))
        .catch(error => {
          error.message = "Oops your server doesn't work!";
          if (error.request) {
            this.errors.push(error);
            this.showError();
          }
        });
    },

    getAuthors() {
        if(this.author = 1) {
            this.author = "Mindaugas"
        } else {
            this.author = "Domas"
        }

        console.log(this.author)
    },

    // getAuthorName() {
    //     this.name = Object.values(this.authors)

    //     console.log(this.name);
    // },


    // getAuthorsById() {
    //   axios
    //     .get(this.$apiUrl + "/authors/")
    //     .then(response => (this.authors = response.data))
    //     .then(response => (console.log(response)))
    //     .then(console.log(this.authors))
    //     .then(this.getAuthors());

    // },

  },

  // computed: {
  //   getRightArticle() {
  //     if(this.id != this.$route.params.id) {
  //       this.$route.push({ name: 'pageNotFound'})
  //     } else {
  //       this.getArticleById(this.$route.params.id)
  //     }

  //   }
  // },

  created() {
    this.getArticleById(this.$route.params.id);
  }
};
</script>

<style>
.post-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  gap: 40px;
}

.date {
  margin-right: auto;
}
</style>
