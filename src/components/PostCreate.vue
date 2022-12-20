<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create new article</p>
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
            required
          />
          <span v-if="emptyerror.title">{{ emptyerror.title }}</span>

          <label class="label">Article text</label>
          <textarea
            class="textarea is-primary"
            v-model="body"
            type="text"
            required
          />
          <span v-if="emptyerror.body">{{ emptyerror.body }}</span>

          <label class="label">Select author</label>
          <div class="select is-primary">
            <select v-model="author" required>
              <option
                v-for="author in authors"
                :value="author.id"
                :key="author.id"
              >
                {{ author.name }}
              </option>
            </select>
          </div>
        </form>
      </section>
      <footer class="modal-card-foot">
        <button
          type="submit"
          class="button is-success"
          v-on:click="createPost"
          :disabled="!disabled.every(i => i === false)"
        >
          Create Post
        </button>

        <button class="button" v-on:click.prevent="cancelPostCreate()">
          Cancel
        </button>
        <p class="error" v-for="error of errors.slice(0, 1)">
          {{ error.message }}
        </p>
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
      errors: [],
      emptyerror: [],
      disabled: [true, true]
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
    },

    title(value) {
      this.title = value;
      this.validateTitle(value);
    },

    body(value) {
      this.body = value;
      this.validateBody(value);
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
        .catch(
          error => (
            (error.message = "Article was not created! Problems with server!"),
            this.errors.push(error)
          )
        );

      if (!this.errors.length) {
        this.resetFields();
      }

        this.disabled = [this.disabled[1], true];
    },

    getAuthors() {
      axios
        .get(this.$apiUrl + "/authors", {
          name: this.name,
          id: this.id
        })
        .then(response => (this.authors = response.data))
        .then(response => console.log(response))
        .catch(
          error => (
            (error.message = "Article was not created! Problems with server!"),
            this.errors.push(error)
          )
        );

    },

    validateTitle(value) {
      if (!value) {
        this.emptyerror["title"] = "where is the title?";
        this.disabled = [false, this.disabled[1]];
      } else {
        this.emptyerror["title"] = undefined;
        this.disabled = [true, this.disabled[1]];
      }
    },

    validateBody(value) {
      if (!value) {
        this.emptyerror["body"] = "where is the body?";
        this.disabled = [this.disabled[1], true];
      } else {
        this.emptyerror["body"] = undefined;
        this.disabled = [this.disabled[1], false];
      }

    },
    cancelPostCreate() {
      this.resetFields();
    },

    resetFields() {
      this.title = undefined;
      this.author = undefined;
      this.body = undefined;
    },

    handleEmptyInputError() {
      this.titleError = "Empty";
      this.bodyError = "Empty body";
    }
  },

  created() {
    this.getAuthors();
    console.log(this.errors.length);
  }
};
</script>

<style>
.error {
  color: red;
}
</style>
