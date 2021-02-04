<template>
  <div>
    <a-card :bordered="false">
      <OnlineRecordSearchForm :user-list="data.userList" @search="(data)=>this.search(data)"></OnlineRecordSearchForm>
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
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { Ellipsis, STable } from '@/components'
import { listAllOnlineRecord } from '@/api/monitor'
import { listAllUser } from '@/api/user'
import OnlineRecordSearchForm from '@/views/monitor/online-record/components/OnlineRecordSearchForm'
import moment from 'moment'

export default {
  name: 'Online',
  components: {
    OnlineRecordSearchForm,
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
          width: 160,
          align: 'center',
          dataIndex: 'account',
          title: '登录账号'
        }, {
          width: 120,
          align: 'center',
          dataIndex: 'phoneNumber',
          title: '联系方式'
        }, {
          width: 120,
          align: 'center',
          dataIndex: 'onlineTime',
          title: '在线总时长（分钟）'
        }, {
          width: 100,
          align: 'center',
          dataIndex: 'totalMinutes',
          title: '当日在线时长（分钟）'
        }, {
          width: 100,
          align: 'center',
          dataIndex: 'lastTime',
          title: '当日最后一次在线时间'
        }],
        loadData: parameter => {
          const pageData = {
            pageSize: parameter.pageSize,
            pageNumber: parameter.pageNo,
            day: this.moment(new Date()).format('YYYY-MM-DD')
          }
          const requestParameters = Object.assign({}, pageData, this.searchForm.form)
          return listAllOnlineRecord(requestParameters).then(res => {
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
    moment,
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
