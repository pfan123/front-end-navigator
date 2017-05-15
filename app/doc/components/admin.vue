<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: ''
    }
  },

  components () {

  },

  created () {

  },

  mounted () {

  },

  methods: {

  }

}
</script>

<style lang="scss">

</style>
