<template>
  <div class="admin_edit">
     <header class="admin_edit_hd">前端导航平台--管理后台<a href="/" class="admin_go_index">回到首页</a><a href="javascript:;" class="admin_edit_add" @click="addItemData">添加</a></header>  

    <div class="admin_edit_item" v-for="item in list">
        <h3 v-cloak class="admin_cate-tit"><span>{{item.cateTitle}}</span> <a href="javascript:;" @click="editCateTitle(item.cateTitle, cateArr)">编辑</a><a href="javascript:;" @click="delCateTitle(item.cateTitle)">删除</a></h3>
        <div class="admin_cate" v-if="item.data.length > 0">
          <template v-for="cell in item.data">
            <div class="admin_cate_item"  :objectId="cell.objectId" >
              <h3>{{cell.title}}</h3>
              <p>{{cell.detail}}</p>
              <span class="admin_item_edit" @click="setCompile(cell.objectId, cell.title, cell.detail, cell.link, item.cateTitle)">编辑</span>
              <span class="admin_item_del" @click="delItemTitle(cell.objectId, item.cateTitle)">删除</span>
            </div>            
          </template>
        </div>
    </div>
    <form-tip :formInfo = "tipInfo" :foo ="bar" @triggerUpdate = "updataList"></form-tip>  
  </div>
</template>

<script>
import {checkType, sessionPosition, unqie} from '../utils/util'
import formTip from "./formTip.vue"

export default {
  data () {
    return {
      list: [],
      //type为1为修改分类标题，type为
      tipInfo: {isShow: false, objectId: '', title: '', detail: '',link: '', cateTitle: '', type: '1', cateArr: [], originCateTitle: '', totalData: []},
      bar: ''
    }
  },
  components: {
    "form-tip": formTip
  },
  created () {
    let self = this
    //检测登录
    if(window.localStorage.getItem("loginInfo")){

      let json = JSON.parse(window.localStorage.getItem("loginInfo"))
      if(json.token && '' != json.token){

        if( (new Date()).valueOf() - json._time < 24*60*60*1000 ){
            
        }else{
          window.localStorage.removeItem("loginInfo")
          this.$router.push({ path: '/login' })
          this.$router.go(1)  
        }
     
      }
    }else{
        this.$router.push({ path: '/login' })
        this.$router.go(1)        
    }

    /**
     * [本地存储优化]
     */
    if(window.localStorage.getItem("docs_data")){
      let docData = window.localStorage.getItem("docs_data")
      self.list = JSON.parse(docData)
    }

    let query = new AV.Query('DataTypeDoc')
    query.ascending('createdAt')
    query.limit(1000) 
    query.find().then(function (json) {
         json = JSON.parse( JSON.stringify(json, null, 4) )
         self.totalData = json
         self.cateArr = []
         let docData = []
         json.map( (item) => {
          self.cateArr.push(item.cateTitle)
         })

         self.cateArr = unqie(self.cateArr)
         
         self.cateArr.map((item, idx) => {
          docData[idx] = {"cateTitle": item, data: []}
          json.map( (cell) => {
            if(cell.cateTitle == item){
              docData[idx].data.push({
                'title': cell.title,
                'detail': cell.detail,
                'link': cell.link,
                'image': cell.image,
                'objectId': cell.objectId,
                'createdAt': cell.createdAt,
                'updatedAt': cell.updatedAt
              })
            }
          })      
         })

         self.list = docData
         window.localStorage.setItem("docs_data", JSON.stringify(docData))
      }).catch(function(error) {
        throw new Error(JSON.stringify(error))
      }) 

  },

  mounted () {

  },

  methods: {
    getTotalData (){
      let self = this
      let arr = []
      self.list.map((item) => {
        item.data.map((cell)=>{
          cell.cateTitle = item.cateTitle
          arr.push(cell)
        })
      }) 
      self.totalData = arr
    },

    setCompile (id, title, detail, link, cateTitle) {
      this.tipInfo.objectId = id 
      this.tipInfo.title = title 
      this.tipInfo.detail = detail 
      this.tipInfo.link = link 
      this.tipInfo.isShow = true 
      this.tipInfo.cateTitle = cateTitle 
      this.tipInfo.originCateTitle = cateTitle 
      this.tipInfo.cateArr = self.cateArr 
      this.tipInfo.type = 1
      this.tipInfo.totalData = this.totalData
    },

    updataList (data) {
      console.log("开始更新数据")
      let self = this
      //单项目更新
      if(1 == data.type){
        self.list.map( (item) => {
          item.data.map( (cell) => {
            if(cell.objectId === data.objectId){
              cell.title = data.title
              cell.detail = data.detail
              cell.link = data.link
            }
          })
        } )     
        self.getTotalData()   
      }else if(2 == data.type){
        if(data.cateArr.indexOf(data.cateTitle) != -1 ){
          self.list.map( (item, index) => {
            if(item.cateTitle == data.originCateTitle){
              self.list.map( (cell, idx) => {
                if(cell.cateTitle == data.cateTitle){
                  let arr = [].concat(cell.data,item.data).sort((a, b) => {
                    return a.createdAt - b.createdAt
                  })
                  // cell.data.concat(item.data)
                  //此处数据未更新
                  self.list.splice(idx, 1, {"cateTitle": cell.cateTitle, "data": arr})
                  self.list.splice(index, 1)

                }
              })
            }
          } )  
        }else{
          self.list.map( (item) => {
            if(item.cateTitle == data.originCateTitle){
              self.cateArr.push(data.cateTitle) 
              item.cateTitle = data.cateTitle
            }
          } )  
          self.cateArr.map( (item, index)=>{
              if(item == data.originCateTitle){
                self.cateArr.splice(index, 1)
              }
          } )
        }
        self.getTotalData()
      //新增
      }else if(3 == data.type){
          if(self.cateArr.indexOf(data.cateTitle) != -1){
            self.list.map( (item) => {
              if(item.cateTitle == data.cateTitle){
                item.cateTitle = data.cateTitle
                item.data.push({
                  "objectId": data.objectId,
                  "title": data.title,
                  "detail": data.detail,
                  "link": data.link,
                  "image": data.image                  
                })
              }
            } ) 
          }else{
            self.list.push({
              "cateTitle": data.cateTitle,
              "data": [{
                  "objectId": data.objectId,
                  "title": data.title,
                  "detail": data.detail,
                  "link": data.link,
                  "image": data.image                
              }]
            })
            self.cateArr.push(data.cateTitle)
          }    
          self.getTotalData()    
      }

    },

    editCateTitle (cateTitle, cateArr) {
      this.tipInfo.objectId = "" 
      this.tipInfo.title = "" 
      this.tipInfo.detail = ""  
      this.tipInfo.link = ""       
      this.tipInfo.isShow = true
      this.tipInfo.cateTitle = cateTitle 
      this.tipInfo.originCateTitle = cateTitle 
      this.tipInfo.cateArr = cateArr 
      this.tipInfo.totalData = this.totalData 
      this.tipInfo.type = 2    
    },

    addItemData () {
      this.tipInfo.objectId = '' 
      this.tipInfo.title = '' 
      this.tipInfo.detail = '' 
      this.tipInfo.link = '' 
      this.tipInfo.isShow = true 
      this.tipInfo.cateTitle = ''
      this.tipInfo.originCateTitle = '' 
      this.tipInfo.cateArr = self.cateArr 
      this.tipInfo.type = 3
      this.tipInfo.totalData = this.totalData
    },

    delCateTitle(cateTitle) {
      if(confirm("您确定要删除吗？")){
         let self = this
         let objects = []; // 构建一个本地的 AV.Object 对象数组
         self.totalData.map( (item) => {
            if(item.cateTitle == cateTitle){
              let dataTypeDoc = AV.Object.createWithoutData('DataTypeDoc', item.objectId);
              dataTypeDoc.set('cateTitle', cateTitle)
              objects.push(dataTypeDoc)
            }
         })

        // 批量删除
        AV.Object.destroyAll(objects).then(function () {
          self.list.map( (item ,index) => {
            if(item.cateTitle == cateTitle){
              self.list.splice(index, 1)
            }
          })
          alert("删除成功")
        }, function (error) {
            // 异常处理
            alert("数据删除失败，请重新操作")
        }) 

        self.cateArr.map( (item, index)=>{
            if(item == cateTitle){
              self.cateArr.splice(index, 1)
            }
        } )
      }  
    },

    delItemTitle(objectId, cateTitle){
      let self = this
      if(confirm("您确定要删除吗？")){
        let dataTypeDoc = AV.Object.createWithoutData('DataTypeDoc', objectId);
        dataTypeDoc.destroy().then(function (success) {
          self.list.map( (item ,index) => {
            if(item.cateTitle == cateTitle){
              item.data.map( (cell, idx) => {

                if(cell.objectId == objectId){
                  item.data.splice(idx, 1)
                }
              } )
            }
          })
          alert("删除成功")
        }, function (error) {
          // 异常处理
          alert("数据删除失败，请重新操作")
        })      
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
.admin_edit_hd{
  height: 60px;  
  line-height: 60px;  
  background: #ef3b42;
  padding: 0 30px;
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 20px;
  position: relative;
  a{
    position: absolute;
    bottom:0;
    border-radius: 4px 4px 0 0;
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    width: 80px;
    text-align: center;
    font-weight: normal;
    background: #e20911;
    color: #fff;
    &:hover{
      opacity: .8;
    }
    &.admin_go_index{
      right: 100px;
    }
    &.admin_edit_add{
      right: 10px;
    }
  }
}

.admin_edit_item{
  margin-bottom: 30px;
  padding: 0 30px;
  .admin_cate-tit{
    color: #ef3b42;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    font-weight: normal;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
    position: relative;
    span{
      display: inline-block;
      height: 40px;
      line-height: 40px;
      position: relative;
      &::after{
        position: absolute;
        content: " ";
        width: 100%;
        height: 2px;
        background: #ef3b42;
        bottom: -1px;
        left: 0;
      }      
    }
    a{
      position: absolute;
      font-size: 12px;
      right: 2px;
      height: 20px;
      line-height: 20px;
      padding: 0 5px;
      top: 50%;
      color: #fff;
      transform: translateY(-50%); 
      background: #ef3b42;  
      &:hover{
        opacity: .8;
      }
      &:nth-child(2){
        right: 40px;
        background: #FF9800;
      }   
    }
  }
}
.admin_cate{
  @extend %clearfix
}
.admin_cate_item{
  padding: 10px 15px;
  box-sizing: border-box;
  width: 160px;
  height: 60px;
  background: #f5f5f5;
  float: left;
  outline: 1px solid #eee \9;
  transition: all .2s ease-in;  
  margin: 0 10px 10px 0;
  position: relative;
  h3,p{
    @include line;
  }
  h3{
    margin-bottom: 5px;
    color: #389bcf;
    font-size: 14px;  
  }
  p{
    color: #999;
  }
  span{
    position: absolute;
    font-size: 10px;
    background: #ef3b42;
    color: #fff;
    height: 18px;
    line-height: 18px;
    width: 28px;
    text-align: center;
    top: 0;
    cursor: pointer;
    &:hover{
      opacity: .9;
    }
    &.admin_item_edit{
      right: 28px;
      background: #FF9800;
    }
    &.admin_item_del{
      right: 0;
    }
  }
}
</style>
