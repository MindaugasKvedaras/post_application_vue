<template>
  <div>
    <button @click="toggleModal">Create new post</button>
    <div class="post_container">
      <post
        v-for="article in articles"
        :key="article.id"
        :article="article"
        :visible="showModal"
        v-on:close-modal="closeModal"
        v-on:reload-posts="getPosts"
      ></post>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import Post from "../components/Post.vue";

export default {
  data() {
    return {
      articles: [],
      showModal: false
    };
  },

  components: {
    Post
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
