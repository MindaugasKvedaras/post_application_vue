<template>
  <div class="modal" :class="{ 'is-active': showDeleteConfirm }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <button class="button is-danger" v-on:click="$emit('delete-post')">Yes</button>
      <button class="button is-success" v-on:click="$emit('close-delete-modal')"
>No</button>
    </div>
    <!-- <button
      class="modal-close is-large"
      aria-label="close"
      v-on:click="$emit('close-error')"
    ></button> -->
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
    }
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
        text-align: center;

    }
</style>
