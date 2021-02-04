<template>
  <div>
    <a-card :bordered="false">
      <LogSearchForm :user-list="data.userList" @search="(data)=>this.search(data)"></LogSearchForm>
    </a-card>

    <a-card :bordered="false" class="mt-10">
      <s-table
        ref="table"
        rowKey="id"
        :columns="table.columns"
        :data="table.loadData"
        :alert="false"
        showPagination="auto"
      >
        <template slot="source" slot-scope="text">
          <a-tag v-if="text===2" color="blue">新系统</a-tag>
          <a-tag v-else>老系统</a-tag>
        </template>

        <template slot="status" slot-scope="text">
          <a-badge v-if="text===1" status="success" text="成功"/>
          <a-badge v-else status="error" text="失败"/>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { Ellipsis, STable } from '@/components'
import LoginInfoSearchForm from '@/views/monitor/login-info/components/LoginInfoSearchForm'
import { listAllLogRecord } from '@/api/monitor'
import { listAllUser } from '@/api/user'
import LogSearchForm from '@/views/monitor/operate-log/components/LogSearchForm'

export default {
  name: 'OperateLog',
  components: {
    LogSearchForm,
    LoginInfoSearchForm,
    STable,
    Ellipsis
  },
  data () {
    return {
      searchForm: {
        form: {}
      },
      data: {
        userList: []
      },
      table: {
        hasData: false,
        columns: [{
          width: 100,
          align: 'center',
          dataIndex: 'username',
          title: '操作用户'
        }, {
          width: 80,
          align: 'center',
          dataIndex: 'source',
          title: '所用系统',
          scopedSlots: { customRender: 'source' }
        }, {
          width: 160,
          align: 'center',
          dataIndex: 'actionName',
          title: '访问路径'
        }, {
          width: 120,
          align: 'center',
          dataIndex: 'ipAddress',
          title: '访问IP'
        }, {
          width: 120,
          align: 'center',
          dataIndex: 'location',
          title: '访问地点'
        }, {
          width: 100,
          align: 'center',
          dataIndex: 'browser',
          title: '浏览器'
        }, {
          width: 100,
          align: 'center',
          dataIndex: 'os',
          title: '操作系统'
        }, {
          width: 100,
          align: 'center',
          dataIndex: 'description',
          title: '操作描述'
        }, {
          width: 100,
          align: 'center',
          dataIndex: 'status',
          title: '操作状态',
          scopedSlots: { customRender: 'status' }
        }, {
          width: 100,
          align: 'center',
          dataIndex: 'createTime',
          title: '操作时间'
        }],
        loadData: parameter => {
          const pageData = {
            pageSize: parameter.pageSize,
            pageNumber: parameter.pageNo
          }
          const requestParameters = Object.assign({}, pageData, this.searchForm.form)
          return listAllLogRecord(requestParameters).then(res => {
            res['pageNo'] = parameter['pageNo']
            return res
          })
        }
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    search (data) {
      this.searchForm.form = data
      this.$refs.table.refresh()
    },
    getUserList () {
      listAllUser().then(response => {
        this.data.userList = response.data
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
