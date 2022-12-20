<template>
  <div class="posts-container">
    <div class="button-search_container">
      <button class="button is-primary is-medium" @click="toggleModal">
        Create new post
      </button>
      <div class="search-box">
        <p class="title">Search post</p>
        <input
          class="input is-primary"
          type="text"
          v-model="searchTerm"
          v-debounce:1s="searchPosts"
          debounce-event="input"
        />
        <p v-if="errors.length">Sorry NO posts</p>
        <p
          class="subtitle has-text-danger"
          v-if="!articles.length & !errors.length"
        >
          Sorry :( there is no post with your search "{{ searchTerm }}"
        </p>
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

    <post-pagination
      :page="page"
      :pages="pages"
      :perPage="perPage"
      v-on:set-post-page="setPostPage"
    >
    </post-pagination>

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
import PostPagination from "../components/PostPagination.vue";

export default {
  data() {
    return {
      articles: [],
      showModal: false,
      visibleError: false,
      searchTerm: undefined,
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
    PostPagination
  },

  methods: {
    getPosts() {
      axios
        .get(this.$apiUrl + "/articles")
        .then(response => (this.articles = response.data))
        .then(
          this.$router.push({
            name: 'Posts',
            path: "/articles",
          })
        )
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
        .then(
          this.$router.push({
            path: "/articles/search",
            name: 'SearchPosts',
            query: { q: this.searchTerm }
          })
        )
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

    setPages() {
      let numberOfPages = Math.ceil(this.articles.length / this.perPage);
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },

    paginate(articles) {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return articles.slice(from, to);
    },

    setPostPage() {
      this.page = this.pageNUmber;
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

  computed: {
    displayedArticles() {
      return this.paginate(this.articles);
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
