<template>
  <div class="loginContainer">
    <!--    <div class="row">-->
    <!--      <div-->
    <!--        class="col-md-4 col-md-offset-4"-->
    <!--        style="background-color:white;-->
    <!--             padding:40px;-->
    <!--             width: 450px;-->
    <!--             height: 350px;-->
    <!--             padding-top: 10px;-->
    <!--             padding-bottom: 10px;-->
    <!--             border-radius: 15px;">-->
    <!--        <p style="text-align: center; font-size: 20px;margin-top: 20px;color: black">-->
    <!--          信息与安全工程学院党建云-->
    <!--        </p>-->
    <!--        <a-divider/>-->
    <!--        <br/>-->
    <!--        <div style="font-size: 15px; text-align: center;color: black">-->
    <!--          <label for="account" style="display:inline-block;width:50px;text-align:left;">用户名</label>-->
    <!--          <a-input-->
    <!--            type="text"-->
    <!--            id="account"-->
    <!--            style="font-size:10px;"-->
    <!--            placeholder="请输入用户名"/><br/>-->
    <!--          <label for="password" style="display:inline-block;width:50px;text-align:left;">密码</label>-->
    <!--          <a-input-->
    <!--            type="password"-->
    <!--            id="password"-->
    <!--            style="font-size:10px;"-->
    <!--            placeholder="请输入密码"/><br>-->
    <!--        </div>-->
    <!--        <br/>-->
    <!--        <div style="padding-left: 20px;">-->
    <!--&lt;!&ndash;          <input type="checkbox" name="记住密码" value="记住密码" />&ndash;&gt;-->
    <!--&lt;!&ndash;          <span style="font-size: 10px; ">记住密码</span>&ndash;&gt;-->
    <!--          <a-checkbox size="large" style="color:#000;">自动登录</a-checkbox><br/><br/>-->
    <!--&lt;!&ndash;          <input type="submit" name="登录" id="submit" value="登录">&ndash;&gt;-->
    <!--          <a-button type="primary" id="submit">登录</a-button>-->
    <!--        </div>-->
    <!--        <br/>-->
    <!--        <a-->
    <!--          href="#"-->
    <!--          style="color: blue;-->
    <!--             font-size:10px; padding-left: 20px;">还没有账号？注册账号</a>-->
    <!--      </div>-->
    <!--    </div>-->
    <a-row class="login-main">
      <a-col :span="12" class="login-carousel">
        <img src="@/assets/images/login/carouse.jpeg">
      </a-col>
      <a-col :span="12" class="login-form-container">
        <div class="title">欢迎登录我的后台</div>
        <a-form-model ref="form" :model="form" :rules="rules" class="form">
          <a-form-model-item prop="account">
            <span class="gray">您的账号</span>
            <a-input
              v-model="form.account"
              size="large"
              clearable
              autocomplete="false"
              tabindex="1"
              placeholder="请输入用户名"
            >
              <a-icon slot="prefix" type="user" class="gray"/>
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="password">
            <span class="gray">您的密码</span>
            <a-input
              v-model="form.password"
              clearable
              size="large"
              type="password"
              autocomplete="false"
              tabindex="2"
              password
              placeholder="请输入密码"
              @keyup.enter.native="handleLogin"
            >
              <a-icon slot="prefix" type="lock" class="gray"/>
            </a-input>
          </a-form-model-item>
        </a-form-model>

        <a-row type="flex" justify="space-between">
          <a-checkbox v-model="form.keepLogin" size="large">自动登录</a-checkbox>
          <a>忘记密码</a>
        </a-row>
        <a-row>
          <a-button
            size="large"
            type="primary"
            class="login-btn"
            tabindex="5"
            @click="handleLogin"
            block
          >
            <span v-if="!loading">登录</span>
            <span v-else>登录中...</span>
          </a-button>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'Login3',
  data () {
  return {
    redirect: undefined,
    loading: false,
    form: {
      account: '',
      password: '',
      keepLogin: false
    },
    rules: {
      account: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
      password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
    }
  }
  }
}
</script>

<style lang="less" scoped>
.login-container{
  height: 100vh;
  background: url("../../assets/images/login/4.jpg");
  background-size:cover;

  .login-main {
    position: absolute;
    top: 50%;
    left: 50%;
    box-shadow: 0 8px 19px 2px rgba(0, 0, 0, 0.16);
    border-radius: 20px;
    background: #FFFFFF;
    width: 800px;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);

  .login-carousel {
    height: 500px;

    img {
      border-radius: 18px 0 0 18px;
      display: inline-block;
      height: 100%;
      width: 100%;
      background-size: cover;
    }
  }

  .login-form-container {
    margin-top: 30px;
    padding: 0 50px;

    .title {
      padding: 36px 0 20px 0;
      font-size: 30px;
      text-align: center;
      color: #333333;
    }

    /deep/.ant-form-item{
      margin-bottom: 14px;
    }

    .forget-pass,
    .other-way {
      font-size: 14px;
    }

    .login-btn,
    .other-login {
      margin-top: 5vh;
    }
  }
}

  .foot {
    position: absolute;
    left: 50%;
    bottom: 10px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    -webkit-transform: translate(-50%);
    transform: translate(-50%);

  .help {
    margin: 0 auto 2vh;
    width: 60%;

  .item {
    color: rgba(0, 0, 0, 0.45);
  }

  :hover {
    color: rgba(0, 0, 0, 0.65);
  }
  }

a {
  color: #2d8cf0;
  background: 0 0;
  text-decoration: none;
  outline: 0;
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: 14px;
  }
}
}
/*.loginContainer{*/
/*  background: url("../../assets/images/login/4.jpg");*/
/*  background-size: cover;*/
/*  height: 100vh;*/
/*}*/
//#password,#account{
//  width:200px;
//  height:33px;
//  /*border:1px solid rgb(16, 16, 16);*/
//  /*border-radius: 5px;*/
//  margin:5px;
//}
//checkbox{
//  width:100px;
//  height:100px;
//}
//.row{
//  position: absolute;
//  top:50%;
//  left:50%;
//  transform: translate(-50%,-50%);
//  /*height: 300px;*/
//  border-radius: 15px;
//  opacity: 0.9;
//}
//#submit{
//  /* border-color: white; */
//  background-color:#50C1E9;
//  color: white;
//  width:75%;
//  height:40px;
//  line-height: 20px;
//  text-align: center;
//  border-radius: 5px;
//  font-weight:lighter;
//  font-size: 15px;
//  border-width: 0px;
//  margin-left: 40px;
//}
</style>
