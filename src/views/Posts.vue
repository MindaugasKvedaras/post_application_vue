<template>
  <div>
    <button @click="toggleModal">Create new post</button>
    <input type="text" v-model="searchTerm"/>
    <paginate-post>
      <div class="post_container">
          <post
            v-for="article in filteredArticles"
            :key="article.id"
            :article="article"
            :visible="showModal"
            v-on:close-modal="closeModal"
            v-on:reload-posts="getPosts"
          >
          </post>
      </div>
    </paginate-post>
    <div>
      
    </div>
  </div>
</template>

<script>
import axios from "axios";

import Post from "../components/Post.vue";
import PaginatePost from "../components/PaginatePost.vue";

export default {
  data() {
    return {
      articles: [],
      showModal: false,
      searchTerm: undefined,
      searchError: "labas"
    };
  },

  components: {
    Post,
    PaginatePost
  },

  methods: {
    getPosts() {
      axios
        .get(this.$apiUrl + "/articles")
        .then(response => (this.articles = response.data));
    },

    toggleModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },

    searchArticle() {
      axios
        .get(this.$apiUrl + "/articles?q=" + "$searchTerm")
        .then(response => (this.articles = response.data))
        .then(response => console.log(response))

        console.log(this.searchTerm)
    }
  },

  computed: {
    filteredArticles() {

      var articles = this.articles;
      var searchTerm = this.searchTerm;

      if(!searchTerm) {
        return articles;
      }

      searchTerm = searchTerm.trim().toLowerCase();

      articles = articles.filter(function(item) {
        if(item.title.toLowerCase().indexOf(searchTerm) !== -1 || item.body.toLowerCase().indexOf(searchTerm) !== -1)
          return item;
      })

      if(articles.length = 0) {
        return searchError
      }

      return articles;
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
