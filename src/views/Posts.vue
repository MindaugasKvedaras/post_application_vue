<template>
  <div class="posts-container">
    <div class="button-search_container">
      <button class="button is-primary is-medium" @click="toggleModal">Create new post</button>
      <div class="search-box">
        <p class="title">Search post</p>
      <input
        class="input is-primary"
        type="text"
        v-model="searchTerm"
        v-debounce:1s="searchPosts"
        debounce-event="input"
      />
      <p class="subtitle has-text-danger" v-if="!articles.length">Sorry :( there is no post with your search "{{ searchTerm }}"</p>
      </div>
    </div>

    <post-get-error
      v-for="error of errors"
      :visible="visibleError"
      :error="error"
      :key="error.code"
      v-on:close-error="closeError"
    ></post-get-error>

    <post-create
      :visible="showModal"
      v-on:close-modal="closeModal"
      v-on:reload-posts="handleGetPosts"
    ></post-create>

    <div class="post-container">
      <post-card
        v-for="article in articles"
        :key="article.id"
        :article="article"
        v-on:reload-posts="handleGetPosts"
        v-on:show-error="showError"
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
      visibleError: false,
      searchTerm: undefined,
      errors: [],
      
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
          error.message = "Oops your server doesn't work!";
          if (error.request) {
            this.errors.push(error);
            this.showError();
          }
        });
    },

    getFilteredPosts() {
      axios
        .get(this.$apiUrl + "/articles?q=" + this.searchTerm)
        .then(response => (this.articles = response.data))
        .then(response => console.log(response))
        .catch(error => {
          error.message = "Oops your server doesn't work!";
          if (error.request) {
            this.errors.push(error);
            this.showError();
          }
        });
    },

    searchPosts(searchTerm) {
      if (!searchTerm) {
        this.getPosts();
      } else {
        this.getFilteredPosts();
      }
      
    },

    handleGetPosts() {
      this.getPosts();
    },

    toggleModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },

    showError() {
      this.visibleError = true;
    },

    closeError() {
      this.visibleError = false;
    }
  },

  created() {
    this.getPosts();
  }
};
</script>

<style scoped>
.posts-container {
  display: flex;
  flex-direction: column;
  margin: 10px;
}
.post-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  margin: 50px 20px;
}

.button-search_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
}

.search-box {
  text-align: center;
  width: 50%;
}
</style>
