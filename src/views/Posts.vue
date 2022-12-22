<template>
  <div class="posts-container">
    <div class="button-search_container">
      <button class="button is-primary is-medium" @click="toggleModal">
        Create new post
      </button>

      <div class="search-box">
        <p class="title has-text-primary">Search Funny Joke</p>
        <input
          class="input is-primary"
          placeholder="Type Something..."
          type="text"
          v-model="searchTerm"
          v-debounce:1s="getFilteredPosts"
          debounce-event="input"
        />
      </div>

      <div class="no-post-container">
        <div class="no-data" v-if="articles.length < 0 && !this.isPosts">
          <p class="title has-text-danger">
            Sorry NO posts for now. Come later!
          </p>
          <img src="../assets/nodata.jpg" />
        </div>

        <div
          class="no-data"
          v-if="!articles.length && !errors.length && !loading"
        >
          <p class="title has-text-danger">
            Sorry, there is no post with your search "{{ searchTerm }}"
          </p>
          <img src="../assets/nodata.jpg" />
        </div>
      </div>

      <div class="pagination-box" v-if="articles.length">
        <p class="subtitle is-6 has-text-primary">Go through pages</p>
        <div class="buttons">
          <button 
            class="button is-small is-primary is-light page-button"
            @click="getPosts(1, postPerPage)"
          >
          First
          </button>
          <button
            class="button is-small is-primary is-light pagination-button"
            :class="{ active: showActiveButton }"
            v-for="(pageNumber, index) in pages"
            @click="getPosts(pageNumber, postPerPage), showActiveButton != showActiveButton"
            :key="index"
          >
            {{ pageNumber }}
          </button>
          <button 
            class="button is-small is-primary is-light page-button"
            @click="getPosts(8, postPerPage)"
          >
          Last
          </button>

        </div>
      </div>

      <div class="no-data loading" v-if="loading">
        <p class="subtitle has-text-primary">Loading...Take a breath</p>
        <img src="../assets/loading.gif" />
      </div>
    </div>

    <post-get-error
      v-for="error of errors"
      :visible="showError"
      :error="error"
      :key="error.code"
      @close-error="toggleError"
    ></post-get-error>

    <post-create
      :visible="showModal"
      @toggle-error="toggleError"
      @close-modal="toggleModal"
      @reload-posts="handleGetPosts"
    ></post-create>

    <div class="post-container" v-if="!loading">
      <post-card
        v-for="article in articles"
        :key="article.id"
        :article="article"
        @reload-posts="handleGetPosts"
        @show-error="toggleError"
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
  components: {
    PostCard,
    PostCreate,
    PostGetError
  },

  created() {
    this.getPosts(1, 3);
    console.log(this.postPerPage)
  },

  data() {
    return {
      articles: [],
      showModal: false,
      showError: false,
      searchTerm: undefined,
      showActiveButton: false,
      loading: false,
      isPosts: false,
      errors: [],
      postPerPage: 3,
      pages: ["1", "2", "3", "4", "5", "6", "7", "8"]
    };
  },

  methods: {
    getPosts(pageNumber, postPerPage) {
      axios
        .get(this.$apiUrl + `/articles?_page=${pageNumber}&_limit=${postPerPage}`)
        .then(response => (this.articles = response.data))
        .then(() => (this.isPosts = true))
        .catch(error => {
          error.request && this.errors.push(error) & this.toggleError();
        });
    },

    getFilteredPosts() {
      this.loading = true;
      this.searchTerm
        ? axios
          .get(this.$apiUrl + "/articles?q=" + this.searchTerm)
          .then(response => (this.articles = response.data))
          .catch(error => {
            error.request && this.errors.push(error) & this.toggleError();
          })
        : this.getPosts() & this.$router.push({ path: "/articles" });
        
      this.loading = false  
    },

    handleGetPosts() {
      this.getPosts();
    },

    toggleModal() {
      this.showModal = !this.showModal;
    },

    toggleError() {
      this.showError = !this.showError;
    }
  }
};
</script>

<style scoped>
.posts-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: 100vh;
}
.post-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
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

.pagination-box {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.pagination-button {
  width: 30px;
}

.page-button {
  width: 60px;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.no-data img {
  width: 50%;
}

.loading img {
  width: 100%;
}
</style>
