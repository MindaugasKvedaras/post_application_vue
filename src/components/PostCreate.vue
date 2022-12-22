<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create new article</p>
        <button
          class="delete"
          aria-label="close"
          @click="closeForm"
        ></button>
      </header>

      <section class="modal-card-body">

        <div v-if="isCreated">
          <p class="title has-text-success">Successfully created</p>
          <button class="button is-success" @click="isCreated = false">Create More</button>
        </div>

        <form v-if="!isCreated">
          <label class="label">Title</label>
          <input
            class="input is-success"
            :class="{ 'is-danger': errors.title.error}"
            type="text"
            v-model="postTitle"
            @input="validateField('title', $event.target.value)"
          />
          <span class="subtitle is-6 has-text-danger" v-if="errors.title.error">{{ errors.title.msg }}</span>

          <label class="label">Article text</label>
          <textarea
            class="textarea is-primary"
            :class="{ 'is-danger': errors.body.error}"
            v-model="postBody"
            type="text"
            @input="validateField('body', $event.target.value)"
          />
          <span class="subtitle is-6 has-text-danger" v-if="errors.body.error">{{ errors.body.msg }}</span>

          <label class="label">Select author</label>
          <div class="select is-primary" :class="{ 'is-danger': errors.author.errror}">
            <select v-model="postAuthor">
              <option
                v-for="postAuthor in authors"
                :value="postAuthor.id"
                :key="postAuthor.id"
                @change="validateField('author', $event.target.value)"
              >
                {{ postAuthor.name }}
              </option>
            </select>
            <span class="subtitle is-6 has-text-danger" v-if="errors.author.error">{{ errors.author.msg }}</span>
          </div>
        </form>
      </section>
      <footer class="modal-card-foot" v-if="!isCreated">
        <button
          type="submit"
          class="button is-success"
          @click="createPost"
        >
          Create Post
        </button>

        <button class="button" @click.prevent="cancelPostCreate">
          Cancel
        </button>
        <!-- <p class="error" v-for="(error, index) of errors.slice(0, 1)" :key="index">
          {{ error.message }}
        </p> -->
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
      postTitle: undefined,
      postBody: undefined,
      postAuthor: undefined,
      showModal: this.visible,
      createdAt: undefined,
      errors: {"title": {"error": false, "msg": ""},
        "body": {"error": false, "msg": ""},
        "author": {"error": false, "msg": ""}
      },
      emptyErrorMsg: [],
      isCreated: false
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
  },

  methods: {

    sendPost() {
      axios
        .post(this.$apiUrl + "/articles", {
          title: this.postTitle,
          body: this.postBody,
          author: this.postAuthor,
          createdAt: new Date().toLocaleString("lt-LT")
        })
        .then(() => this.$emit("reload-posts"))
        .catch(() => this.$emit("toggle-error"));
    },

    getAuthors() {
      axios
        .get(this.$apiUrl + "/authors", {
          name: this.name,
          id: this.id
        })
        .then(response => (this.authors = response.data))
        // .catch(
        //   error => (
        //     (error.message = "Article was not created! Problems with server!"),
        //     this.errors.push(error)
        //   )
        // );
    },

    validateField(field, value) {
      if(!value) {
        this.errors[field] = {"error": true, "msg": "Don't forget the " + field}
        return false
      }
      this.errors[field] = {"error": false, "msg": ""}
      return true
    },
    formValide() {
      let valide = true
      if(!this.validateField("title", this.postTitle)) {
        valide = false
      }
      if(!this.validateField("body", this.postBody)) {
        valide = false
      }
      if(!this.validateField("author", this.postAuthor)) {
        valide = false
      }
      return valide
    },
    createPost() {

      if(!this.formValide()) {
        return
      }
      this.sendPost() 
    },

    closeForm() {
      this.$emit('close-modal');
      this.isCreated = false;
    },

    cancelPostCreate() {
      this.resetFields();
      this.emptyErrorMsg = []
      this.isEmptyError = [];
    },

    resetFields() {
      this.postTitle = undefined;
      this.postBody = undefined;
      this.postAuthor = "";
    },
  },

  created() {
    this.getAuthors();
  }
};
</script>

<style>
.error {
  color: red;
}
</style>
