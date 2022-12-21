<template>
  <div class="posts-container">
    <div class="button-search_container">
      <button class="button is-primary is-medium" @click="toggleModal">
        Create new post
      </button>

      <div class="search-box">
        <p class="title has-text-primary">Search Post</p>
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
        <div class=no-data v-if="errors.length">
          <p class="title has-text-danger">Sorry NO posts for now. Come later!</p>
          <img src="../assets/nodata.jpg"/>
        </div>

        <div class="no-data" v-if="!articles.length && !errors.length">
          <p class="title has-text-danger">
            Sorry, there is no post with your search "{{ searchTerm }}"
          </p>
          <img src="../assets/nodata.jpg"/>
        </div>
      </div>

      <div class="pagination-box" v-if="articles.length">
        <button
          class="button is-small pagination-button"
          :class="{active: showActiveButton}"
          type="button"
          v-for="(pageNumber, index) in pages.slice(page - 1, page + 2)"
          @click="getPosts(), (page = pageNumber), showActiveButton != showActiveButton"
          :key="index"
        >
          {{ pageNumber }}
        </button>
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
      showActiveButton: false,
      errors: [],
      page: 1,
      perPage: 4,
      pages: []
    };
  },

  components: {
    PostCard,
    PostCreate,
    PostGetError,
  },

  methods: {
    getPosts() {
      axios
        .get(this.$apiUrl + "/articles?_page=" + this.page)
        .then(response => (this.articles = response.data))
        .then(console.log(this.page))
        .catch(error => {
          error.message = "Oops! It's not your fault. Our server doesn't work for a second!";
          error.request && this.errors.push(error) & this.showError();
        });
    },

    getFilteredPosts() {
      axios
        .get(this.$apiUrl + "/articles?q=" + this.searchTerm)
        .then(response => (this.articles = response.data))
        .then(response => console.log(response))
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
      this.searchTerm
        ? this.getFilteredPosts()
        : this.getPosts(this.page) & this.$router.push({ path: "/articles" });
    },

    setPages() {
      let numberOfPages = Math.ceil(this.articles.length / this.perPage);
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }

      console.log(numberOfPages);
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
  },

  watch: {
    articles() {
      this.setPages();
    }
  },

  created() {
    this.searchPosts();
  }
};
</script>

<style scoped>
.posts-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
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
  gap: 5px;
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

</style>
