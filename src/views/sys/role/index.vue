<template>
  <div class="app-container">
    <a-card class="shadow">
      <sys-tip></sys-tip>
      <a-row class="mt-10">
        <a-button type="primary" icon="plus" @click="showEditContext(true)">添加角色</a-button>
        <a-button type="danger" icon="delete" class="ml-5" @click="batchDel">批量删除</a-button>
        <a-button icon="redo" class="ml-5" @click="refresh">刷新</a-button>
      </a-row>
      <a-alert show-icon type="info" class="mt-10">
        <template slot="message">
          已选择
          <span class="select-count">{{ table.selectedRowKeys.length }}</span> 项
          <a class="select-clear" @click="clearSelected">清空</a>
        </template>
      </a-alert>

      <s-table
        class="mt-10"
        ref="table"
        rowKey="id"
        :columns="table.columns"
        :data="table.loadData"
        :alert="false"
        :scroll="{x:800}"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <template slot="status" slot-scope="text, record">
          <a-badge
            :status="table.filter.status.type[record['status'] - 1]"
            :text="table.filter.status.name[record['status'] - 1]"
          />
        </template>

        <template slot="assign" slot-scope="text,record">
          <a-icon type="team" style="font-size: 18px" class="pointer" @click="assignUser(record)" />
        </template>

        <template slot="operate" slot-scope="text, record">
          <a @click="showPermission(record)">权限控制</a>
          <a-divider type="vertical" />
          <a @click="edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="del(record.id)">删除</a>
        </template>
      </s-table>
    </a-card>

    <a-modal
      :visible="editForm.show"
      :title="editForm.title"
      :confirmLoading="editForm.loading"
      @ok="handleSubmit"
      @cancel="editForm.show=false"
    >
      <a-form-model
        ref="editForm"
        :model="editForm.form"
        :rules="editForm.rules"
        :label-width="100"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }">
        <template v-if="!editForm.justPermission">
          <a-form-model-item label="角色名称" prop="name">
            <a-input v-model="editForm.form.name" placeholder="请输入角色名称" />
          </a-form-model-item>
          <a-form-model-item label="备注信息" prop="remark">
            <a-input v-model="editForm.form.remark" type="textarea" placeholder="请输入备注" />
          </a-form-model-item>
          <a-form-model-item label="是否启用" prop="status">
            <a-switch v-model="editForm.form.status" size="large" checked-children="启用" un-checked-children="禁用" />
          </a-form-model-item>
        </template>
        <choose-permission ref="choosePermission" :menuList="editForm.form.menuIds" :isAdd="!editForm.justPermission"/>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import SysTip from '@/views/sys/components/SysTip'
import ChoosePermission from '@/components/ChoosePermission/index'
import { Ellipsis, STable } from '@/components'
import { delRole, editRole, judgeRole, listRole } from '@/api/sys'
import cloneDeep from 'lodash.clonedeep'
import { parseFormData } from '@/utils'
import TableMixins from '@/mixins/TableMixins'
import TableSelectionMixins from '@/mixins/TableSelectionMixins'

export default {
  name: 'Role',
  components: { SysTip, ChoosePermission, STable, Ellipsis },
  mixins: [TableMixins, TableSelectionMixins],
  data () {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入角色名称'))
        return
      }
      judgeRole(this.editForm.form.id, value).then((response) => {
        const { data } = response
        if (data === 'fail') {
          callback(new Error('角色名称已存在'))
        }
        callback()
      })
    }
    return {
      table: {
        columns: [{
          width: 200,
          dataIndex: 'name',
          title: '名称'
        }, {
          width: 200,
          dataIndex: 'remark',
          title: '备注',
          ellipsis: true
        }, {
          width: 120,
          title: '状态',
          scopedSlots: { customRender: 'status' }
        }, {
          width: 200,
          dataIndex: 'createdTime',
          title: '创建时间'
        }, {
          width: 200,
          title: '操作',
          scopedSlots: { customRender: 'operate' },
          fixed: 'right'
        }],
        data: [],
        loadTableData: false,
        loadData: parameter => {
          const pageData = {
            pageSize: parameter.pageSize,
            pageNumber: parameter.pageNo
          }
          return listRole(pageData).then(res => {
            res['pageNo'] = parameter['pageNo']
            return res
          })
        },
        filter: {
            status: {
              type: ['success', 'error'],
              name: ['正常', '禁用']
            }
        }
      },
      editForm: {
        show: false,
        loading: false,
        title: '新增',
        justPermission: false,
        form: {
          id: 0,
          name: '',
          remark: '',
          status: true,
          menuIds: []
        },
        rules: {
          name: { required: true, trigger: 'blur', validator: validateName }
        }
      },
      assign: {
        show: false,
        roleId: 0,
        title: ''
      }
    }
  },
  methods: {
    // 显示信息编辑form
    showEditContext (isAdd, justPermission = false) {
      this.editForm.show = true
      this.editForm.loading = false
      this.editForm.justPermission = justPermission
      // 初始化ID，方式编辑后残留数据值
      this.editForm.form.id = 0
      if (isAdd && this.$refs.editForm) {
          this.$refs.editForm.resetFields()
          this.editForm.form.name = ''
          this.editForm.form.remark = ''
          this.editForm.form.status = true
          this.editForm.form.menuIds = []
      }
    },
    // 处理表单提交事件
    handleSubmit () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.editForm.loading = true
          const requestData = cloneDeep(this.editForm.form)
          requestData['status'] = requestData['status'] ? 1 : 2
          requestData['menuIds'] = this.$refs.choosePermission.getChosenNodes().join(',')
          editRole(requestData).then(() => {
            this.$refs.table.refresh()
            this.editForm.show = false
          }).finally(() => {
            this.editForm.loading = false
          })
        }
      })
    },
    edit (row) {
      this.editForm.title = '编辑'
      this.showEditContext(false)
      parseFormData(this.editForm.form, row)
      this.editForm.form.status = this.editForm.form.status === 1
      this.editForm.form.menuIds = row.menuList.map(node => node.menuId)
    },
    del (ids) {
      const _this = this
      const modal = this.$confirm({
        title: '系统提示',
        content: '是否确认删除？',
        loading: true,
        onOk () {
          delRole(ids).then(() => {
            _this.$refs.table.refresh()
            modal.destroy()
            _this.$message.success({
              content: '删除成功'
            })
          })
        }
      })
    },
    batchDel () {
      if (this.table.selectedRowKeys === 0) {
        this.$message.error({ content: '请选择需要删除的数据' })
        return
      }
      this.del(this.table.selectedRowKeys.join(','))
    },
    showPermission (record) {
      this.editForm.show = true
      this.editForm.justPermission = true
      parseFormData(this.editForm.form, record)
      this.editForm.form.status = this.editForm.form.status === 1
      this.editForm.form.menuIds = record.menuList.map(node => node.menuId)
    },

    assignUser (record) {
      this.assign.roleId = record.id
      this.assign.title = `【${record.name}】-分配用户`
      this.assign.show = true
    }
  }
}
</script>

<style scoped>

</style>
