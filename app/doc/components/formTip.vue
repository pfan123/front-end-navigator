<template>
  <transition name="fade">

  <div class="admin_from_tip" v-if="formInfo.isShow">
    <template v-if = "1 == formInfo.type || 3 == formInfo.type">    
        <div class="admin_from_tmod  admin_from-style1" >

            <i class="admin_closebtn" @click="closeTip"></i>
            <template v-if=" 3 == formInfo.type">
              <h2>前端导航平台--项目增加 </h2>
            </template>
            <template v-else-if="1 == formInfo.type">
              <h2>前端导航平台--项目修改 </h2>
            </template>
            
            <table class="admin_from_table">
              <tr>
                <td>标题:</td>
                <td><input type="text" v-model="formInfo.title" placeholder="请输入标题"></td>
              </tr>
              <tr>
                <td>描述:</td>
                <td><input type="text" v-model="formInfo.detail" placeholder="请输入描述"></td>
              </tr>       
              <tr>
                <td>链接:</td>
                <td><input type="text" v-model="formInfo.link" placeholder="请输入URL"></td>
              </tr>   

              <tr v-if="3 == formInfo.type">
                <td>分类:</td>
                <td><input type="text" v-model="formInfo.cateTitle" placeholder="请输入所属分类"></td>
              </tr>                             
            </table>
            <input type="button" value="确定" @click="sendSubmit(formInfo.type, formInfo.objectId, formInfo.title, formInfo.detail, formInfo.link, formInfo.cateTitle, formInfo.originCateTitle, formInfo.cateArr, formInfo.totalData)">
        </div>  
    </template>
    <template v-else-if = "2 == formInfo.type">
        <div class="admin_from_tmod admin_from-style2" >
            <i class="admin_closebtn" @click="closeTip"></i>
            <h2>前端导航平台--项目修改 </h2>
            <table class="admin_from_table">      
              <tr>
                <td>分类:</td>
                <td><input type="text" v-model="formInfo.cateTitle" placeholder="请输入URL"></td>
              </tr>                             
            </table>
            <input type="button" value="确定" @click="sendSubmit(formInfo.type, formInfo.objectId, formInfo.title, formInfo.detail, formInfo.link, formInfo.cateTitle, formInfo.originCateTitle, formInfo.cateArr, formInfo.totalData)">
        </div>
    </template>
  </div>  
  </transition>
</template>

<script>
import {checkType, sessionPosition, unqie, xss} from '../utils/util'
export default {
  data () {
    return {
      isSucc: false
    }
  },
  props: {
    formInfo: {
      type: Object,  
    }
  },
  created () {

  },

  mounted () {
  
  },

  methods: {
    closeTip () {
      this.formInfo.isShow = false
    },
    sendSubmit(type, id, title, detail, link, cateTitle, originCateTitle, cateArr, totalData){

      //xss预防转义<> ""
      title = xss(title)
      detail = xss(detail)
      cateTitle = xss(cateTitle)
      link = xss(link)

      let self = this
      if(self.isSucc){
        return;
      }
      //修改项目
      if(1 == self.formInfo.type){
          if("" == id || "" == title || "" == detail || "" == cateTitle){
            alert("都是必填项，请认真填写");
          }else{
           self.isSucc = true
         // console.log("objectId", id)
           let dataTypeDoc = AV.Object.createWithoutData('DataTypeDoc', id)
            // 修改属性
            dataTypeDoc.set('title', title)
            dataTypeDoc.set('detail', detail)
            dataTypeDoc.set('link', link)

            dataTypeDoc.save().then(function (dataTypeDoc) {
              self.formInfo.isShow = false
              self.$emit('triggerUpdate', {
                "type": type,
                "objectId": id,
                "title": title,
                "detail": detail,
                "link": link,
                "cateTitle": cateTitle,
                "originCateTitle": originCateTitle,
                "cateArr": cateArr
              })
              self.isSucc = false
            }, function (error) {
              alert("数据保存失败，请重新提交")
              self.isSucc = false
            })
          }   
      //修改项目分类
      }else if(2 == self.formInfo.type){
          if( '' == cateTitle){
            alert("都是必填项，请认真填写");
          }else{
            console.log("originCateTitle", originCateTitle)
            console.log("cateTitle", cateTitle)
            self.isSucc = true
            if(cateTitle != originCateTitle){
              if(cateArr.indexOf(cateTitle) != -1 ){
                if(!confirm("您更改的分类名已经存在，确定要合并吗？")){
                  self.formInfo.isShow = false
                  self.isSucc = false                  
                  return;
                }
              }
               let objects = []; // 构建一个本地的 AV.Object 对象数组
               totalData.map( (item) => {
                  if(item.cateTitle == originCateTitle){
                    var dataTypeDoc = AV.Object.createWithoutData('DataTypeDoc', item.objectId);
                    dataTypeDoc.set('cateTitle', cateTitle)
                    objects.push(dataTypeDoc)
                  }
               })

                 // 批量创建（更新）
                AV.Object.saveAll(objects).then(function (objects) {
                  self.formInfo.isShow = false
                  self.isSucc = false
                  self.$emit('triggerUpdate', {
                    "type": type,
                    "objectId": id,
                    "title": title,
                    "detail": detail,
                    "link": link,
                    "cateTitle": cateTitle,
                    "originCateTitle": originCateTitle,
                    "cateArr": cateArr
                  })                    
                  
                }, function (error) {
                  // 异常处理
                  alert("数据保存失败，请重新提交")
                  self.isSucc = false                   
                })

            }else{
              self.formInfo.isShow = false
              self.isSucc = false
            }
          }       
      //新增项目
      }else if(3 == self.formInfo.type){
        if("" == link || "" == title || "" == detail || "" == cateTitle){
          alert("都是必填项，请认真填写");
        }else{
          
          self.isSucc = true        
          let DataTypeDoc = AV.Object.extend('DataTypeDoc');
          let dataTypeDoc = new DataTypeDoc();
          dataTypeDoc.set('cateTitle', cateTitle);
          dataTypeDoc.set('title', title);
          dataTypeDoc.set('detail', detail);
          dataTypeDoc.set("image", "");
          dataTypeDoc.set('link', link);
          dataTypeDoc.save().then(function (dataTypeDoc) {
            self.formInfo.isShow = false
            dataTypeDoc = JSON.parse(JSON.stringify(dataTypeDoc))

            self.$emit('triggerUpdate', {
              "type": type,
              "objectId": dataTypeDoc.objectId,
              "title": dataTypeDoc.title,
              "detail": dataTypeDoc.detail,
              "link": dataTypeDoc.link,
              "image": dataTypeDoc.image,
              "cateTitle": dataTypeDoc.cateTitle,
              "originCateTitle": originCateTitle,
              "cateArr": cateArr
            })                    
            self.isSucc = false          
          }, function (error) {
            alert("数据添加失败，请重新提交")
            self.isSucc = false    
          })
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
.admin_from_tip{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0,0,0,.5);
  z-index: 100;
}
.admin_from_tmod{
  box-sizing: border-box;
  border-radius: 3px;
  padding: 15px 18px;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  box-shadow: 0 0 6px rgba(0,0,0,.3);  
  position: relative;
  &.admin_from-style1{
    width: 440px;
    height: 400px;
  }
  &.admin_from-style2{
    width: 440px;
    height: 210px;
  }  
  .admin_closebtn{
    position: absolute;
    width: 30px;
    height: 30px;
    background: url("../images/icon_close_off.png") center no-repeat;
    background-size: 20px 20px;
    right: 5px;
    top: 5px;    
    &:hover{
      background: url("../images/icon_close_on.png") center no-repeat;
      background-size: 20px 20px;      
    }
  }
  h2{
    line-height: 1.1;
    color: #333;
    font-size: 22px;
    font-weight: 400;
    margin-bottom: 30px;
    text-align: center;  
  }
  table{
    display: block;
    width: 320px;
    margin: 0 auto 20px;
    td{
      height: 60px;
    }
    tr>td{
      &:first-child{
        width: 60px;
        text-align: left;
        font-size: 14px;
      }
      input{
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        width: 260px;
        padding: 0 6px;
        height: 36px;
        line-height: 36px;
        border-radius: 2px;
        font-size: 14px;
        color: #333;
        &:focus{
          border-color: #ed7a7c;
          outline: 0;
          box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(228, 57, 60, 0.33);          
        }
      }
    }
  }
  input[type="button"]{
    display: block;
    margin: 0 auto;
    width: 180px;
    height: 38px;
    line-height: 38px;
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
