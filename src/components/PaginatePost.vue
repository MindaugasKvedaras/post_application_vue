<template>
  <div>
    <div class="pagination-row">
      <div v-for="(item, index) in new Array(10)" :key="index">
        <button class="pagination-button">{{ index + 1 }}</button>
      </div>
    </div>
    <slot />
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.pagination-row {
    display: flex;
    padding: 5px;
}
.pagination-button {
  padding: 8px;
  margin: 2px;
  border-radius: 3px;
  font-size: 1em;
  cursor: pointer;
}
</style>
