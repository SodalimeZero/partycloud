<template>
  <div>
    <a-form-model
      ref="editForm"
      :model="editForm.form"
      :rules="editForm.rules"
      :label-width="100"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }">
      <template>
        <slot></slot>
        <a-form-model-item label="菜单类型" prop="type">
          <a-radio-group v-if="isAdd && !isRoot" v-model="editForm.form.type">
            <a-radio :value="1">
              <a-icon type="profile"/>
              <span class="ml-5">页面菜单</span>
            </a-radio>
            <a-radio :value="2">
              <a-icon type="edit"/>
              <span class="ml-5">操作按钮</span>
            </a-radio>
          </a-radio-group>
          <template v-else>
            <div v-if="editForm.form.type===1">
              <a-icon type="profile"/>
              <span class="ml-5">页面菜单</span>
            </div>
            <div v-if="editForm.form.type===2">
              <a-icon type="edit"/>
              <span class="ml-5">操作按钮</span>
            </div>
          </template>
        </a-form-model-item>
        <a-form-model-item :label="editForm.form.type===1?'路由名称':'唯一标志'" prop="name">
          <a-input
            v-model="editForm.form.name"
            :disabled="editForm.disabled"
            :placeholder="editForm.form.type===1? '请输入名称（页面菜单对应路由名称）':'请输入操作按钮的唯一标志'"
          />
        </a-form-model-item>
        <a-form-model-item label="显示文字" prop="title">
          <a-input v-model="editForm.form.title" :disabled="editForm.disabled" />
        </a-form-model-item>
        <a-form-model-item v-if="editForm.form.type===1" label="显示图标" prop="icon">
          <a-input v-model="editForm.form.icon" :disabled="editForm.disabled" />
        </a-form-model-item>
        <a-form-model-item v-if="editForm.form.type===1" label="页面路径" prop="path">
          <a-input v-model="editForm.form.path" placeholder="请输入组件路径（对应页面路由）" :disabled="editForm.disabled"/>
        </a-form-model-item>
        <a-form-model-item v-if="editForm.form.type===1" label="组件路径" prop="componentPath">
          <a-input v-model="editForm.form.componentPath" :disabled="editForm.disabled" />
        </a-form-model-item>
        <a-form-model-item label="权限标识" prop="permissionStr" class="block-tool">
          <a-input v-model="editForm.form.permissionStr" placeholder="请输入权限标识" :disabled="editForm.disabled" />
        </a-form-model-item>
        <a-form-model-item label="重定向地址" prop="redirectPath">
          <a-input v-model="editForm.form.redirectPath" placeholder="请输入重定向地址" :disabled="editForm.disabled" />
        </a-form-model-item>
        <a-form-model-item label="激活显示菜单" prop="activeMenu">
          <a-input v-model="editForm.form.activeMenu" placeholder="请输入激活显示菜单，一般菜单不显示时使用" :disabled="editForm.disabled" />
        </a-form-model-item>
        <a-form-model-item label="显示排序" prop="orderNumber">
          <a-input-number
            v-model="editForm.form.orderNumber"
            :max="1000"
            :min="0"
            :disabled="editForm.disabled"
            class="mr-5"
          />
          <span>值越小越靠前，支持小数</span>
        </a-form-model-item>
        <a-form-model-item label="是否显示" prop="isShow">
          <a-switch
            :checked="editForm.form.isShow === 1"
            @change="changeIsShow"
            size="large"
            checked-children="显示"
            un-checked-children="隐藏"
            :disabled="editForm.disabled"
          />
        </a-form-model-item>
        <a-form-model-item label="是否启用" prop="status">
          <a-switch
            :checked="editForm.form.status === 1"
            @change="changeStatus"
            size="large"
            checked-children="启用"
            un-checked-children="禁用"
            :disabled="editForm.disabled"
          />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }" v-if="!isAdd">
          <a-button
            :disabled="editForm.disabled"
            type="primary"
            icon="ios-create-outline"
            @click="saveEdit"
          >修改并保存
          </a-button>
          <a-button class="ml-5" :disabled="editForm.disabled" @click="resetEditForm">重置</a-button>
        </a-form-model-item>
      </template>
    </a-form-model>
  </div>
</template>
<script>
import cloneDeep from 'lodash.clonedeep'
import { editMenu } from '@/api/menu'
export default {
  name: 'MenusForm',
  props: {
    chosenNode: {
      type: Object,
      default: null
    },
    editFormData: {
      type: Object,
      default: null
    },
    isRoot: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editForm: {
        disabled: false,
        show: false,
        loading: false,
        title: '新增',
        form: {
          id: 0,
          type: 1,
          parentId: 0,
          icon: '',
          title: '',
          pName: '',
          name: '',
          componentPath: '',
          path: '',
          permissionStr: '',
          redirectPath: '',
          activeMenu: '',
          orderNumber: 1,
          isShow: 1,
          status: 1
        },
        rules: {
          name: { required: true, trigger: 'blur', message: '请输入指定信息' },
          title: { required: true, trigger: 'blur', message: '请输入显示文字' },
          componentPath: { required: true, trigger: 'blur', message: '请输入组件路由路径' },
          path: { required: true, trigger: 'blur', message: '请输入页面路径' },
          orderNumber: { required: true, type: 'number', trigger: 'blur', message: '请输入显示排序值' }
        }
      }
    }
  },
  watch: {
    editFormData (n, o) {
      if (n) {
        this.editForm.form = n
      } else {
        this.$refs.editForm.resetFields()
      }
    },
    chosenNode (n, o) {
      if (n.id !== undefined && n.id !== 0 && !this.isAdd) {
        // console.log('我执行了没有2222', n.id, this.isAdd)
        this.editForm.disabled = false
      } else {
        // console.log('我执行了没有333', n.id, this.isAdd)
        if (!this.isAdd) {
          this.$refs.editForm.resetFields()
          this.editForm.disabled = true
        }
      }
    }
  },
  mounted () {
    if (!this.isAdd && (this.chosenNode.id === 0 || this.chosenNode.id === undefined)) {
      this.editForm.disabled = true
      this.$refs.editForm.resetFields()
    }
  },
  methods: {
    resetForm () {
      this.$refs.editForm.resetFields()
    },
    changeIsShow () {
      const value = this.editForm.form.isShow
      this.editForm.form.isShow = value === 1 ? 2 : 1
    },
    changeStatus () {
      const value = this.editForm.form.status
      this.editForm.form.status = value === 1 ? 2 : 1
    },
    saveEdit () {
      this.$nextTick(() => {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.editForm.loading = true
            const requestData = cloneDeep(this.editForm.form)
            if (this.isAdd && !this.isRoot) {
              requestData.parentId = this.chosenNode.id
            }
            editMenu(requestData).then(() => {
              this.editForm.loading = false
              this.editForm.show = false
              // 重新获取所有数据
              this.$emit('refreshData')
            }).catch(() => {
              this.editForm.loading = false
              this.$emit('refreshData')
            })
            return
          }
          return false
        })
      })
    },
    resetEditForm () {
      this.$refs.editForm.resetFields()
    }
  }
}
</script>
