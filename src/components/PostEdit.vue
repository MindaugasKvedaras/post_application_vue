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
          <img src="../assets/homer-thinks.png" />
        </div>

        <form v-if="!isEdited" @submit.prevent="editPost(id)">
          <label class="label">Title</label>
          <input
            class="input is-success"
            type="text"
            :value="title"
            @input="changeTitle"
            @keyup.enter="editPost(id)"
            required
          />
          <span class="has-text-danger" v-if="errors">{{ errors.nochange }}</span>
          <label class="label">Article text</label>
          <textarea
            class="textarea is-primary"
            :value="body"
            @input="changeBody"
            type="text"
            required
          />
        </form>

      </section>

      <footer class="modal-card-foot" v-if="!isEdited">
        <button
          type="submit"
          class="button is-success"
          v-on:click="editPost(id)"
        >
          Edit Post
        </button>
        <button class="button" v-on:click.prevent="cancelPostEdit()">
          Cancel
        </button>
        <p class="error" v-if="errors" v-for="error of errors.slice(0, 1)">
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
      newTitle: undefined,
      newBody: undefined,
      showEditPost: this.visible,
      updatedAt: undefined,
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

    title: {
      required: String
    },

    body: {
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
      (this.newTitle) ? (this.editPostById(id), this.checkErrors())
      : 
      (this.newBody) ? (this.editPostById(id), thischeckErrors()) 
      : 
      this.isEmptyError = true


      // !this.newTitle ? (this.errors["emptytitle"] = "Title is required", this.isEmptyError = true)
      // :
      // !this.newBody ? (this.errors["emptybody"] = "Body is required", this.isEmptyError = true) : null;
    },

    editPostById(id) {
      this.isEmptyError = false;
      this.errors = [];

      axios
        .patch(this.$apiUrl + "/articles/" + id, {
          title: this.newTitle,
          body: this.newBody,
          createdAt: this.createdAt,
          updatedAt: new Date().toLocaleString("lt-LT")
        })
        .then(response => console.log(response))
        .then(() => this.$emit("reload-posts"))
        .catch(
          error => (
            (error.message = "Article can't be edited! Problems with server!"),
            this.errors.push(error),
            console.log(this.errors.length),
            this.isEmptyError = false
          )
        )

        !this.errors.length ? this.isEdited = true : null,



        console.log(this.errors.length);

        
        console.log(this.isEdited)



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

    checkErrors() {
      this.errors.length ? this.isEdited = true : null
    },

    checkPostChanges(id) {
      (this.newTitle && this.newBody) && this.editPostById(id);
      !this.newTitle ? this.errors["emptytitle"] = "Title is required" : null;
      console.log(errors.emptytitle);
      !this.newBody ? this.errors["emptybody"] = "Body is required" : null;

    },

    cancelPostEdit() {
      this.$emit("close-edit-post-modal");
      this.newTitle = undefined;
      this.newBody = undefined;
      this.isEdited = false;
      this.isEmptyError = false;
      this.errors["nochange"] = undefined;
      this.$emit("reload-page");
      this.errors = [];
    },

    changeTitle(event) {
      this.newTitle = event.target.value;
      this.$emit("titleChanged", this.newTitle);
    },

    changeBody(event) {
      this.newBody = event.target.value;
      this.$emit("bodyChanged", this.newBody);
    }
  },

  computed: {
    titleValidation() {
      return this.NewTitle.length > 0
    }
  },

  created() {
    console.log(this.errors.length);
  }
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
