<template>
  <div class="main">
    <div class="main-content">
      <a-icon type="arrow-left" @click="$router.back(-1)"></a-icon>
      <h3 class="panel-title" style="margin-left: 20px;display: inline">添加新闻</h3><br/><br/>
      <!--      <div>-->
      <!--        <editor-bar v-model="detail" :isClear="isClear" @change="change"></editor-bar>-->
      <!--      </div>-->
      <!--      <editor :content="infoForm.articleContent" :getFullText="changeEditor"></editor>-->
      <a-form-model ref="newsForm" :model="newsForm" :rules="rules">
        <a-form-model-item label="新闻类型" prop="type">
          <a-radio-group v-model="newsForm.type">
            <a-radio value="1" :disabled="ifDisabled1">
              通知
            </a-radio>
            <a-radio value="2" :disabled="ifDisabled2">
              支部
            </a-radio>
            <a-radio value="3" :disabled="ifDisabled3">
              公告
            </a-radio>
            <a-button style="margin-left: 100px" type="primary" @click="showDrawer">管理新闻类型</a-button>
            <a-drawer
              :visible="visible"
              width="250px"
              placement="right"
              :closable="false"
              @close="onClose"
              title="管理新闻类型">
              通知&nbsp;&nbsp;<a-switch default-checked @change="onChange1" /><br/><br/>
              支部&nbsp;&nbsp;<a-switch default-checked @change="onChange2" /><br/><br/>
              公告&nbsp;&nbsp;<a-switch default-checked @change="onChange3" /><br/><br/>
            </a-drawer>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item has-feedback label="新闻标题" prop="name">
          <a-input v-model="newsForm.title" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="新闻内容" prop="details">
          <!--            <a-input v-model="ruleForm.details" />-->
          <a-textarea
            v-model="newsForm.content"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-model-item>
        <a-button type="submit" @click="submitForm('newsForm')">发布</a-button>
      </a-form-model>
    </div>
  </div>
<!--  </div>-->
</template>

<script>
import Editor from '@/components/Editor/WangEditor'
import { addNews } from '@/api/news'
export default {
  name: 'AddNews',
  components: { Editor },
  data () {
    return {
      isClear: false,
      ifDisabled1: false,
      ifDisabled2: false,
      ifDisabled3: false,
      visible: false,
      detail: '',
      infoForm: {
        articleContent: '你好'
      },
      newsForm: {
        title: '',
        content: '',
        type: ''
      },
      rules: {
        type: [{ required: true, trigger: 'change', message: '请选择新闻类型' }],
        title: [{ required: true, trigger: 'change', message: '请输入新闻标题' }],
        content: [{ required: true, trigger: 'change', message: '请输入新闻内容' }]
      },
      id: this.$store.getters.userInfo.id
    }
  },
  methods: {
    submitForm (formName) {
      var _this = this
      console.log(_this.$store.getters.userInfo.id)
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!')
          console.log(_this.id)
          addNews({
            userId: _this.id,
            typeId: _this.newsForm.type.valueOf(),
            title: _this.newsForm.title,
            content: _this.newsForm.content,
            isTop: 0
          }).then(response => {
            console.log(response.data)
            _this.reload()
          }).catch(error => {
            console.log(error)
          })
          _this.visible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleOk (e) {
      this.confirmLoading = true
      // setTimeout(() => {
      //   this.visible = false
      //   this.confirmLoading = false
      // }, 500)
      this.visible = false
    },
    handleCancel (e) {
      this.visible = false
    },
    change (val) {
      console.log(val)
    },
    showModal () {
      this.visible = true
    },
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    onChange1 (checked) {
      console.log(`a-switch to ${checked}`)
      if (checked) {
        this.ifDisabled1 = false
      } else {
        this.ifDisabled1 = true
      }
    },
    onChange2 (checked) {
      console.log(`a-switch to ${checked}`)
      if (checked) {
        this.ifDisabled2 = false
      } else {
        this.ifDisabled2 = true
      }
    },
    onChange3 (checked) {
      console.log(`a-switch to ${checked}`)
      if (checked) {
        this.ifDisabled3 = false
      } else {
        this.ifDisabled3 = true
      }
    },
    changeEditor () {

    }
  }
}
</script>

<style scoped>
.main {
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  /*width: calc(100% - 100px);*/
  left: 0;
  right:0;
  position: relative;
  /*float: right;*/
  background-color: white; }

.main-content {
  padding: 28px 10px;
  margin-left: 20px}
</style>
