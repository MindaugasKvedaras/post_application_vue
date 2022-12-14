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
            <input
              class="input is-success"
              type="text"
              v-model="title"
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
              <select class="select" v-model="author">
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
          <button class="button">Cancel</button>
        </footer>
      </div>
    </div>

    <div class="card">
      <div class="editor">
        <lead-pencil class="edit-icon" v-on:click="editFields(article.id, article.title)"/>
        <button class="delete" v-on:click="deletePost(article.id)"></button>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title">{{ article.title }}</p>
          </div>
        </div>
        <div class="content">
          {{ article.body }}
        </div>
        <div
          class="content"
          v-for="author in authors"
          :key="author.id"
          v-if="article.author == author.id"
        >
          <br />
          <p>Created at: {{ article.createdAt }} by {{ author.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import LeadPencil from 'vue-material-design-icons/Pencil.vue';


export default {
  data() {
    return {
      articles: [],
      authors: [],
      title: undefined,
      body: undefined,
      author: undefined,
      showModal: this.visible,
      createdAt: undefined,
      name: undefined,
    };
  },

  components: {
    LeadPencil
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
        .then(this.postInAuthors(this.author))
        .then(response => console.log(response))
        // .then(() => this.$emit("reload-posts"))
        .then(this.resetFields());
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

    postInAuthors(id) {
      axios.patch(this.$apiUrl + "/authors/" + id, {
        createdAt: new Date().toLocaleString("lt-LT")
      });
    },

    editFields(id) {
      axios
        .get(this.$apiUrl + "/articles/" + id)
        .then((response) => (this.articles = response.data))
        .then(response => console.log(response))
        .then(this.setFields(this.title))

    },

    setFields(title) {
      this.title = title
    },

    deletePost(id) {
      axios
        .delete(this.$apiUrl + "/articles/" + id)
        .then(() => this.$emit("reload-posts"));
    },

    resetFields() {
      this.title = "labas";
      this.author = undefined;
      this.body = undefined;
    },

    getDate() {
      const jsonDate = new Date().toLocaleString("lt-LT");

      console.log(jsonDate);
    }
  },

  created() {
    this.getAuthors();
  }
};
</script>

<style scoped>
.card {
  width: 100%;
  max-width: 250px;
  height: 360px;
}

.editor {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.edit-icon {
  cursor: pointer;
}
.label {
  margin-top: 10px;
}
.modal-card-body {
  height: 380px;
}
</style>
