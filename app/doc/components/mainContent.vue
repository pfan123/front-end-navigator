<template>
  <transition name="fade">
    <div class="main_content" v-if="isShow" ref="scrollDom">
        <template v-for="item in list">
           <div class="main_content—section" ref="tabDivs" >
             <h2><span v-cloak>{{item.cateTitle}}</span></h2>
             <div>
               <template v-for="cell in item.data">
                  <a target="_blank" :href="cell.link">
                      <dl>
                          <dt v-cloak>{{cell.title}}</dt>
                          <dd v-cloak>{{cell.detail}}</dd>
                      </dl>
                  </a>             
               </template>
             </div>
           </div>
        </template>
        <floating :isFloatingShow = "isFloatingShow"></floating> 
        <go-top v-on:goTop="goTopback" :isTopShow = "isback"></go-top> 
        <div class="footer">
          <div class="copyright">©2015 pFan. All Rights Reserved.</div>
        </div>
        
    </div>   
  </transition>
</template>

<script>
import  goTop  from "./goTop.vue"
import  floating  from "./floating.vue"
import {checkType, sessionPosition, throttle} from '../utils/util'

export default {
  name: 'app',
  data () {
    return {
      list: [],
      isShow: false,
      timer: "",
      isback: false,
      isFloatingShow: true,
      setTimer: '',
      isScrollAction: true      
    }
  },
  components: {
    "go-top": goTop,
    "floating": floating
  },

  beforeCreate () {

  },

  created () {
    let self = this
    this.timer = setInterval( () => {
      if('' != window.response ){
        clearInterval(self.timer)
        self.list = window.response 

        //vue生命周期里面对dom，进行操作，建议在$nextTick之后执行，避免找不到对应节点
        this.$nextTick( ()=>{
          if((new sessionPosition()).getSession().pos){
            this.pos = (new sessionPosition()).getSession().pos
            self.$refs.scrollDom.scrollTop = this.pos
          }
        } )            
      }
    }, 100)
     //通过this.$parent.$emit 订阅自定义时间进行通信
     // this.$on("goTop", (msg) => {
     //    this.$refs.div.scrollTop = 0
     // })
  },

  beforeMount () {

  },

  mounted () {
    this.isShow = true  
    let self = this

    //存储session
    let isOnIOS = navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)
    let eventName = isOnIOS ? "pagehide" : "beforeunload"
    window.addEventListener(eventName, () => {
      (new sessionPosition()).sessionStorage( {pos: self.$refs.scrollDom.scrollTop})
    }, false)

    //组件通信
    middleVue.$on('change-tab', (id) => {
      let dis 
      clearInterval(self.timer)
      clearInterval(self.setTimer)
      self.isScrollAction = false

      //设置300ms延迟去区分点击和滑动对状态改变
      function setTimer(){
          setTimeout(()=> {
            self.isScrollAction = true
          }, 300)        
      }

      let gap
      if(document.documentElement.clientWidth <= 640){
        gap = 8
      }else{
        gap = 15
      }
      

      if(self.$refs.scrollDom.scrollTop - self.$refs.tabDivs[id].offsetTop !== 0){
        dis = Math.abs(self.$refs.scrollDom.scrollTop - self.$refs.tabDivs[id].offsetTop) / gap

        if(self.$refs.scrollDom.scrollTop > self.$refs.tabDivs[id].offsetTop){
          self.timer = setInterval( () =>{
            if(self.$refs.scrollDom.scrollTop > self.$refs.tabDivs[id].offsetTop){
              self.$refs.scrollDom.scrollTop -= dis
            }else{
              self.$refs.scrollDom.scrollTop = self.$refs.tabDivs[id].offsetTop
              setTimer()
              clearInterval(self.timer)
            }

          }, 1000/60)   
        }else{
          self.timer = setInterval( () =>{
            if(self.$refs.scrollDom.scrollTop < self.$refs.tabDivs[id].offsetTop){
              self.$refs.scrollDom.scrollTop += dis
            }else{
              self.$refs.scrollDom.scrollTop = self.$refs.tabDivs[id].offsetTop
              setTimer()
              clearInterval(self.timer)
            }

          }, 1000/60)             
        }

        self.setTimer = setTimeout( () => {
          setTimer()
          clearInterval(self.timer)
        }, 1000/4)        
     
      }

      // this.$refs.scrollDom.scrollTop = this.$refs.tabDivs[id].offsetTop

    })

    this.$nextTick( () => {
      self.$refs.scrollDom.addEventListener("scroll", throttle(() => {
          let top = self.$refs.scrollDom.scrollTop
          let activeIdx = 0

          if(!self.isScrollAction){
            if( top > 800){
              self.isback = true
            }else{
              self.isback = false
            }    
            return    
          }

          self.$refs.tabDivs.forEach( (item, index) => {
            if( top >= item.offsetTop ){
              activeIdx = index
              return;
            }
          })

          if(top >= self.$refs.scrollDom.scrollHeight - document.documentElement.clientHeight + 36){
            activeIdx = self.$refs.tabDivs.length - 1
          }

          middleVue.$emit('scroll-tab', activeIdx)

          if( top > 800){
            self.isback = true
          }else{
            self.isback = false
          }
        }, 300, false ), false)       
    } )

  },

  beforeDestroy () {

  },

  destroyed () {

  },

  methods: {  
    goTopback (msg) {
      let timer 
      let dis 
      let self = this
      if(self.$refs.scrollDom.scrollTop !== 0){
        dis = self.$refs.scrollDom.scrollTop / 20

        timer = setInterval( () =>{
            if(self.$refs.scrollDom.scrollTop > 0){
                self.$refs.scrollDom.scrollTop = self.$refs.scrollDom.scrollTop -dis
            }else{
                self.$refs.scrollDom.scrollTop = 0
                clearInterval(timer)
            }    
        }, 1000/60)

      }

    }
  }
}
</script>

<style lang="scss">
@import "../sass/pc.scss";
.main_content {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 180px;
  overflow-y: auto;
  background: linear-gradient(0, #fff 0, #f9f9f9 100%);
}

.main_content—section{
    overflow: hidden;
    padding: 20px 10px 10px 30px;
    h2{
      position: relative;
      font-size: 12px;
      &::before, &::after {
        position: absolute;
        content: '\20';
        left: 0;
      }
      &::before{
        width: 1px;
        height: 60px;
        top: 0;
        box-shadow: -1px 0 1px rgba(0, 0, 0, 0.1);     
      }
      &::after {
        right: 0;
        top: 50%;
        width: 100%;
        height: 1px;
        border-top: 1px dashed #ddd;
      }
      span{
        z-index: 1;
        display: inline-block;
        position: relative;
        left: -10px;
        background: #E4393C;
        color: #fff;
        height: 28px;
        line-height: 28px;
        padding: 0 15px 0 20px;
        // font-weight: normal;    
        &::after{
          content: '\20';
          display: block;
          position: absolute;
          top: 28px;
          left: 0;
          border-right: 10px solid #9a0e1c;
          border-bottom: 10px dashed transparent;    
        } 
      }
    }
    div{
      overflow: hidden;
      padding: 20px;   
      a{
        float: left;
        width: 19%;
        margin: 0 1% 10px 0;
        background: #f5f5f5;
        box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.08);
        outline: 1px solid #eee\9;   
        transition: all .2s ease-in;
        &:hover{
          transform: translateY(-3px);
          box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.15);
        }
        dt,dd{
          @include line;
        } 
        dl{
          padding: 10px 15px;
          height: 40px;
          overflow: hidden;          
        }  
        dt{
          margin-bottom: 5px;
          font-weight: bold;
          color: #389bcf;
          font-size: 14px;          
        }
        dd{
          color: #999;       
        }
      }           
    }
  }
  .copyright{
    height: 40px;
    background: #f1f1f1;
    font-size: 10px;
    text-align: center;    
    color: #999;
    line-height: 40px;
    box-shadow: 0 1px 1px rgba(255, 255, 255, 1);
  }

@media screen and (max-width: 800px) {
  .main_content—section div>a {
    width: 24%;
  }
}  
@media screen and (max-width: 640px){
  .main_content{
    left: 0;
    top: 40px;
    -webkit-overflow-scrolling: touch;
  }
  .main_content—section{
    padding: 10px;
    h2{
      left: 10px;
      right: 10px;
    }
    div{
      display: flex;
      box-sizing: border-box;
      flex-wrap: wrap;
      padding: 16px 10px 0;
      >a{
        display: block;
        width: calc(96%/2);
        margin: 0 0 10px 0;
        &:nth-child(2n){
          margin-left: 4%;
        }
      }
    }
  }

}
</style>
