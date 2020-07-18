<template>
  <div class='login_container'>
    <div class="login_box">
      <!--登录logo区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!--登录表单区域,loginFormRef可以拿到整个表单实例对象，loginForm是一个属性绑定一个数据对象,loginFormRules是表单绑定的验证规则对象-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--用户名,prop指定的是验证规则-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
           <el-button @click="login" type="primary">登录</el-button>
            <el-button @click="resetloginForm" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {

    return {
      //这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //这是表单数据验证规则对象
      loginFormRules: {
        username: [
                    {required: true, message: "请输入登录名称", trigger: "blur"},
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
        password: [
                    {required: true, message: "请输入密码", trigger: "blur"},
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ]

      }
    }
  },

  methods: {
    resetloginForm(){ //重置表单
      //console.log(this)
      //this.$refs可以访问到表单对象（ref属性指定的），resetField是由element提供的表单对象内置方法，作用是重置表单
      this.$refs.loginFormRef.resetFields()
    },
    login(){ //validate是element提供的表单对象内置方法,作用是把表单规则对象对表单进行验证，其回调函数形参表示验证是否通过，为布尔值
      this.$refs.loginFormRef.validate(async valid=>{
        //console.log(valid)
        if(!valid){
          return
        }else {
          const result =await this.$http.post('/login',this.loginForm)
          //console.log(result)
          if(result.data.meta.status !== 200){
            return this.$message.error('登录失败')
          }else{
            this.$message.success('登录成功')
            window.sessionStorage.setItem('token',result.data.data.token) //保存session记录登录状态
            this.$router.push('/home')  //进行路由跳转
            }
        }
      })
    }
  }

}
</script>

<!-- lang="less" 使style中可以写less的样式文件，需要安装less-loader和less开发依赖，
scoped表示当前style中设置的样式仅对当前组件有效 -->
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box { //登录div的整体样式和位置设置
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px; //设置圆角
  position: absolute; //必须开启决定定位才能使本div水平居中
  left: 50%; //div距离父div左边框50%
  top: 50%; //div距离父div右边框50%
  transform: translate(-50%,-50%); //上面两步使div左上角点位于父div中心点，transform位移使本div左上角点左移本div的50%,上移本div的50%，则本div水平居中
}
.avatar_box { //图像设置
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: white;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
