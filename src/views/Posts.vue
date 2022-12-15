<template>
  <div>
    <button @click="toggleModal">Create new post</button>
    <input
      type="text"
      v-model="searchTerm"
      v-debounce:1s="searchPosts"
      debounce-event="input"
    />
    <post-get-error
      v-for="error of errors"
      :visible="visibleError"
      :error="error"
      :key="error.code"
    ></post-get-error>

    <post-create
      :visible="showModal"
      v-on:close-modal="closeModal"
      v-on:reload-posts="handleGetPosts"
    ></post-create>

    <div class="post_container">
      <post-card
        v-for="article in articles"
        :key="article.id"
        :article="article"
        v-on:reload-posts="handleGetPosts"
      >
      </post-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import PostCard from "../components/PostCard.vue";
import PostCreate from "../components/PostCreate.vue";
import PostGetError from "../components/PostGetError.vue";

export default {
  data() {
    return {
      articles: [],
      showModal: false,
      visibleError: true,
      searchTerm: undefined,
      errors: []
    };
  },

  components: {
    PostCard,
    PostCreate,
    PostGetError
  },

  methods: {
    getPosts() {
      axios
        .get(this.$apiUrl + "/articles")
        .then(response => (this.articles = response.data))
        .catch(error => {
          if (error.request) {
            this.errors.push(error)
            console.log(this.visibleError);
          }
        });
    },

    getFilteredPosts() {
      axios
        .get(this.$apiUrl + "/articles?q=" + this.searchTerm)
        .then(response => (this.articles = response.data))
        .then(response => console.log(response));
    },

    searchPosts(searchTerm) {
      if (!searchTerm) {
        this.getPosts();
      } else if (searchTerm) {
        this.getFilteredPosts();
      }
      els;
    },

    handleGetPosts() {
      this.getPosts();
    },

    toggleModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  },

  created() {
    this.getPosts();
  }
};
</script>

<style scoped>
.post_container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  margin: 50px 20px;
}
</style>
