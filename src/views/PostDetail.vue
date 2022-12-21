<template>
  <div class="post-container">
    <div>
      <h1 class="title has-text-primary">{{ title }}</h1>
    </div>
    <div>
      <p class="subtitle">{{ body }}</p>
    </div>
      <p class="subtitle is-6">Article created by {{ author }}</p>
    <div class="date">
      <p class="tag is-6">Article created: {{ createdAt}}</p>
      <p class="tag is-6" v-if="updatedAt">Article updated: {{ updatedAt }}</p>
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
        .catch(error => {
          error.message = "Oops your server doesn't work!";
          error.request && this.errors.push(error) & this.showError();
        });
    },

    getAuthors() {
        this.author = 1 
        ? this.author = "Mindaugas"
        : this.author = "Domas"
        }
    },

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
