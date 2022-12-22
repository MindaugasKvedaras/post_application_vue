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
            :class="{ 'is-danger': isTitleEmptyError}"
            type="text"
            v-model="postTitle"
            @input="checkPostTitle"
          />
          <span class="subtitle is-6 has-text-danger" v-if="emptyErrorMsg.title">{{ emptyErrorMsg.title }}</span>

          <label class="label">Article text</label>
          <textarea
            class="textarea is-primary"
            :class="{ 'is-danger': isBodyEmptyError}"
            v-model="postBody"
            type="text"
            @input="checkPostBody"
          />
          <span class="subtitle is-6 has-text-danger" v-if="emptyErrorMsg.body">{{ emptyErrorMsg.body }}</span>

          <label class="label">Select author</label>
          <div class="select is-primary" :class="{ 'is-danger': isAuthorEmptyError}">
            <select v-model="postAuthor">
              <option
                v-for="postAuthor in authors"
                :value="postAuthor.id"
                :key="postAuthor.id"
                @change="checkPostAuthor"
              >
                {{ postAuthor.name }}
              </option>
            </select>
            <span class="subtitle is-6 has-text-danger" v-if="emptyErrorMsg.author">{{ emptyErrorMsg.author }}</span>
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
        <p class="error" v-for="(error, index) of errors.slice(0, 1)" :key="index">
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
      postTitle: undefined,
      postBody: undefined,
      postAuthor: undefined,
      showModal: this.visible,
      createdAt: undefined,
      errors: [],
      emptyErrorMsg: [],
      isCreated: false,
      isTitleEmptyError: false,
      isBodyEmptyError: false,
      isAuthorEmptyError: false,
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

    // title(value) {
    //   this.title = value;
    // },

    // body(value) {
    //   this.body = value;
    // }
  },

  methods: {

    sendPost() {
      this.checkTitle();
      this.checkBody();
      axios
        .post(this.$apiUrl + "/articles", {
          title: this.postTitle,
          body: this.postBody,
          author: this.postAuthor,
          createdAt: new Date().toLocaleString("lt-LT")
        })
        .then(() => this.$emit("reload-posts"))
        .catch(
          error => (
            (error.message = "Article was not created! Problems with server!"),
            this.errors.push(error)
          )
        );

      if (!this.errors.length) {
        this.resetFields();
        this.isCreated = true;
        this.isAuthorEmptyError = false;
        this.emptyErrorMsg = [];
      }
    },

    getAuthors() {
      axios
        .get(this.$apiUrl + "/authors", {
          name: this.name,
          id: this.id
        })
        .then(response => (this.postAuthors = response.data))
        .catch(
          error => (
            (error.message = "Article was not created! Problems with server!"),
            this.errors.push(error)
          )
        );
    },

    createPost() {
      this.errors = [];

      ((!this.postTitle) && (this.postBody && this.postAuthor)) 
      ? (this.isTitleEmptyError = true,
        this.emptyErrorMsg["title"] = "Don't forget the title" 
        )
      :
      ((!this.postBody) && (this.postTitle && this.postAuthor))
      ? (this.isBodyEmptyError = true,
        this.emptyErrorMsg["body"] = "Don't forget the body" 
        )
      :
      ((!this.postAuthor) && (this.postTitle && this.postBody))
      ? (this.isAuthorEmptyError = true,
        this.emptyErrorMsg["author"] = "Please select author" 
        )
      :
      (!this.postAuthor && !this.postTitle && !this.postBody)
      ? (this.isTitleEmptyError = true,
        this.isBodyEmptyError = true,  
        this.isAuthorEmptyError = true, 
        this.emptyErrorMsg["title"] = "Don't forget the title",
        this.emptyErrorMsg["body"] = "Don't forget the body",
        this.emptyErrorMsg["author"] = "Please select author" 
        )   
      : this.sendPost() 
    },


    checkPostTitle() {
      (!this.postTitle) 
      ? (this.emptyErrorMsg["title"] = "Don't forget the title", this.isTitleEmptyError = true) 
      : (this.emptyErrorMsg["title"] = "", this.isTitleEmptyError = false)
    },

    checkPostBody() {
      (!this.postBody) 
      ? (this.emptyErrorMsg["body"] = "Don't forget the body", this.isBodyEmptyError = true) 
      : (this.emptyErrorMsg["body"] = "", this.isBodyEmptyError = false)
    },

    checkPostAuthor() {
      (!this.postAuthor) 
      ? (this.emptyErrorMsg["auhor"] = "Please select author", this.isAuthorEmptyError = true) 
      : (this.emptyErrorMsg["author"] = "", this.isAuthorEmptyError = false)
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
