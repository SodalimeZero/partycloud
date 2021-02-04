<template>
  <div class="app-container">
    <a-card class="shadow">
      <sys-tip></sys-tip>
      <a-row class="mt-10">
        <a-button type="primary" icon="plus" @click="showEditContext(false)">添加子节点</a-button>
        <a-button icon="plus" @click="showEditContext(true)" class="ml-5">添加一级菜单</a-button>
        <a-button type="danger" icon="delete" class="ml-5" @click="batchDel">批量删除</a-button>
      </a-row>
      <a-row class="mt-10">
        <a-col :span="7">
          <a-alert show-icon type="info">
            <template slot="message">
              已选择
              <span class="select-title">{{ tree.chosenNode&&tree.chosenNode.title }}</span>
              <a v-if="tree.chosenNode.title" class="ml-5" @click="cancelChosenNode">取消选择</a>
            </template>
          </a-alert>
          <a-input-search class="mt-10" placeholder="请输入菜单名称搜索" @search="onSearch" />
          <div class="tree-list" :style="{maxHeight: tree.maxHeight}">
            <a-tree
              ref="tree"
              v-if="tree.data.length > 0"
              :selectedKeys.sync="tree.chosenKeys"
              :loadedKeys="tree.loadedKeys"
              checkable
              v-model="tree.checkedKeys"
              :treeData="tree.data"
              :loadData="loadTreeData"
              @select="selectTree"
              :check-strictly="!tree.strict"
              show-icon
            >
              <a-icon slot="box" type="profile" />
              <a-icon slot="list" type="align-left" />
              <a-icon slot="on" type="tool" />
            </a-tree>
            <div v-else>
              暂无数据
            </div>
          </div>
        </a-col>
        <a-col :span="11">
          <MenusForm :editFormData="editForm.form" :chosenNode="tree.chosenNode" @refreshData="refreshData"></MenusForm>
        </a-col>
      </a-row>
    </a-card>

    <a-modal
      :visible="addForm.show"
      :title="addForm.title"
      :confirmLoading="addForm.loading"
      @ok="handleSubmit"
      @cancel="addForm.show=false"
    >
      <div class="menus-modal">
        <MenusForm
          v-if="addForm.show"
          ref="MenusForm"
          :isAdd="true"
          @refreshData="refreshData"
          :isRoot="addForm.isRoot"
          :chosenNode="tree.chosenNode">
          <a-form-model-item v-if="tree.chosenNode.id!==0 && !addForm.isRoot" label="上级节点">
            <span>{{ tree.chosenNode.title }}</span>
          </a-form-model-item>
        </MenusForm>
      </div>
    </a-modal>
  </div>
</template>

<script>
import MenusForm from '../components/MenusForm'
import SysTip from '@/views/sys/components/SysTip'
import ChoosePermission from '@/components/ChoosePermission/index'
// import { judgeRole } from '@/api/role'
import cloneDeep from 'lodash.clonedeep'
// import { parseFormData } from '@/utils'
import { delMenu, listMenuTree } from '@/api/menu'
export default {
  name: 'Menus',
  components: { SysTip, ChoosePermission, MenusForm },
  data () {
    return {
      tree: { // 树状结构相关数据
        expandedKeys: [],
        isFirstLoadData: true, // 是否第一次进行懒加载请求
        callback: null, // 懒加载函数
        loading: false,
        searchKey: '',
        strict: true, // 复选框父子是否关联
        maxHeight: '500px',
        data: [],
        chosenNode: {},
        chosenKeys: [],
        checkedKeys: [],
        loadedKeys: []
      },
      // 纯页面相关数据
      selectedKeys: [],
      addForm: {
        isRoot: true,
        show: false,
        loading: false,
        title: '新增',
        justPermission: false,
        form: {
          id: 0
        }
      },
      editForm: {
        form: {
          id: 0
        }
      }
    }
  },
  watch: {
  },
  computed: {
  },
  mounted () {
    // 计算高度
    const height = document.documentElement.clientHeight
    this.tree.maxHeight = Number(height - 300) + 'px'
  },
  created () {
    this.listTree()
  },
  methods: {
    // 左侧树相关
    // 业务节点树相关
    listTree (id = 0, name = '', status = '') {
      this.tree.loading = true
      this.tree.chosenNode = { id: 0, title: '' }
      listMenuTree(id, name, status).then(response => {
        const { data } = response
        for (const v of data) {
          v['key'] = v['id']
          v['isLeaf'] = v['isParent'] !== 1
          const icon = v['isParent'] === 1 ? 'box' : 'list'
          v['slots'] = {}
          v['slots'].icon = (v['type'] === 1 ? icon : 'on')
        }
        this.tree.data = data
        this.tree.loading = false
      })
    },
    // onExpand (expandedKeys) {
    //   console.log('onExpand', expandedKeys)
    //   this.tree.expandedKeys = expandedKeys
    // },
    onSearch (value) { // 搜索树节点
      console.log(value)
      this.listTree(0, value, '')
    },
    cancelChosenNode () { // 取消选择树节点
      this.initaddForm()
    },
    initaddForm () {
      this.tree.chosenNode = {}
      this.tree.chosenKeys = []
      this.addForm.disabled = true
      this.addForm.form.id = 0
    },
    loadTreeData (item) {
      return new Promise(resolve => {
        if (item.dataRef.children) {
          resolve()
          return
        }
        this.loadData(item, resolve)
      })
    },
    loadData (item, resolve) {
      listMenuTree(item.dataRef.id, '').then(response => {
        const { data } = response
        for (const v of data) {
          v['key'] = v['id']
          v['isLeaf'] = v['isParent'] !== 1
          const icon = v['isParent'] === 1 ? 'box' : 'list'
          v['slots'] = {}
          v['slots'].icon = (v['type'] === 1 ? icon : 'on')
        }
        item.dataRef.children = data
        this.tree.data = [...this.tree.data]
        resolve()
      })
    },
    selectTree (selectedKeys, e) {
      // console.log('selectTree', e)
      if (e.selected) {
        const nodeData = e.node.dataRef
        if (nodeData.id !== this.addForm.form.id) {
          this.tree.chosenNode = nodeData
          this.editForm.form = cloneDeep(nodeData)
          console.log(nodeData)
          // parseFormData(this.editForm.form, nodeData)
          return
        }
        this.initaddForm()
        return
      }
      this.tree.selectedKeys = selectedKeys
      // 编辑界面点击重置按钮
      this.editForm.form = cloneDeep(this.tree.chosenNode)
      // parseFormData(this.editForm.form, this.tree.chosenNode)
    },
    // 显示信息编辑form
    showEditContext (isRoot) {
      if (!isRoot && !this.tree.chosenNode.id) {
        this.$message.error('请先选择父级节点')
        return
      }
      this.addForm.isRoot = isRoot
      this.addForm.show = true
      this.addForm.loading = false
      // 初始化ID，方式编辑后残留数据值
      this.addForm.form.id = 0
    },
    // 处理表单提交事件（处理新增数据）
    refreshData () { // 刷新数据操作
      this.listTree()
      this.initaddForm()
      this.addForm.show = false
    },
    handleSubmit () {
      this.$refs.MenusForm.saveEdit()
    },
    // 批量删除数据
    batchDel () {
      if (this.tree.checkedKeys.length === 0) {
        this.$message.error({ content: '请选择需要删除的数据' })
        return
      }
      this.del(this.tree.checkedKeys.join(','))
    },
    // 删除数据
    del (ids) {
      const _this = this
      const modal = this.$confirm({
        title: '系统提示',
        content: '是否确认删除？',
        loading: true,
        onOk: () => {
          delMenu(ids).then(() => {
            // 删除成功，重新加载树状结构数据
            _this.listTree(false)
            modal.destroy()
            _this.$message.success({
              content: '删除成功'
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.tree-list {
  overflow: auto;
  margin-top: 5px;
}
.select-title {
  font-size: 12px;
  font-weight: 600;
  color: #40a9ff;
}
.menus-modal {
  .previous-menu {
    .title {}
    .content {}
  }
}
</style>
