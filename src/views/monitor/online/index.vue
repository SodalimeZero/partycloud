<template>
  <div>
    <a-card :bordered="false">
      <OnlineSearchForm :user-list="data.userList" @search="search"></OnlineSearchForm>
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
        <template slot="sessionId" slot-scope="text">
          <ellipsis :length="26" tooltip>{{ text }}</ellipsis>
        </template>

        <template slot="action" slot-scope="text,record">
          <a-button type="danger" icon="export" size="small" @click="forceQuit(record.id)">强退</a-button>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { Ellipsis, STable } from '@/components'
import { forceQuit, listOnlineUser } from '@/api/monitor'
import { listAllUser } from '@/api/user'
import OnlineSearchForm from '@/views/monitor/online/components/OnlineSearchForm'
import TableMixins from '@/mixins/TableMixins'

export default {
  name: 'Online',
  mixins: [TableMixins],
  components: {
    OnlineSearchForm,
    STable,
    Ellipsis
  },
  data () {
    return {
      data: {
        userList: []
      },
      table: {
        hasData: false,
        columns: [{
          width: 140,
          align: 'center',
          dataIndex: 'sessionId',
          title: '会话编号',
          scopedSlots: { customRender: 'sessionId' }
        }, {
          width: 80,
          align: 'center',
          dataIndex: 'name',
          title: '操作用户'
        }, {
          width: 80,
          align: 'center',
          dataIndex: 'account',
          title: '登录账号'
        }, {
          width: 100,
          align: 'center',
          dataIndex: 'ipAddress',
          title: '访问IP'
        }, {
          width: 100,
          align: 'center',
          dataIndex: 'loginLocation',
          title: '登录地点'
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
          dataIndex: 'createdTime',
          title: '登录时间'
        }, {
          width: 100,
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
          return listOnlineUser(requestParameters).then(res => {
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
    getUserList () {
      listAllUser().then(response => {
        this.data.userList = response.data
      })
    },
    forceQuit (id) {
      const _this = this
      const modal = this.$confirm({
        title: '系统提示',
        content: '是否确认强退该用户？',
        loading: true,
        onOk: () => {
          forceQuit(id).then(() => {
            // 删除成功，重新加载树状结构数据
            _this.$refs.table.refresh()
            modal.destroy()
            _this.$message.success({
              content: '强退成功'
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
