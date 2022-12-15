<template>
  <div class="modal" :class="{ 'is-active': visibleError }">
    <div class="modal-background"></div>
    <div class="modal-content">
      {{ error.message }}
    </div>
    <button class="modal-close is-large" aria-label="close"></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: this.visible
    };
  },

  props: {
    error: {
      required: true,
      type: Object
    }
  },

  watch: {
    visible: {
      immediate: true,
      handler: function(newVal) {
        this.visibleError = newVal;
      }
    }
  }
};
</script>

<style></style>
