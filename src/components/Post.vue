<template>
  <div>
    <div class="modal" :class="{ 'is-active': showModal }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create new post</p>
          <button
            class="delete"
            aria-label="close"
            v-on:click="$emit('close-modal')"
          ></button>
        </header>
        <section class="modal-card-body">
          <form>
            <label class="label">Title</label>
            <input class="input is-success" type="text" v-model="title" required/>
            <label class="label">Article text</label>
            <textarea class="textarea is-primary" v-model="body" type="text" required/>
            <label class="label">Author</label>
            <input class="input is-success" type="text" v-model="author" required/>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" v-on:click="createPost">Save changes</button>
          <button class="button">Cancel</button>
        </footer>
      </div>
    </div>
    <div class="card">
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title">{{ article.title }}</p>
          </div>
        </div>

        <div class="content">
          {{ article.body }}
          <br />
          <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      articles: [],
      title: undefined,
      body: undefined,
      author: undefined,
      showModal: this.visible
    };
  },

  props: {
    article: {
      required: true,
      type: Object
    },

    visible: {
      require: true,
      type: Boolean,
      default: false
    }
  },
  watch:{
    visible: {
        immediate: true,
        handler: function(newVal) {
            this.showModal = newVal
        }
    }
  },

  methods: {
    createPost() {
      axios
      .post(this.$apiUrl + "/articles", {
        title: this.title,
        body: this.body,
        author: this.author
      })
      .then(response => console.log(response))
      .then(() => this.$emit("reload-posts"))
      .then(this.resetFields());
    },

    resetFields() {
      this.title = undefined;
      this.author = undefined;
      this.body = undefined;
    },
  }

};
</script>

<style scoped>
.card {
  width: 100%;
}
</style>
