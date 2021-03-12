<template>
  <div>
    <!--搜索栏-->
    <a-card :bordered="false">
      <LoginInfoSearchForm @search="(data)=>this.search(data)"></LoginInfoSearchForm>
    </a-card>
    <!--搜索栏-->

    <a-card :bordered="false" class="mt-10">
      <s-table
        ref="table"
        rowKey="id"
        :columns="table.columns"
        :data="table.loadData"
        :alert="false"
        showPagination="auto"
      >
        <template slot="status" slot-scope="text">
          <a-tag :color="table.filter.status.color[text-1]">
            {{ table.filter.status.text[text-1] }}
          </a-tag>
        </template>

        <template slot="msg" slot-scope="text">
          <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { Ellipsis, STable } from '@/components'
import LoginInfoSearchForm from '@/views/monitor/login-info/components/LoginInfoSearchForm'
import { listAllLoginInfo } from '@/api/monitor'

export default {
  name: 'LoginInfo',
  components: {
    LoginInfoSearchForm,
    STable,
    Ellipsis
  },
  data () {
    return {
      searchForm: {
        form: {}
      },
      table: {
        hasData: false,
        columns: [{
          width: 100,
          align: 'center',
          dataIndex: 'account',
          title: '登录账号'
        }, {
          width: 120,
          align: 'center',
          dataIndex: 'ipAddress',
          title: '登录IP'
        }, {
          width: 120,
          align: 'center',
          dataIndex: 'loginLocation',
          title: '登录地点'
        }, {
          width: 100,
          align: 'center',
          dataIndex: 'browser',
          title: '浏览器'
        }, {
          width: 80,
          align: 'center',
          dataIndex: 'os',
          title: '操作系统'
        }, {
          width: 60,
          align: 'center',
          dataIndex: 'status',
          title: '登录状态',
          scopedSlots: { customRender: 'status' }
        }, {
          width: 180,
          align: 'center',
          dataIndex: 'msg',
          title: '操作信息',
          scopedSlots: { customRender: 'msg' }
        }, {
          width: 100,
          align: 'center',
          dataIndex: 'createdTime',
          title: '登录时间'
        }],
        loadData: parameter => {
          const pageData = {
            pageSize: parameter.pageSize,
            pageNumber: parameter.pageNo
          }
          const requestParameters = Object.assign({}, pageData, this.searchForm.form)
          return listAllLoginInfo(requestParameters).then(res => {
            res['pageNo'] = parameter['pageNo']
            return res
          })
        },
        filter: {
          status: {
            color: ['blue', 'red'],
            text: ['成功', '失败']
          }
        }
      }
    }
  },
  created () {
  },
  methods: {
    search (data) {
      this.searchForm.form = data
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
