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
          v-debounce:1s="searchPosts"
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
            class="button is-small is-primary is-light pagination-button"
            :class="{ active: showActiveButton }"
            v-for="(pageNumber, index) in pages.slice(page - 1, page + 2)"
            @click="getPosts(pageNumber), showActiveButton != showActiveButton"
            :key="index"
          >
            {{ pageNumber }}
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
      :visible="visibleError"
      :error="error"
      :key="error.code"
      @close-error="closeError"
    ></post-get-error>

    <post-create
      :visible="showModal"
      @:close-modal="closeModal"
      @:reload-posts="handleGetPosts"
    ></post-create>

    <div class="post-container" v-if="!loading">
      <post-card
        v-for="article in articles"
        :key="article.id"
        :article="article"
        @:reload-posts="handleGetPosts"
        @:show-error="showError"
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
    this.searchPosts();
  },

  watch: {
    articles() {
      this.setPages();
    }
  },

  data() {
    return {
      articles: [],
      showModal: false,
      visibleError: false,
      searchTerm: undefined,
      showActiveButton: false,
      loading: false,
      isPosts: false,
      errors: [],
      page: 1,
      perPage: 4,
      pages: []
    };
  },

  methods: {
    getPosts(pageNumber) {
      axios
        .get(this.$apiUrl + "/articles?_page=" + pageNumber)
        .then(response => (this.articles = response.data))
        .then(console.log(this.page))
        .then(() => (this.isPosts = true))
        .catch(error => {
          error.message =
            "Oops! It's not your fault. Our server doesn't work for a second!";
          error.request && this.errors.push(error) & this.showError();
        });
    },

    getFilteredPosts() {
      axios
        .get(this.$apiUrl + "/articles?q=" + this.searchTerm)
        .then(response => (this.articles = response.data))
        .then(
          this.$router.push({
            name: "SearchPosts",
            query: { q: this.searchTerm }
          })
        )
        .catch(error => {
          error.message = "Oops your server doesn't work!";
          error.request && this.errors.push(error) & this.showError();
        });
    },

    searchPosts() {
      this.loading = true;
      setTimeout(() => {
        this.searchTerm
          ? this.getFilteredPosts()
          : this.getPosts() & this.$router.push({ path: "/articles" });

        this.loading = false;
      }, 3000);
    },

    setPages() {
      let numberOfPages = Math.ceil(this.articles.length / this.perPage);
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },

    setPostPage() {
      this.page = this.pageNumber;
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
}

.pagination-button {
  width: 30px;
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
