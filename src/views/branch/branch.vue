<template>
  <div class="main">
    <div class="main-content">
      <h3 style="margin-left: 20px">支部管理</h3>
      <a-button type="primary" style="margin-right: 24px;float: right;margin-top: -27px;" @click="showModal">创建支部</a-button>
      <a-modal v-model="visible" title="创建支部" @ok="submitForm('ruleForm')">
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">
          <a-form-model-item has-feedback label="支部名称" prop="name">
            <a-input v-model="ruleForm.name" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="备注" prop="details">
<!--            <a-input v-model="ruleForm.details" />-->
            <a-textarea
              v-model="ruleForm.details"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <br />
      <a-input-search
        placeholder="请输入支部名称"
        v-model="branchName"
        enter-button
        style="width: 200px;float: right"
        @search="onSearch" />
      <br /><br />
      <a-table :data-source="userList" :columns="columns" :pagination="pagination" style="width:100%;text-align:center">
        <template slot="operate" slot-scope="text, record">
          <a-modal v-model="visible1" title="编辑支部" @ok="updateForm('editForm')">
            <a-form-model ref="editForm" :model="editForm" :rules="rules">
              <a-form-model-item has-feedback label="支部名称" prop="name">
                <a-input v-model="editForm.name" />
              </a-form-model-item>
              <a-form-model-item has-feedback label="备注" prop="details">
                <a-input v-model="editForm.details" />
              </a-form-model-item>
            </a-form-model>
          </a-modal>
          <a-button type="default" @click="showModal1(record)">
            <a-icon type="edit"/>编辑
          </a-button>
          <a-popconfirm
            title="确定删除吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirm(record)"
          >
            <a-button type="danger" style="margin-left: 20px">
              <a-icon type="delete"/>
              删除
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
// import { getBranchList } from '@/api/branch'

import { addBranch, deleteBranch, getBranchList, selectBranch, updateBranch } from '@/api/branch'
// import { selectUser } from '@/api/user'

const pagination = {
  defaultCurrent: 1,
  defaultPageSize: 7
}
export default {
  name: 'Branch',
  inject: ['reload'],
  data () {
    return {
      searchContent: '',
      // branchName: '',
      userList: [],
      branchId: '',
      columns: [
        {
          title: '支部名称',
          dataIndex: 'name',
          width: 100,
          scopedSlots: { customRender: 'name' },
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'note',
          width: 100,
          scopedSlots: { customRender: 'note' },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operate',
          width: 100,
          scopedSlots: { customRender: 'operate' },
          align: 'center'
        }
      ],
      pagination,
      ModalText: 'Content of the modal',
      visible: false,
      visible1: false,
      confirmLoading: false,
      branchName: '',
      ruleForm: {
        name: '',
        details: ''
      },
      editForm: {
        name: '',
        details: ''
      },
      rules: {
        name: [{ required: true, trigger: 'change', message: '请输入支部名称' }],
        details: [{ required: true, trigger: 'change', message: '备注不能为空' }]
      }
    }
  },
  mounted () {
    var _this = this
    getBranchList().then(response => {
      console.log(response.data)
      _this.userList = response.data
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!')
          addBranch({
            name: this.ruleForm.name,
            note: this.ruleForm.details
          }).then(response => {
            console.log(response.data)
            this.reload()
          }).catch(error => {
            console.log(error)
          })
          this.visible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateForm (formName) {
      // console.log(record.id)
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateBranch({
            name: this.editForm.name,
            note: this.editForm.details,
            id: this.branchId
          }).then(response => {
            console.log(response.data)
            this.reload()
            // getBranchList().then(response => {
            //   console.log(response.data)
            //   this.userList = response.data
            // }).catch(error => {
            //   console.log(error)
            // })
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
    },
    onSearch () {
      var _this = this
      console.log(_this.branchName)
      selectBranch({
        branchName: _this.branchName
      }).then(response => {
        console.log(response.data)
        _this.userList = response.data
        // _this.visible1 = false
        // _this.reload()
      }).catch(error => {
        console.log(error)
      })
    },
    skip (id) {

    },
    showModal () {
      this.visible = true
    },
    showModal1 (record) {
      console.log(record)
      this.visible1 = true
      this.editForm.name = record.name
      this.editForm.details = record.note
      this.branchId = record.id
    },
    confirm (record) {
      console.log(record)
      deleteBranch({
        id: record.id
      }).then(response => {
        console.log(response.data)
        this.reload()
      }).catch(error => {
        console.log(error)
      })
      // this.$message.success('Click on Yes')
    },
    cancel (e) {
      console.log(e)
      // this.$message.error('Click on No')
    },
    // handleOk (e) {
    //   // this.ModalText = 'The modal will be closed after two seconds'
    //   var _this = this
    //   _this.confirmLoading = true
    //   _this.$axios.post('/createBranch',
    //     _this.$qs.stringify({
    //       branchName: _this.branchName
    //     })
    //   ).then(function (response) {
    //     console.log(response)
    //   }).catch(function (error) {
    //     console.log(error)
    //   })
    //   setTimeout(() => {
    //     _this.visible = false
    //     _this.confirmLoading = false
    //   }, 1000)
    //   _this.reload()
    // },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
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
  left: 0;
  right: 0;
  position: relative;
  background-color: white;
}

.main-content {
  padding: 28px 10px;
}

</style>
