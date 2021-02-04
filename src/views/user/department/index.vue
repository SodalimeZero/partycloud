<template>
  <div>
    <a-card class="shadow">
      <a-row>
        <a-button type="primary" icon="plus" @click="showEditContext(false)">添加子节点</a-button>
        <a-button icon="plus" @click="showEditContext(true)" class="ml-5">添加一级节点</a-button>
        <a-button icon="delete" type="danger" @click="batchDel" class="ml-5" :disabled="tree.checkedKeys.length===0">批量删除</a-button>
        <a-switch v-model="tree.strict" checked-children="级联" un-checked-children="单选" size="large" class="ml-5">
        </a-switch>
      </a-row>
      <a-row type="flex" justify="start" class="mt-5" :gutter="30">
        <a-col span="8">
          <a-alert class="mt-5" showIcon v-if="tree.chosenNode&&tree.chosenNode.title">
            <template slot="message">
              当前选择：
              <span class="select-title">{{ tree.chosenNode && tree.chosenNode.title }}</span>
              <a v-if="tree.chosenNode.title" class="ml-5" @click="cancelChosenNode">取消选择</a>
            </template>
          </a-alert>
          <a-input
            class="mt-5"
            v-model="tree.searchKey"
            placeholder="输入部门名称搜索"
            allowClear
            @change="search"
            @pressEnter="search"
          >
            <a-icon slot="prefix" type="search" />
          </a-input>
          <div class="tree-bar" :style="{maxHeight: tree.maxHeight}">
            <a-tree
              ref="tree"
              checkable
              v-model="tree.checkedKeys"
              :expandedKeys.sync="tree.expandedKeys"
              :selectedKeys.sync="tree.selectedKeys"
              :loadedKeys="tree.loadedKeys"
              :tree-data="tree.data"
              :loadData="(node)=>loadData(node,false)"
              :checkStrictly="!tree.strict"
              @select="selectTree"
            />
          </div>
          <a-spin v-if="tree.loading" size="large" />
        </a-col>
        <a-col span="12">
          <a-form-model
            class="mt-5"
            ref="editForm"
            :model="editForm.form"
            :rules="rules"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }">
            <a-form-model-item label="上级部门" prop="parentName">
              <a-popover trigger="click" placement="rightTop" title="选择上级部门" width="300" :disabled="editForm.disabled">
                <a-input
                  v-model="editForm.tree.chosenNode.title"
                  placeholder="不选择即表示该节点为一级部门"
                  readOnly
                  :disabled="editForm.disabled"
                />
                <div slot="content" style="position:relative;min-height:5vh">
                  <a-tree
                    ref="editFormTree"
                    :treeData="editForm.tree.data"
                    :loadData="(node)=>loadData(node,true)"
                    :selectedKeys.sync="editForm.tree.selectedKeys"
                    @select="selectEditFormTree"
                  />
                  <a-spin v-if="editForm.tree.loading" size="large" fix />
                </div>
              </a-popover>
            </a-form-model-item>
            <a-form-model-item label="部门名称" prop="name">
              <a-input v-model="editForm.form.name" placeholder="请输入部门名称" :disabled="editForm.disabled" />
            </a-form-model-item>
            <a-form-model-item label="排序数值" prop="orderNumber">
              <a-input-number v-model="editForm.form.orderNumber" :max="1000" :min="0" :disabled="editForm.disabled" />
              <span class="ml-5">值越小越靠前</span>
            </a-form-model-item>
            <a-form-model-item label="信息备注" prop="remark">
              <a-input
                v-model="editForm.form.remark"
                type="textarea"
                :rows="4"
                placeholder="请输入备注"
                :disabled="editForm.disabled"
              />
            </a-form-model-item>
            <a-form-model-item label="是否启用">
              <a-switch
                v-model="editForm.form.status"
                :disabled="editForm.disabled"
                checked-children="启用"
                un-checked-children="禁用"
              >
              </a-switch>
            </a-form-model-item>
            <a-form-model-item>
              <a-button
                class="ml-10"
                :disabled="editForm.disabled"
                type="primary"
                icon="edit"
                @click="saveEdit"
              >修改并保存
              </a-button>
              <a-button class="ml-5" :disabled="editForm.disabled" @click="resetEditForm">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </a-col>
      </a-row>
    </a-card>

    <a-modal
      :visible="addForm.show"
      :title="addForm.title"
      :loading="addForm.loading"
      @ok="handleAdd"
      @cancel="addForm.show=false"
    >
      <a-form-model
        ref="addForm"
        :model="addForm.form"
        :rules="rules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }">
        <a-form-model-item v-if="!addForm.isRoot&&tree.chosenNode.id!==0" label="上级部门">
          <a-input v-model="tree.chosenNode.title" readOnly />
        </a-form-model-item>
        <a-form-model-item label="部门名称" prop="name">
          <a-input v-model="addForm.form.name" placeholder="请输入部门名称" />
        </a-form-model-item>
        <a-form-model-item label="排序数值" prop="orderNumber">
          <a-input-number v-model="addForm.form.orderNumber" :max="1000" :min="0" />
          <span class="ml-5">值越小越靠前</span>
        </a-form-model-item>
        <a-form-model-item label="信息备注" prop="remark">
          <a-input v-model="addForm.form.remark" type="textarea" :rows="4" placeholder="请输入备注" />
        </a-form-model-item>
        <a-form-model-item label="是否启用">
          <a-switch
            v-model="addForm.form.status"
            size="large"
            checked-children="启用"
            un-checked-children="禁用"
            :true-value="1"
            :false-value="2">
          </a-switch>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>

import cloneDeep from 'lodash.clonedeep'
import { parseFormData } from '@/utils'
import { delDepartment, editDepartment, getDepartmentTree, judgeDepartment } from '@/api/user.js'

export default {
  name: 'Department',
  data () {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入名称'))
        return
      }
      let id = 0
      let parentId
      if (this.addForm.show) {
        parentId = this.tree.chosenNode.id
      } else {
        // 说明是编辑
        id = this.editForm.form.id
        parentId = this.editForm.tree.chosenNode.id
      }
      judgeDepartment(id, parentId, value).then(response => {
        const { data } = response
        if (data === 'fail') {
          callback(new Error('名称已存在'))
          return
        }
        callback()
      })
    }
    return {
      tree: { // 树状结构相关数据
        loading: false,
        searchKey: '',
        strict: true, // 复选框父子是否关联
        maxHeight: '500px',
        data: [],
        checkedKeys: [],
        selectedKeys: [],
        expandedKeys: [],
        loadedKeys: [],
        selectedNode: null,
        chosenNode: {
          title: '',
          id: 0
        }
      },
      rules: {
        name: { required: true, trigger: 'blur', validator: validateName },
        orderNumber: { required: true, type: 'number', trigger: 'blur', message: '请输入排序数值' }
      },
      addForm: {
        show: false,
        loading: false,
        title: '新增',
        isRoot: true,
        form: {
          id: 0,
          name: '',
          orderNumber: 1,
          remark: '',
          status: true
        }
      },
      editForm: {
        tree: {
          data: [],
          loadedKeys: [],
          selectedKeys: [],
          chosenNode: {
            title: '',
            id: 0
          }
        },
        disabled: true,
        form: {
          id: 0,
          parentId: 0,
          pName: '',
          name: '',
          orderNumber: 1,
          remark: '',
          status: true
        }
      }
    }
  },
  created () {
    this.listTree()
  },
  mounted () {
    // 计算高度
    const height = document.documentElement.clientHeight
    this.tree.maxHeight = Number(height - 300) + 'px'
  },
  methods: {
    processNodeData (data) {
      for (const v of data) {
        v['key'] = v['id']
        v['title'] = v['name']
        v['isLeaf'] = v['isParent'] === 0
      }
    },
    // 业务节点树相关
    listTree () {
      this.tree.loading = true
      this.tree.selectedNode = null
      this.tree.chosenNode = { id: 0, title: '' }
      this.tree.loadedKeys = []
      this.tree.selectedKeys = []
      this.tree.expandedKeys = []
      this.tree.checkedKeys = []
      this.editForm.tree.loadedKeys = []
      this.editForm.tree.selectedKeys = []
      getDepartmentTree(0, '').then(response => {
        const { data } = response
        this.processNodeData(data)
        this.tree.data = data
        this.editForm.tree.data = cloneDeep(data)
        this.tree.loading = false
        console.log('tree', this.$refs.tree)
      })
    },
    search () {
      this.tree.loading = true
      getDepartmentTree(0, this.tree.searchKey).then(response => {
        const { data } = response
        this.processNodeData(data)
        this.tree.data = data
        this.tree.loading = false
      })
    },
    loadData (node, isEditForm) {
      return new Promise(resolve => {
        if (node.dataRef.children) {
          resolve()
          return
        }
        getDepartmentTree(node.dataRef.id, '').then(response => {
          if (isEditForm) {
            if (this.editForm.tree.loadedKeys.findIndex(key => key === node.dataRef.id) === -1) {
              this.editForm.tree.loadedKeys.push(node.dataRef.id)
            }
          } else {
            if (this.tree.loadedKeys.findIndex(key => key === node.dataRef.id) === -1) {
              this.tree.loadedKeys.push(node.dataRef.id)
            }
          }
          const { data } = response
          this.processNodeData(data)
          node.dataRef.children = data
          if (isEditForm) {
            this.editForm.tree.data = [...this.editForm.tree.data]
          } else {
            this.tree.data = [...this.tree.data]
          }
          resolve()
        })
      })
    },
    selectTree (selectedKeys, e) {
      const { selected, node } = e
      if (selected) {
        this.tree.selectedNode = node
        this.tree.chosenNode = node.dataRef
        this.editForm.disabled = false
        parseFormData(this.editForm.form, this.tree.chosenNode)
        this.editForm.form.status = this.tree.chosenNode['isUsed'] === 1
        if (this.tree.chosenNode['parentId'] !== 0) {
          this.editForm.tree.chosenNode['title'] = this.editForm.form['pName']
          this.editForm.tree.chosenNode['id'] = this.editForm.form['parentId']
        }
        return
      }
      this.tree.selectedNode = null
      this.tree.chosenNode = { title: '', id: 0 }
      this.$refs.editForm.resetFields()
      this.editForm.disabled = true
    },
    selectEditFormTree (selectedKeys, e) {
      const { selected, node } = e
      // 判断当前节点是不是选中的节点
      if (this.tree.chosenNode.id === node.dataRef.id) {
        this.editForm.tree.selectedKeys = []
        return
      }
      if (selected) {
        parseFormData(this.editForm.tree.chosenNode, node.dataRef)
        if (this.editForm.tree.chosenNode.id === 0) {
          this.editForm.tree.chosenNode.title = ''
        }
        this.editForm.form['parentId'] = this.editForm.tree.chosenNode['id']
        return
      }
      this.editForm.tree.chosenNode = { title: '', id: 0 }
    },
    cancelChosenNode () {
      this.tree.selectedKeys = []
      this.tree.selectedNode = null
      this.tree.chosenNode = { title: '', id: '' }
      this.$refs.editForm.resetFields()
      this.editForm.disabled = true
    },
    // 内容编辑相关
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
      this.addForm.form.parentId = this.tree.chosenNode.id
      if (this.$refs.addForm) {
        this.$refs.addForm.resetFields()
      }
    },
    // 处理新增数据
    handleAdd () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.addForm.loading = true
          const requestData = cloneDeep(this.addForm.form)
          requestData['status'] = requestData['status'] ? 1 : 2
          editDepartment(requestData).then(() => {
            this.addForm.show = false
            // 重新获取所有数据选中节点下的子节点信息
            if (this.addForm.isRoot) {
             this.listTree()
            } else {
              delete this.tree.selectedNode.dataRef.children
              this.loadData(this.tree.selectedNode, false)
            }
            this.$refs.editForm.resetFields()
            this.editForm.disabled = true
          }).finally(() => {
            this.addForm.loading = false
          })
        }
      })
    },
    // 保存并修改
    saveEdit () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.editForm.loading = true
          const requestData = cloneDeep(this.editForm.form)
          requestData['status'] = requestData['status'] ? 1 : 2
          editDepartment(requestData).then(() => {
            this.editForm.loading = false
            // 刷新树状结构
            // 判断是否更新了父节点
            if (this.tree.selectedNode.dataRef['parentId'] !== this.editForm.form.parentId) {
                this.listTree()
            } else {
              this.tree.selectedNode.dataRef['title'] = this.editForm.form['name']
            }
            this.$refs.editForm.resetFields()
            this.editForm.disabled = true
          })
        }
      })
    },
    resetEditForm () {
      this.$refs.editForm.resetFields()
      this.tree.selectedNode = null
      this.tree.chosenNode = { title: '', id: 0 }
      this.$refs.editForm.resetFields()
      this.editForm.disabled = true
    },
    del (ids) {
      const _this = this
      const modal = this.$confirm({
        title: '系统提示',
        content: '是否确认删除？',
        loading: true,
        onOk () {
          delDepartment(ids).then(() => {
           _this.listTree()
            modal.destroy()
            _this.$message.success({
              content: '删除成功'
            })
          })
        }
      })
    },
    batchDel () {
      if (this.tree.checkedKeys.length === 0) {
        this.$message.error({ content: '请勾选需要删除的数据' })
        return
      }
      this.del(this.tree.checkedKeys.join(','))
    }
  }
}
</script>

<style lang="less" scoped>
.tree-bar {
  overflow: auto;
  margin-top: 5px;
}

.tree-bar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.tree-bar::-webkit-scrollbar-thumb {
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 2px #d1d1d1;
  background: #e4e4e4;
}

.custom-input-width {
  width: 200px;
}
</style>
