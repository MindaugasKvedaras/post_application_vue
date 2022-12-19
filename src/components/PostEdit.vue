<template>
  <div class="modal" :class="{ 'is-active': showEditPost }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit post</p>
        <button
          class="delete"
          aria-label="close"
          v-on:click="$emit('close-edit-post-modal')"
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
        </form>
      </section>
      <footer class="modal-card-foot">
        <button
          type="submit"
          class="button is-success"
          v-on:click="editPost(id)"
          :disabled="!disabled.every(i => i === false)"
        >
          Edit Post
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
      articles: [],
      title: undefined,
      body: undefined,
      author: undefined,
      showEditPost: this.visible,
      updatedAt: undefined,
      errors: [],
      emptyerror: [],
      disabled: [true, true]
    };
  },

  props: {
    visible: {
      required: true,
      type: Boolean,
      default: false
    },

    id: {
      type: String
    },

    createdAt: {
      type: String
    }
  },

  watch: {
    visible: {
      immediate: true,
      handler: function(newVal) {
        this.showEditPost = newVal;
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
    editPost(id) {
      axios
        .patch(this.$apiUrl + "/articles/" + id, {
          title: this.title,
          body: this.body,
          createdAt: this.createdAt,
          updatedAt: new Date().toLocaleString("lt-LT")
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
        .then(response => console.log(response));
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
