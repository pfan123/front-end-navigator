<template>
  <div class="login_con">
      <div class="login_con-box">
          <h3>前端导航平台--登录</h3>

          <div class="login_input">
            <input type="text" name="username" placeholder="username" v-model = "username">
          </div>

          <div class="login_input">
            <input type="password" name="password" placeholder="Password" v-model = "password">
          </div>  
<!-- 
          <p class="login_txt">还没有账号，点击 <router-link to="/register">注册</router-link></p> --> 

          <input type="button" class="login_btn" value="登录" @click="sendSubmit">       
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  props: ['isTopShow'],
  created () {

  },

  mounted () {

    if(window.localStorage.getItem("loginInfo")){

      let json = JSON.parse(window.localStorage.getItem("loginInfo"))
      if(json.token && '' != json.token){

        console.log("登录过")
        if( (new Date()).valueOf() - json._time < 24*60*60*1000 ){
          this.$nextTick( ()=>{
            this.$router.push({ path: '/edit' })
            this.$router.go(1)    
          } )             
        }else{
          window.localStorage.removeItem("loginInfo")
        }
     
      }
    }
  },

  methods: {
    sendSubmit () {
      let self = this
       if( '' == this.username){
        alert("请填写用户名！")
        return ;
       }
       if( '' == this.password ){
        alert("请填写密码！")
       }

      AV.User.logIn(this.username, this.password).then(function (loginedUser) {
        window.localStorage.setItem("loginInfo", JSON.stringify({"token": JSON.parse(JSON.stringify(loginedUser)).objectId, "_time": (new Date()).valueOf()}) )
        console.log('登录成功', loginedUser);
          self.$nextTick( ()=>{
            self.$router.push({ path: '/edit' })
            self.$router.go(1)    
          } )      
        // 请注意，密码不会明文存储在云端，因此密码只能重置，不能查看
      }, function (error) {
        alert("抱歉，您输入的账号密码有误！")
        throw error
      })
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
.login_con{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #f6f6f6;
}
.login_con-box{
  position: absolute;
  width: 400px;
  height: 360px;
  left: 50%;
  top: 50%;
  margin: -180px 0 0 -200px;
  background: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, .15);
  border-radius: 4px;
  overflow: hidden;
  &::before, &::after{
    position: absolute;
    content: "";
  }
  &::before{
    background: #ddd;
    left: 20px;
    right: 20px;
    height: 10px;
    border-radius: 0 0 4px 4px;
    bottom: -10px;
  }
  &::after{
    height: 5px;
    background: #ccc;
    bottom: -5px;
    left: 10px;
    right: 10px;
    border-radius: 0 0 4px 4px;
  }
  h3{
    font-size: 24px;
    text-align: center;
    color: #333;
    margin: 20px auto 50px;
    font-weight: normal;
  }
  .login_input{
    width: 300px;
    height: 42px;
    line-height: 42px;
    margin: 30px auto 40px;
    &.login_input_nomargin{
      margin-bottom: 14px;
    }
    input{
      box-sizing: border-box;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      width: 300px;
      padding: 0 6px;
      height: 42px;
      border-radius: 4px;
      font-size: 14px;
      color: #333;
      &:focus{
        border-color: #ed7a7c;
        outline: 0;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(228, 57, 60, 0.33);    
      }
    }
  }
  .login_txt{
    width: 300px;
    margin: 0 auto 22px;
    font-size: 14px;
    text-align: center;
    a{
      color: #389bcf;
      text-decoration: underline;
    }
  }
  .login_btn{
    display: block;
    margin: 0 auto;
    width: 300px;
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    text-align: center;
    color: #fff;
    background: #E4393C;
    border-radius: 2px;
    font-weight: bold;
    &:hover{
      opacity: .9;
    }
  }
}

</style>
