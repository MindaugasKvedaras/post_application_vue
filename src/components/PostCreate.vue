<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create new article</p>
        <button
          class="delete"
          aria-label="close"
          v-on:click="closeForm()"
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
            :class="{ 'is-danger': isEmptyErrorTitle}"
            type="text"
            v-model="title"
            @input="checkTitle()"
            required
          />
          <span class="subtitle is-6 has-text-danger" v-if="emptyErrorMsg.title">{{ emptyErrorMsg.title }}</span>

          <label class="label">Article text</label>
          <textarea
            class="textarea is-primary"
            :class="{ 'is-danger': isEmptyErrorBody}"
            v-model="body"
            type="text"
            @input="checkBody()"
            required
          />
          <span class="subtitle is-6 has-text-danger" v-if="emptyErrorMsg.body">{{ emptyErrorMsg.body }}</span>

          <label class="label">Select author</label>
          <div class="select is-primary" :class="{ 'is-danger': isEmptyErrorAuthor}">
            <select v-model="author" required>
              <option
                v-for="author in authors"
                :value="author.id"
                :key="author.id"
                @change="checkAuthor()"
              >
                {{ author.name }}
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
          v-on:click="createPost"
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
      emptyErrorMsg: [],
      isCreated: false,
      isEmptyErrorTitle: false,
      isEmptyErrorBody: false,
      isEmptyErrorAuthor: false,
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
    },

    body(value) {
      this.body = value;
    }
  },

  methods: {

    createPost() {
      this.errors = [];

      ((!this.title) && (this.body && this.author)) 
      ? (this.isEmptyErrorTitle = true,
        this.emptyErrorMsg["title"] = "Don't forget the title" 
        )
      :
      ((!this.body) && (this.title && this.author))
      ? (this.isEmptyErrorBody = true,
        this.emptyErrorMsg["body"] = "Don't forget the body" 
        )
      :
      ((!this.author) && (this.title && this.body))
      ? (this.isEmptyErrorAuthor = true,
        this.emptyErrorMsg["author"] = "Please select author" 
        )
      :
      (!this.author && !this.title && !this.body)
      ? (this.isEmptyErrorTitle = true,
        this.isEmptyErrorBody = true,  
        this.isEmptyErrorAuthor = true, 
        this.emptyErrorMsg["title"] = "Don't forget the title",
        this.emptyErrorMsg["body"] = "Don't forget the body",
        this.emptyErrorMsg["author"] = "Please select author" 
        )   
      : this.sendPost() 

      console.log(this.author);
    },

    sendPost() {
      this.checkTitle();
      this.checkBody();
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
        this.isCreated = true;
        this.isEmptyErrorAuthor = false;
        this.emptyErrorMsg = [];
      }
    },

    checkTitle() {
      (!this.title) 
      ? (this.emptyErrorMsg["title"] = "Don't forget the title", this.isEmptyErrorTitle = true) 
      : (this.emptyErrorMsg["title"] = "", this.isEmptyErrorTitle = false)
    },

    checkBody() {
      (!this.body) 
      ? (this.emptyErrorMsg["body"] = "Don't forget the body", this.isEmptyErrorBody = true) 
      : (this.emptyErrorMsg["body"] = "", this.isEmptyErrorBody = false)
    },

    checkAuthor() {
      (!this.author) 
      ? (this.emptyErrorMsg["auhor"] = "Please select author", this.isEmptyErrorAuthor = true) 
      : (this.emptyErrorMsg["author"] = "", this.isEmptyErrorAuthor = false)
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
      this.title = undefined;
      this.body = undefined;
      this.author = "";
    },
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
