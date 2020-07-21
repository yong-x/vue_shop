<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" round>添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区 -->
      <el-table :data="relosList">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item,index) in scope.row.children" :key="item.id" :class="['vcenter','dbbottom',index===0?'dbtop':'']">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2,index2) in item.children" :class="[index2!==0?'dbtop':'','vcenter']" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag closable @close="removeRightById(scope.row.id,item.id,item2.id,item3.id,scope.row)" v-for="(item3,index3) in item2.children" type="warning"
                      :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引序号列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="roleDesc">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button @click="showSetRightDialog(scope.row)" type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="30%">
      <!-- 要获取组件对象，只需在组件中定义一个ref的属性，其值为xxx，再用this.$refs.xxx便可以获取到这个组件对象，便可以操作它的所有属性和方法-->
      <!-- 树形控件，每个节点有三种状态：未选，半选（子节点未全选），全选。 -->
      <el-tree
        :data="treeData"
        ref="treeRef"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defaultKeys"
        :props="treeProps"
        @click="setRightDialogClosed">
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        relosList: [],
        setRightDialogVisible: false ,//控制分配权限对话框的显示与隐藏
        treeProps: {  //属性控件属性绑定对象，，label表示显示的文本是对象中哪个属性，children表示当前树型节点的子节点是对象中哪个属性
          label: 'authName',
          children: 'children'
        },
        treeData: [],    //分配权限时，权限树数据
        defaultKeys: [] //权限树中默认勾选的节点的id值
      }
    },
    created() {
      this.getRelosList()
    },
    methods: {
      async getRelosList() { //获取所有角色列表，并渲染页面
        const {
          data: result
        } = await this.$http.get('/roles/list')
        console.log(result)
        this.relosList = result.data

      },
      /* 删除或修改成功后，最好不要直接刷新页面，用户体验不好。应该让服务器返回数据时带上最新数据，用最新数据在页面更新绑定的数据*/
      async removeRightById(rid,id1,id2,id3,row) {
        console.log(id1,id2,id3)
        const result = await this.$confirm(`此操作将删除该权限，权限id为${id1+' '+id2+' '+id3 }, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch((err) => {
          return err
        })
        //console.log(result)
        if(result!=='confirm'){
          return this.$message.info('已经取消了删除')
        }else {
          const {data: result} = await this.$http.delete(`/roles/${rid}/${id1}/${id2}/${id3}`)


          console.log(result)
          if(result.meta.status!==200){
            return this.$message.error('删除权限失败')
          }else{
            //this.getRelosList()  //操作成功后不用重新渲染整个页面，影响用户体验。而用下面的方式替代，可以让用户即时看到操作结果
            row.children = result.data.children  //更新绑定数据，只更新局部视图即可，而不用全局刷新
            return this.$message.success('删除权限成功')
          }
        }

      },
      getThreelayerIds(treeNodeArray){ //找出treeData中所有三级权限id
        let resultArray=[]
        treeNodeArray.forEach(node=>{
          if(node.children){
            node.children.forEach(node2=>{
              if(node2.children){
                node2.children.forEach(node3=>{
                  resultArray.push(node3.id)
                })
              }
            })
          }
        })
        return resultArray
      },
      async showSetRightDialog(row){  //点击分配权限时显示角色权限树
        console.log(row.id)
        const {data: result} = await this.$http.get(`/roles/${row.id}`)

        console.log('获取该角色的权限数据为',result)

        this.treeData = result.data.children

        this.defaultKeys = this.getThreelayerIds(row.children)
        console.log('默认选择的id',this.defaultKeys)
        this.setRightDialogVisible=true
      },
      setRightDialogClosed(){  //分配权限对话框关闭事件，初始化defaultKeys
        this.defaultKeys=[]
      },
      allotRights(){  //提交用户的权限修改，分别获取半选的所有key和全选的所有key向服务器发送保存请求，这里省略向服务器提交。
        const tree = this.$refs.treeRef  //要获取组件对象，只需在组件中定义一个ref属性值为xxx，再用this.$refs.xxx便可以获取到这个组件对象，便可以操作它的所有属性和方法
        let halfChecklist = tree.getHalfCheckedKeys()
        let Checklist = tree.getCheckedKeys()
        console.log("半选的所有id：",halfChecklist) //
        console.log("全选的所有id：",Checklist)
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .dbtop {
    border-top: 1px solid #ccccc1;
  }

  .dbbottom {
    border-bottom: 1px solid #ccccc1;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
