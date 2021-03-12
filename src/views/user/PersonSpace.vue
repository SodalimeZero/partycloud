<template>
  <div class="main">
    <div class="main-content">
      <span style="margin-left: 40px;">账号</span>
      <p style="margin-left: 20px;display: inline">{{ this.$store.getters.userInfo.account }}</p>
      <br/><br/>
      <span style="margin-left: 40px;">姓名</span>
      <p style="margin-left: 20px;display:inline">{{ this.$store.getters.userInfo.name }}</p>
      <br/><br/>
      <span style="margin-left: 40px;">性别</span>
      <p style="margin-left: 20px;display: inline" v-if="gender">男</p>
      <p v-else style="margin-left: 20px;display: inline">女</p>
      <br/><br/>
      <div>
        <!--        <a-form-model></a-form-model>-->
        <!--        <label for="oldPwd" style="margin-left: 40px;">旧密码</label>-->
        <!--        <a-input id="oldPwd" type="password" style="margin-left: 20px;width: 30%"/>-->
        <!--        <br/><br/>-->
        <!--        <label for="newPwd" style="margin-left: 40px;">新密码</label>-->
        <!--        <a-input id="newPwd" type="password" style="margin-left: 20px;width: 30%"/>-->
        <!--        <br/><br/>-->
        <!--        <label for="checkPwd" style="margin-left: 40px;">确认密码</label>-->
        <!--        <a-input id="checkPwd" type="password" style="margin-left: 18px;width: 30%"/>-->
        <!--        <br/><br/>-->
        <a-form-model ref="editForm" :model="editForm" :rules="rules" style="margin-left: 40px">
          <a-form-model-item label="旧密码" has-feedback prop="oldPwd">
            <a-input type="password" v-model="editForm.oldPwd" style="width: 30%"/>
          </a-form-model-item>
          <a-form-model-item label="新密码" has-feedback prop="newPwd">
            <a-input type="password" v-model="editForm.newPwd" style="width: 30%"/>
          </a-form-model-item>
          <a-form-model-item label="确认密码" has-feedback prop="checkPwd">
            <a-input type="password" v-model="editForm.checkPwd" style="width: 30%"/>
          </a-form-model-item>
        </a-form-model>
        <a-button style="margin-left: 40px;" type="primary" @click="changePwd('editForm')">修改密码</a-button>
      </div>
    </div>
  </div>
</template>

<script>
// import { getBranchList } from '@/api/branch'
// import { selectUser } from '@/api/user'

import { changePwd } from '@/api/user'

export default {
  name: 'PersonSpace',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.editForm.checkPwd !== '') {
          this.$refs.editForm.validateField('checkPwd')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.editForm.newPwd) {
        callback(new Error('两次输入的密码不同!'))
      } else {
        callback()
      }
    }
    return {
      // account: Storage.getItem('access_token')
      account: localStorage.getItem('account'),
      name: this.$store.getters.userInfo.name,
      gender: this.$store.getters.userInfo.gender,
      editForm: {
        oldPwd: '',
        newPwd: '',
        checkPwd: ''
      },
      rules: {
        newPwd: [{ validator: validatePass, trigger: 'change' }],
        checkPwd: [{ validator: validatePass2, trigger: 'change' }],
        oldPwd: [{ validator: validatePass, trigger: 'change' }]
      }
    }
  },
  methods: {
    changePwd (formName) {
      var _this = this
      // console.log(record)
      // console.log(_this.userId)
      _this.$refs[formName].validate(valid => {
        if (valid) {
          changePwd({
            // account: _this.ruleForm.account,
            // pwd: _this.ruleForm.pwd,
            oldPwd: _this.editForm.oldPwd,
            newPwd: _this.editForm.newPwd,
            id: _this.$store.getters.userInfo.id
          }).then(response => {
            console.log(response.data)
            // _this.visible1 = false
            // _this.reload()
            // _this.$router.push({ name: 'Login' })
            // _this.userList = response.data
            _this.$notification.success({ message: '成功修改密码' })
            return this.$store.dispatch('Logout').then(() => {
              this.$router.push({ name: 'Login' })
            })
          }).catch(error => {
            console.log(error)
          })
          // alert('submit!')
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
  left: 0;
  right:0;
  position: relative;
  background-color: white; }

.main-content {
  padding: 28px 10px; }
</style>
