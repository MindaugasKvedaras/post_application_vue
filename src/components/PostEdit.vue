<template>
  <div class="modal" :class="{ 'is-active': showEditPost }">
    <div class="modal-background"></div>
    <div class="modal-card">

      <header class="modal-card-head">
        <p class="modal-card-title">Edit post</p>
        <button
          class="delete"
          aria-label="close"
          v-on:click="cancelPostEdit()"
        ></button>
      </header>

      <section class="modal-card-body">

        <div v-if="isEdited" class="edited-container">
          <p class="title has-text-success">Successfully edited!</p>
          <img src="../assets/homer-simpson-woohoo.gif" />
        </div>

        <div class="nochange_error-container" v-if="isEmptyError">
          <p class="title has-text-danger">
            You forgot to make changes!
          </p>
        </div>

        <form v-if="!isEdited" @submit.prevent="editPost(id)">
          <label class="label">Title</label>
          <input
            class="input is-success"
            type="text"
            :value="postTitle"
            @input="changePostTitle"
            @keyup.enter="editPost(id)"
            required
          />
          <span class="has-text-danger" v-if="errors">{{ errors.nochange }}</span>
          <label class="label">Article text</label>
          <textarea
            class="textarea is-primary"
            :value="postBody"
            @input="changePostBody"
            type="text"
            required
          />
        </form>

      </section>

      <footer class="modal-card-foot" v-if="!isEdited">
        <button
          class="button is-success"
          v-on:click="editPost(id)"
        >
          Edit Post
        </button>
        <button class="button" v-on:click.prevent="cancelPostEdit()">
          Cancel
        </button>
        <p class="error" v-if="errors" v-for="(error, index) of errors.slice(0, 1)" :key="index">
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
      newPostTitle: undefined,
      newPostBody: undefined,
      showEditPost: this.visible,
      updatedAt: undefined,
      titleChanged: false,
      bodyChanged: false,
      isEdited: false,
      errors: [],
      isEmptyError: false
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

    postTitle: {
      required: String
    },

    postBody: {
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
    }
  },

  methods: {
    editPost(id) {
      (this.titleChanged || this.bodyChanged) && !this.errors.length
      ? this.handleEditPostById(id)
      : this.isEmptyError = true
    },

     handleEditPostById(id)  {
      this.isEmptyError = false;
      this.errors = [];

      axios
        .patch(this.$apiUrl + "/articles/" + id, {
          title: this.newPostTitle,
          body: this.newPostBody,
          createdAt: this.createdAt,
          updatedAt: new Date().toLocaleString("lt-LT")
        })
        .then(() => this.$emit("reload-posts"))
        .then(() => this.isEdited = true, this.titleChanged = false, this.bodyChanged = false)
        .catch(
          error => (
            (error.message = "Article can't be edited! Problems with server!"),
            this.errors.push(error),
            this.isEdited = false,
            this.isEmptyError = true
          )
        )
    },

    getAuthors() {
      axios
        .get(this.$apiUrl + "/authors", {
          name: this.name,
          id: this.id
        })
        .then(response => (this.authors = response.data))
        .catch(
          error => (
            (error.message = "Article can't be edited! Problems with server!"),
            this.errors.push(error),
            this.isEdited = false,
            this.isEmptyError = true
          )
        )
    },

    cancelPostEdit() {
      this.$emit("close-edit-post-modal");
      this.newPostTitle = undefined;
      this.newPostBody = undefined;
      this.isEdited = false;
      this.isEmptyError = false;
      this.errors["nochange"] = undefined;
      this.$emit("reload-page");
      this.errors = [];
    },

    changePostTitle(event) {
      this.newPostTitle = event.target.value;
      this.$emit("postTitleChanged", this.newPostTitle);
      this.titleChanged = true;
    },

    changePostBody(event) {
      this.newPostBody = event.target.value;
      this.$emit("postBodyChanged", this.newPostBody);
      this.bodyChanged = true;
    }
  },
};
</script>

<style scoped>
.edited-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nochange_error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nochange_error-container img {
  width: 40%;
}

.label {
  margin-top: 10px;
}
</style>
