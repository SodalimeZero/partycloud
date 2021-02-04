<template>
  <div>
    <a-card>
      <UserSearchForm is-simple @search="search"></UserSearchForm>
    </a-card>

    <a-card class="mt-10">
      <a-row>
        <a-button type="primary" icon="plus" @click="addAssignUser" v-if="isAssigned===1">添加用户</a-button>
        <a-button
          type="danger"
          class="ml-5"
          icon="api"
          @click="batchDel"
          :disabled="table.selectedRows.length===0"
          v-if="isAssigned===1">批量取消授权
        </a-button>
        <a-button icon="redo" class="ml-5" @click="refresh">刷新</a-button>
      </a-row>

      <s-table
        class="mt-10"
        ref="table"
        rowKey="uid"
        :columns="table.columns"
        :data="table.loadData"
        :alert="false"
        showPagination="auto"
        :rowSelection="rowSelection"
      >
        <template slot="userType" slot-scope="text">
          <a-badge :status="table.filter.userType.status[text]" :text="table.filter.userType.text[text]"></a-badge>
        </template>

        <template slot="action" slot-scope="text,row">
          <a style="color: #ff0000" @click="del(row['relationId'])" v-if="isAssigned===1">取消授权</a>
          <a v-else @click="assignUser(row['uid'])">授权</a>
        </template>
      </s-table>
    </a-card>

    <a-modal
      :visible="userForm.show"
      title="选择用户"
      :width="800"
      :confirmLoading="userForm.loading"
      @ok="handleAssign"
      @cancel="userForm.show=false"
    >
      <UserList ref="userForm" :is-assigned="0" :role-id="roleId" @assign="refresh" @chosen="chosenUsers"></UserList>
    </a-modal>
  </div>
</template>

<script>
import { listUserByRole } from '@/api/user'
import UserSearchForm from '@/views/user/components/UserSearchForm'
import { Ellipsis, STable } from '@/components'
import { assignRoleToUser, cancelAssignUser } from '@/api/sys'
import TableMixins from '@/mixins/TableMixins'

export default {
  name: 'UserList',
  components: { UserSearchForm, Ellipsis, STable },
  mixins: [TableMixins],
  props: {
    roleId: {
      type: Number,
      default: 0,
      required: true
    },
    isAssigned: {
      type: Number,
      default: 0,
      required: true
    }
  },
  data () {
    return {
      host: process.env.VUE_APP_API_BASE_URL,
      searchForm: {
        form: {}
      },
      data: {},
      table: {
        columns: [{
          width: 80,
          align: 'center',
          dataIndex: 'username',
          title: '中文姓名'
        }, {
          width: 80,
          align: 'center',
          dataIndex: 'account',
          title: '登录账号'
        }, {
          width: 110,
          align: 'center',
          dataIndex: 'phoneNumber',
          title: '联系方式'
        }, {
          width: 100,
          align: 'center',
          title: '邮箱',
          dataIndex: 'email',
          ellipsis: true
        }, {
          width: 95,
          align: 'center',
          title: '用户类型',
          dataIndex: 'userType',
          scopedSlots: { customRender: 'userType' }
        }, {
          width: 80,
          align: 'center',
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }],
        loadData: parameter => {
          const pageData = {
            pageSize: parameter.pageSize,
            pageNumber: parameter.pageNo
          }
          const requestParameters = Object.assign({}, pageData, this.searchForm.form)
          requestParameters['roleId'] = this.roleId
          requestParameters['assign'] = this.isAssigned
          return listUserByRole(requestParameters).then(res => {
            res['pageNo'] = parameter['pageNo']
            return res
          })
        },
        selectedRowKeys: [],
        selectedRows: [],
        filter: {
          userType: {
            status: ['success', 'default'],
            text: ['超级管理员', '普通用户']
          }
        }
      },
      userForm: {
        show: false,
        loading: false,
        chosen: []
      }
    }
  },
  created () {
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.table.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    refresh () {
      this.$refs.table.refresh()
    },
    cancelSelected () {
      this.table.selectedRowKeys = []
      this.table.selectedRows = []
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.table.selectedRowKeys = selectedRowKeys
      this.table.selectedRows = selectedRows
      if (this.isAssigned === 0) {
        this.$emit('chosen', this.table.selectedRows)
      }
    },
    search (data) {
      this.searchForm.form = data
      this.$refs.table.refresh()
    },
    del (ids) {
      const _this = this
      const modal = this.$confirm({
        title: '系统提示',
        content: '是否确认取消授权？',
        loading: true,
        onOk () {
          cancelAssignUser(ids).then(() => {
            _this.$refs.table.refresh()
            modal.destroy()
            _this.$message.success({
              content: '取消授权成功'
            })
          })
        }
      })
    },
    batchDel () {
      if (this.table.selectedRows.length === 0) {
        this.$message.error({ content: '请选择需要取消授权的用户' })
        return
      }
      this.del(this.table.selectedRows.map(item => item['relationId']).join(','))
    },

    addAssignUser () {
      this.userForm.show = true
      this.userForm.loading = false
      this.userForm.chosen = []
      // 防止存在选项
      if (this.$refs.userForm) {
        this.$refs.userForm.cancelSelected()
      }
    },
    assignUser (users, batch = false) {
      if (batch) {
        // 批量授权
        this.userForm.loading = true
      }
      assignRoleToUser(this.roleId, users).then(() => {
        this.refresh()
        if (batch) {
          this.userForm.show = false
        }
        this.$emit('assign')
      }).finally(() => {
        this.userForm.loading = false
      })
    },
    chosenUsers (rows) {
      this.userForm.chosen = rows
    },
    handleAssign () {
      if (this.userForm.chosen.length === 0) {
        this.$message.error({ content: '请选择需要授权的用户' })
        return
      }
      this.assignUser(this.userForm.chosen.map(item => item['uid']).join(','), true)
    }
  }
}
</script>
