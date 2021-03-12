<template>
  <div class="main">
    <div class="main-content">
      <h3 class="panel-title" style="margin-left: 20px">用户管理</h3>
      <div style="display: inline;margin-left: 570px">
        <a-button type="primary" @click="showModal">
          添加用户
        </a-button>
        <a-modal v-model="visible" title="添加用户信息" @ok="submitForm('ruleForm')">
          <a-form-model ref="ruleForm" :label-col="labelCol" :wrapper-col="wrapperCol"  :model="ruleForm" :rules="rules">
            <a-form-model-item has-feedback label="姓名" prop="name">
              <a-input v-model="ruleForm.name" style="display: inline"/>
            </a-form-model-item>
            <a-form-model-item has-feedback label="账号" prop="account">
              <a-input v-model="ruleForm.account" />
            </a-form-model-item>
            <a-form-model-item label="性别" prop="gender">
              <a-radio-group v-model="ruleForm.gender">
                <a-radio value="1">
                  男
                </a-radio>
                <a-radio value="0">
                  女
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item has-feedback label="密码" prop="pwd">
              <a-input v-model="ruleForm.pwd" type="password" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item has-feedback label="确认密码" prop="checkPass">
              <a-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
            </a-form-model-item>
          </a-form-model>
        </a-modal>
      </div>
      <a-input-search
        placeholder="请输入用户姓名"
        v-model="username"
        enter-button
        style="width: 200px;float: right;display: inline"
        @search="onSearch" />
      <br/><br/>
      <a-table :data-source="userList" :columns="userColumns" :pagination="pagination" style="width:100%;text-align:center">
        <template slot="gender" slot-scope="text, record">
          <span v-if="record.gender.valueOf()">男</span>
          <span v-else>女</span>
        </template>
        <template slot="operate" slot-scope="text, record">
          <a-button type="default" @click="showModal1(record)">修改</a-button>
          <a-modal v-model="visible1" title="修改用户信息" @ok="updateForm('editForm')">
            <a-form-model ref="editForm" :model="editForm" :rules="rules">
              <a-form-model-item has-feedback label="姓名" prop="name">
                <a-input v-model="editForm.name" />
              </a-form-model-item>
              <a-form-model-item label="性别" prop="gender">
                <a-radio-group v-model="editForm.gender">
                  <a-radio :value="1">
                    男
                  </a-radio>
                  <a-radio :value="0">
                    女
                  </a-radio>
                </a-radio-group>
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
import { addUser, delUser, editUser, listUser, selectUser } from '@/api/user'

const pagination = {
  defaultCurrent: 1,
  defaultPageSize: 7
}
const userColumns = [
  {
    title: '账号',
    dataIndex: 'account',
    width: 100,
    align: 'center'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 50,
    align: 'center'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: 40,
    scopedSlots: { customRender: 'gender' },
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 100,
    scopedSlots: { customRender: 'operate' },
    align: 'center'
  }
]
const userList = [
  {
    key: 1,
    account: '201811200048',
    name: '张梦丹',
    gender: '女'
  },
  {
    key: 2,
    account: '201811200048',
    name: '张梦丹',
    gender: '女'
  },
  {
    key: 3,
    account: '201811200048',
    name: '张梦丹',
    gender: '女'
  }
]
export default {
  name: 'UserManage',
  inject: ['reload'],
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pwd) {
        callback(new Error('两次输入的密码不同!'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      const reg = /^[\u2E80-\u9FFF]+$/// Unicode编码中的汉字范围
      if (value && value.length > 0) {
        if (!reg.test(value)) {
          callback(new Error('姓名输入不合法'))
        } else {
          callback()
        }
      } else if (value.length === 0) {
        callback(new Error('请输入姓名'))
      } else {
        callback(new Error('姓名输入不合法'))
      }
    }
    return {
      // value: 1,
      // form: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      username: '',
      pagination,
      userColumns,
      // pagination,
      userList,
      userId: '',
      visible: false,
      visible1: false,
      ruleForm: {
        pwd: '',
        checkPass: '',
        name: '',
        account: '',
        gender: ''
      },
      editForm: {
        name: '',
        gender: ''
      },
      rules: {
        pwd: [{ validator: validatePass, trigger: 'change' }],
        checkPass: [{ validator: validatePass2, trigger: 'change' }],
        name: [{ validator: validateName, trigger: 'change', required: true }],
        account: [{ required: true, trigger: 'change', message: '请输入账号' }],
        gender: [{ required: true, trigger: 'change', message: '性别不能为空' }]
        // age: [{ validator: checkAge, trigger: 'change' }]
      }
    }
  },
   mounted () {
    var _this = this
     listUser().then(response => {
       console.log(response.data)
       _this.userList = response.data
     }).catch(error => {
       console.log(error)
     })
   },
  methods: {
    showModal () {
      this.visible = true
    },
    showModal1 (record) {
      console.log(record)
      this.visible1 = true
      this.userId = record.id
      this.editForm.name = record.name
      this.editForm.gender.value = record.gender.valueOf()
    },
    handleOk (e) {
      console.log(e)
      this.visible = false
    },
    submitForm (formName) {
      var _this = this
      _this.$refs[formName].validate(valid => {
        if (valid) {
          addUser({
            account: _this.ruleForm.account,
            pwd: _this.ruleForm.pwd,
            name: _this.ruleForm.name,
            gender: _this.ruleForm.gender.valueOf()
          }).then(response => {
            console.log(response.data)
            _this.reload()
            // _this.userList = response.data
          }).catch(error => {
            console.log(error)
          })
          // alert('submit!')
          this.visible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // eslint-disable-next-line vue/no-dupe-keys
    updateForm (formName) {
      var _this = this
      _this.$refs[formName].validate(valid => {
        if (valid) {
          editUser({
            name: _this.editForm.name,
            gender: _this.editForm.gender.valueOf()
          }).then(response => {
            console.log(response.data)
            _this.reload()
            // _this.userList = response.data
          }).catch(error => {
            console.log(error)
          })
          // alert('submit!')
          this.visible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onSearch () {
      var _this = this
      selectUser({
        userName: _this.username
      }).then(response => {
        console.log(response.data)
        _this.userList = response.data
        // _this.visible1 = false
        // _this.reload()
      }).catch(error => {
        console.log(error)
      })
    },
    confirm (record) {
      var _this = this
      console.log(record.id)
      delUser({
        id: record.id
      }).then(response => {
        console.log(response.data)
        // _this.userList = response.data
        // _this.visible1 = false
        _this.reload()
      }).catch(error => {
        console.log(error)
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
  left: 0;
  right:0;
  position: relative;
  background-color: white; }

.main-content {
  padding: 28px 10px; }
</style>
