<template>
  <div class="modal" :class="{ 'is-active': showDeleteConfirm }">
    <div class="modal-background"></div>

    <div class="modal-content">

      <div v-if="!errors.length">
        <p class="content-text">
          Are you sure you want to delete this article?
        </p>
      </div>

      <div class="buttons" v-if="!errors.length">
        <button
          class="button is-danger"
          @click="$emit('delete-post')"
        >
          Yes
        </button>
        <button
          class="button is-success"
          @click="$emit('close-delete-modal')"
        >
          No
        </button>
      </div>
      
      <div v-if="errors.length">
        <img src="../assets/500error.png" />
        <p class="title has-text-danger" v-for="(error, index) in errors" :key="index">
          {{ error.message }}
        </p>
        <p class="subtitle has-text-danger">
          You can't delete this article. Try later!
        </p>
      </div>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="$emit('close-delete-modal')"
    ></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDeleteConfirm: this.visible
    };
  },

  props: {
    visible: {
      require: true,
      type: Boolean,
      default: false
    },

    errors: {
      type: Array
    },

  },

  watch: {
    visible: {
      immediate: true,
      handler: function(newVal) {
        this.showDeleteConfirm = newVal;
      }
    }
  }
};
</script>

<style>
.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  height: 100%;
}

.content-text {
  font-size: 25px;
  color: white;
}

.buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.button {
  width: 170px;
  font-size: 20px;
  font-weight: 500;
}
</style>
