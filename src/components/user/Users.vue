<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片形式内容区 -->
    <el-card class="box-card">
      <!-- 查询输入框，查询按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入用户名" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" round @click="adddialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表展示区 -->
      <el-table :data="userlist" border stripe highlight-current-row>
        <!-- data绑定数据源为一个数组 ，每列可以绑定对象的一个属性-->
        <el-table-column label="行号" type="index" width="60px"></el-table-column> <!-- 行号/索引号 -->
        <el-table-column label="姓名" prop="username"></el-table-column> <!-- label指定列名，prop指定列所对应的每个对象的属性 -->
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 作用域插槽，可以在插槽中插入一个其它组件，页面渲染时会用该组件替换插槽，slot-scope是作用域插槽属性， scope.row可以获取当前行数据对象-->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button @click="removeUserById(scope.row.id,scope.row.username)" type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!-- 分配角色按钮,是一个带文字提示的按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>


          </template>
        </el-table-column>

      </el-table>

      <!-- 分页导航区 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="adddialogVisible"
      @closed="addDialogClosed"
      width="50%">
      <!-- 对话框表单内容区 -->
      <el-form :model="addForm" :rules="addAndeditFormrules"  ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editdialogVisible"
      @close="editDialogClosed"
      width="50%">

      <el-form :model="editForm" :rules="addAndeditFormrules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      /*定义一个邮箱验证函数，可以作为验证规则validator值传入*/
      var checkEmail = (rule,value,callback)=>{
        //邮箱正则表达式
        const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
        if(regEmail.test(value)){
          return callback()
        }
        return callback(new Error('邮箱格式不合法'))
      }
      /*定义一个手机号码验证函数，可以作为验证规则validator值传入*/
      var checkMobile = (rule,value,callback)=>{
        //手机号正则表达式
        const regMobile = /^1[3456789]\d{9}$/
        if(regMobile.test(value)){
          return callback()
        }
        return callback(new Error('手机号格式不合法'))
      }

      return {
        /* 定义查询参数*/
        queryInfo: {
          query: '', //查询关键字
          pagenum: 1, //查询页码，默认第一页
          pagesize: 3 //每页显示数据条数
        },
        userlist: [], //查询到的用户数据列表
        total: 0 ,//数据总条数
        adddialogVisible: false ,//控制添加用户对话框的显示与隐藏
        addForm: {  //添加用户表单绑定数据对象
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        addAndeditFormrules: {  //添加用户和编辑用户信息时，表单项的数据验证规则对象
          username:[
            {required: true, message: '请输入用户名',trigger: 'blur'},
            {min: 3,max: 10, message: '用户名长度在3到10位之间',trigger: 'blur'}
            ],
          password: [
            {required: true, message: '请输入密码',trigger: 'blur'},
            {min: 6,max: 15, message: '密码长度在6到15位之间',trigger: 'blur'}
            ],
          email: [
            {required: true, message: '请输入邮箱',trigger: 'blur'},
            {min: 6,max: 15, message: '邮箱长度在6到30位之间',trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
            ],
          mobile: [
            {required: true, message: '请输入手机',trigger: 'blur'},
            {min: 11,max: 11, message: '手机号码长度为11位',trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}
            ]
        },
        editdialogVisible: false  ,//控制修改用户对话框的显示与隐藏
        editForm: {}  //编辑用户信息表单时，需要提前向服务器查询用户信息，再把用户信息赋值给editForm进行展示
      }
    },
    created() { //在组件的create生命周期中向服务器请求数据
      this.getUserList()
    },
    methods: {
      async getUserList() { //获取用户列表方法
        const {
          data: result
        } = await this.$http.get('/users', {
          params: this.queryInfo
        })
        console.log('获取用户列表数据结果', result)
        if (result.meta.status !== 200) {
          return this.$message.error('获取用户列表失败')
        } else {
          this.userlist = result.data.users
          this.total = result.data.total
        }

      },
      handleSizeChange(newSize) { //处理页面大小发生改变事件
        //console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      handleCurrentChange(newPagenum) { //处理当前页码值发生改变事件
        //console.log(newPagenum)
        this.queryInfo.pagenum = newPagenum
        this.getUserList()
      },
      async userStateChanged(userInfo) { //用户状态栏开关改变事件
        console.log(userInfo)
        const {
          data: result
        } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        if (result.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error('更新用户状态失败')
        }else {
          return this.$message.success('更新用户状态成功')
        }
      },
      addDialogClosed(){ //处理添加用户对话框关闭事件,重置对话框，恢复表单初始状态，该表单初始为空
        this.$refs.addFormRef.resetFields()
      },
      addUser(){ //在添加用户表单点击确定按钮时，对整个表单验证再发送请求进行添加用户操作
        this.$refs.addFormRef.validate(async valid=>{
          if(!valid) return
          const  {data: result} = await this.$http.post('/users',this.addForm)
          if(result.meta.status !== 200){
             this.$message.error('添加用户失败')
          }
          else{
            this.$message.success('添加用户成功')
            this.adddialogVisible = false
            this.getUserList()
          }

        })
      },
      async showEditDialog(id){  //用户点击编辑按钮时，应该向服务器请求用户数据显示在对话框表单中
        //console.log(id)
        const {data: result} = await this.$http.get('/users/'+id)
        console.log(result)
        if(result.meta.status!==200){
          return this.$message.error('查询用户信息失败')
        }
        this.editForm = result.data
        this.editdialogVisible = true
      },
      editDialogClosed(){  //在编辑用户对话框关闭时，应该丢弃上次修改数据，重置表单，恢复表单初始状态
        this.$refs.editFormRef.resetFields()
      },
      /*
        修改业务一般步骤：
        1、验证表单项数据合法性，不合法则提示用户数据不合法
        2、发送数据到服务端，更新数据
        3、根据服务器响应结果，如果失败，则提示用户更新失败
        4、关闭当前对话框
        5、重新向服务器请求列表数据，以重新渲染页面
        6、提示用户更新信息成功
      */
      editUserInfo(){ //修改用户信息,先表单数据域规则校验，通过则提交
        this.$refs.editFormRef.validate(async valid=>{
          if(!valid) return this.$message.error('数据格式不合格，请重新输入')
          const {data: result} = await this.$http.put('/users/'+ this.editForm.id,{
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          console.log(result)
          if(result.meta.status!==200) {
            return this.$message.error('更新用户信息失败')
          }


          this.editdialogVisible = false
          this.getUserList()
          this.$message.success('更新用户信息成功')

        })
      },

      async removeUserById(id,username){  //根据用户id删除用户
        console.log(id)
        const result = await this.$confirm(`此操作将永久删除用户 ${username}, 是否继续?`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).catch(err=> err) //点击取消时触发错误, catch捕获到错误后，将错误对象返回给异步结果 result
        console.log(result)
        if(result!=='confirm'){
          this.$message.info('已经取消删除')
        }else{
          const {data: deleteresult} = await this.$http.delete(`/users/${id}`)
          console.log(deleteresult)
          if(deleteresult.meta.status!==200){
            return this.$message.error('删除用户出现错误')
          }
          this.$message.success('删除用户成功')
          this.getUserList()
        }
      }




    }
  }
</script>

<style>
</style>
