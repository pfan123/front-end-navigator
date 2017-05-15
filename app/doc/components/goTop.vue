<template>
  <transition name="fade">
    <div class="main_back-top" @click="goTop" v-if="isTopShow">
      <!--返回顶部箭头-->
      <img src="../images/icon_back.png">
      
    </div>     
  </transition>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      nav: []
    }
  },
  props: ['isTopShow'],
  created () {

  },

  mounted () {
   
  },

  methods: {
    goTop () {
       // this.$parent.$emit('test', 'hi')
       this.$emit('goTop', 'hi')
    }
  },

  filters: {

  },

  events: {

  }
}
</script>

<style lang="scss">
@import "../sass/pc.scss";

.main_back-top{
    position: fixed;
    bottom: 50px;
    right: 0;
    width: 40px;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.9);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    text-align: center;
    font-size: 10px;
    color: #fff;
    line-height: 18px;
    z-index: 4;
    img{
      display: block;
      width: 18px;
      height: 20px;
      margin: 10px auto;
      cursor: pointer;     
    }
}
</style>
