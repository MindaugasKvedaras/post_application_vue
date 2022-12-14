<template>
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
          <input
            class="input is-success"
            type="text"
            v-model="title"
            value="title"
            required
          />
          <label class="label">Article text</label>
          <textarea
            class="textarea is-primary"
            v-model="body"
            type="text"
            required
          />

          <label class="label">Select author</label>
          <div class="select is-primary">
            <select v-model="author" required>
              <option value="" disabled selected>Choose author</option>
              <option
                v-for="author in authors"
                v-bind:value="author.id"
                :key="author.id"
              >
                {{ author.name }}
              </option>
            </select>
          </div>
        </form>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" v-on:click.prevent="createPost()">
          Create Article
        </button>
        <button class="button" v-on:click.prevent="cancelPostCreate()">
          Cancel
        </button>
        <p class="error" v-for="error of errors.slice(0,1)">{{ error.message }}</p>
      </footer>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      authors: [],
      title: undefined,
      body: undefined,
      author: undefined,
      showModal: this.visible,
      createdAt: undefined,
      errors: []
    };
  },

  props: {
    visible: {
      require: true,
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler: function(newVal) {
        this.showModal = newVal;
      }
    }
  },

  methods: {
    createPost() {
      axios
        .post(this.$apiUrl + "/articles", {
          title: this.title,
          body: this.body,
          author: this.author,
          createdAt: new Date().toLocaleString("lt-LT")
        })
        .then(response => console.log(response))
        .then(() => this.$emit("reload-posts"))
        .catch((error) => (error.message = "Article was not created! Problems with server!", this.errors.push(error)));
        
        if(!this.errors.length) {
            this.resetFields();
        }
    },

    getAuthors() {
      axios
        .get(this.$apiUrl + "/authors", {
          name: this.name,
          id: this.id
        })
        .then(response => (this.authors = response.data))
        .then(response => console.log(response));
    },

    cancelPostCreate() {
      this.resetFields();
    },

    resetFields() {
      this.title = undefined;
      this.author = undefined;
      this.body = undefined;
    }
  },

  created() {
    this.getAuthors();
    console.log(this.errors.length)
  }
};
</script>

<style>
    .error {
        color: red;
    }
</style>