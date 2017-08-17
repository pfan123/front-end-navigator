<template>
  <div class="sideleft">
      <h1><a href="">前端导航平台</a></h1>
      <div :class="[nav.length>2 ? 'sideleft_nav-item' : 'sideleft_nav-item flex']" ref ="scrollTabWp" >
        <template v-for = "(item, index) in nav">
            <a :class="{on: index == active}" href="javascript:;"  @click= "selectTab(index)" ref ="scrollTab">{{item.cateTitle}}</a>
        </template>
      </div>
      <a class="sideleft_navbot" href="//github.com/pfan123/front-end-navigator" target="_blank"><i></i>关于作者</a>
  </div>
</template>

<script>
import {checkType, sessionPosition} from '../utils/util'

export default {
  name: 'app',
  data () {
    return {
      nav: [],
      active: 0
    }
  },

  created () {
    let self = this
    //获取外层接口数据
    this.timer = setInterval( () => {
      if('' != window.response ){
        clearInterval(self.timer)
        self.nav = window.response
        if((new sessionPosition()).getSession().active){
          self.active = (new sessionPosition()).getSession().active
        }    

        if((new sessionPosition()).getSession().scrollLeft){
          self.$refs.scrollTabWp.scrollLeft = (new sessionPosition()).getSession().scrollLeft
        }    
      }
    }, 100)
    
  },

  mounted () {
      let isOnIOS = navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)
      let eventName = isOnIOS ? "pagehide" : "beforeunload"
      let self = this
      window.addEventListener(eventName, () => {
        (new sessionPosition()).sessionStorage( {active: self.active});

        (new sessionPosition()).sessionStorage( {scrollLeft: self.$refs.scrollTabWp.scrollLeft});
      }, false)

      middleVue.$on('scroll-tab', idx => {
        self.active = idx
        self.tabMove()
      })

      middleVue.$emit('finish')
  },

  methods: {
    selectTab (index) {
      this.active = index
      middleVue.$emit('change-tab', index)
      this.tabMove()
    },

    tabMove () {
      if(document.documentElement.clientWidth <= 640){
        let left = this.$refs.scrollTabWp.scrollLeft

        if(this.$refs.scrollTab.length <=3)return

        if(this.active > 1 && this.active < this.$refs.scrollTab.length - 2){
          this.$refs.scrollTabWp.scrollLeft = this.$refs.scrollTab[0].clientWidth*(this.active-1)
        }else if(this.active <= 1 ){
          this.$refs.scrollTabWp.scrollLeft = 0
        }else if( this.active >= this.$refs.scrollTab.length - 2){
          this.$refs.scrollTabWp.scrollLeft = this.$refs.scrollTab[0].clientWidth * (this.$refs.scrollTab.length-1)
        }

      }
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

$color_red: red;
.sideleft {
  position: absolute;
  width: 180px;
  top: 0;
  left: 0;
  bottom: 0;
  background: #29292b;
  h1{
    background: #E4393C;
    font-size: 18px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    a{
      color: #fff;
    }
  }
}


.sideleft_nav-item{
  position: absolute;
  top: 50px;
  bottom: 50px;
  left: 0; 
  right: 0;
  overflow-y: auto;
  a{
    padding-left: 40px;
    display: block;
    font-size: 14px;
    height: 36px;
    line-height: 36px;
    color: #999;
    text-align: left;
    font-family: "webfont";
    &:hover{
      color: #fff;
    }
    &.on{
      color: #fff;
      background: rgba(255,255,255,0.1);
      border-left: 2px solid #E4393C;
      transition: all ease-in .3s;
    }
  }
}

.sideleft_navbot{
  position: absolute;
  height: 40px;
  line-height: 40px;
  color: #fff;
  bottom: 0;
  left:0 ;
  right: 0;
  text-align: center;
  font-size: 14px;
  background: #E4393C;
  i{
    display: inline-block;
    background: url('../images/icon_comment.png') no-repeat;
    width: 20px;
    height: 20px;
    background-size: 100% 100%;
    vertical-align: middle;
    margin: -2px 4px 0 0;
  }
}

/**
 * 字体库
 */
@font-face {
    font-family: "webfont";
    src: url("../fonts/webfont.eot"); /* IE9 */
    src: url("../fonts/webfont.eot?#iefix") format("embedded-opentype"), /* IE6-IE8 */
    
    url("../fonts/webfont.woff") format("woff"), /* chrome、firefox */
    url("../fonts/webfont.ttf") format("truetype"), /* chrome、firefox、opera、Safari, Android, iOS 4.2+ */
    
    url("../fonts/webfont.svg#webfont") format("svg"); /* iOS 4.1- */
    font-style: normal;
    font-weight: normal;
}

@media screen and (max-width: 640px){
  .sideleft{
      width: 100%;
      height: 40px;
      top: 0;
      left: 0;
      right: 0;
      bottom: auto;
      z-index: 3;
      -webkit-overflow-scrolling: touch;
      white-space: nowrap;
      overflow-x: auto;
      h1{
        display: none;
      }
      .sideleft_navbot{
        display: none;
      }
    &_nav-item{
      position: static;
      top: 0;
      bottom: auto;  
      &.flex{
        width: 100%;
        display: flex;
        a{
          flex: 1;
        }
      }
      a{
        display: inline-block;
        padding-left: 0;
        width: calc(100%/3);
        text-align: center;
        height: 38px;
        line-height: 40px;
        &.on{
          border-left: 0;
          border-bottom: 2px solid #E4393C;
        }
      }
    }
  }
}
</style>
