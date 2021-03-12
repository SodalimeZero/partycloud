<template>
  <div class="main">
    <div class="main-content">
      <h3 class="panel-title" style="margin-left: 20px">新闻管理</h3>
      <a-button type="default" style="margin-right: 24px;float: right;margin-top: -27px;" onclick="add()">批量导入</a-button>
      <a-button type="primary" style="margin-right: 24px;float: right;margin-top: -27px;">
        <router-link to="/news/addNews">
          添加新闻
        </router-link>
      </a-button>
      <br/>
      <a-input-search
        placeholder="搜索"
        v-model="newsName"
        enter-button
        style="width: 200px;float: right"
        @search="onSearch" />
      <br/><br/>
      <a-table :data-source="newsList" :columns="columns" :pagination="pagination" style="width:100%;text-align:center">
        <template slot="status" slot-scope="text, record">
          <a-button v-if="record.status" @click="start(record)">启用</a-button>
          <a-button v-else @click="stop(record)">停止启用</a-button>
        </template>
        <template slot="operate" slot-scope="text, record">
          <a-button type="default">
            查看详情
          </a-button>
          <a-modal v-model="visible1" title="编辑支部">
          </a-modal>
          <a-button type="default" @click="showModal1(record)">编辑</a-button>
          <a-modal v-model="visible1" title="编辑支部" @ok="updateForm('editForm')">
            <a-form-model ref="editForm" :model="editForm" :rules="rules">
              <a-form-model-item has-feedback label="标题" prop="name">
                <a-input v-model="editForm.title" />
              </a-form-model-item>
              <a-form-model-item has-feedback label="内容" prop="details">
                <!--                <a-input v-model="editForm.note" />-->
                <a-textarea
                  v-model="editForm.content"
                  :auto-size="{ minRows: 3, maxRows: 5 }"
                />
              </a-form-model-item>
            </a-form-model>
          </a-modal>
          <a-popconfirm
            title="确定删除吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirm(record)"
          >
            <a-button type="danger" style="margin-left: 20px">
              删除
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { changeState, deleteNews, editNews, getNews, selectNews } from '@/api/news'
// import { updateBranch } from '@/api/branch'

const pagination = {
  defaultCurrent: 1,
  defaultPageSize: 7
}
const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    width: 300,
    align: 'center'
  },
  // {
  //   title: '内容',
  //   dataIndex: 'content',
  //   width: 300,
  //   align: 'center'
  // },
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   width: 100,
  //   scopedSlots: { customRender: 'status' },
  //   align: 'center'
  // },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 200,
    scopedSlots: { customRender: 'operate' },
    align: 'center'
  }
]
export default {
  name: 'News',
  inject: ['reload'],
  data () {
    return {
      pagination,
      newsList: [],
      newsId: '',
      columns,
      newsName: '',
      editForm: {
        title: '',
        content: ''
      },
      visible1: false,
      visible2: false,
      newsTitle: '',
      newsContent: '',
      rules: {
        // type: [{ required: true, trigger: 'change', message: '请选择新闻类型' }],
        title: [{ required: true, trigger: 'change', message: '请输入新闻标题' }],
        content: [{ required: true, trigger: 'change', message: '请输入新闻内容' }]
      }
    }
  },
  mounted () {
    getNews().then(response => {
      console.log(response.data)
      this.newsList = response.data
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {
    start (record) {
      var _this = this
      console.log(record.id)
      changeState({
        id: record.id,
        status: 0
      }).then(response => {
        console.log(response.data)
        _this.reload()
      }).error(error => {
        console.log(error)
      })
    },
    stop (record) {
      var _this = this
      console.log(record.id)
      changeState({
        id: record.id,
        status: 1
      }).then(response => {
        console.log(response.data)
        _this.reload()
      }).error(error => {
        console.log(error)
      })
    },
    onSearch () {
      var _this = this
      // console.log(record.id)
      selectNews({
        newsName: _this.newsName
      }).then(response => {
        console.log(response.data)
        _this.newsList = response.data
        // _this.reload()
      }).error(error => {
        console.log(error)
      })
    },
    confirm (record) {
      var _this = this
      console.log(record.id)
      deleteNews({
        id: record.id
      }).then(response => {
        console.log(response.data)
        _this.reload()
      }).error(error => {
        console.log(error)
      })
    },
    showModal1 (record) {
      // console.log(record)
      this.visible1 = true
      this.newsId = record.id
      this.editForm.title = record.title
      this.editForm.content = record.content
    },
    showNewsContent (record) {
      this.visible2 = true
      // this.t
    },
    updateForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editNews({
            name: this.editForm.title,
            note: this.editForm.content,
            id: this.newsId
          }).then(response => {
            console.log(response.data)
            this.reload()
          }).catch(error => {
            console.log(error)
          })
          // alert('submit!')
          this.visible1 = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
  padding: 28px 10px; }

</style>
