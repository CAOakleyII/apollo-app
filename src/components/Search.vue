<template>
  <div class="search">
      <input type="text" placeholder="Search" />
  </div>
</template>

<script>
export default {
  name: 'Search'
}
</script>

<style lang="less">
    .search {
        width: 100%;
        display: flex;
        justify-content: center;
        input {
            margin: 10px 0;
            padding: 2px 0 2px 8px;
            border: 1px solid;
            border-radius: 25px;
            width: 80%;
        }
    }
</style>
