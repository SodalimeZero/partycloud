<template>
  <div class="app-container">
    <a-card class="shadow">
      <sys-tip></sys-tip>
      <a-row class="mt-10">
        <a-button icon="redo" class="ml-5" @click="refresh">刷新</a-button>
      </a-row>
      <s-table
        class="mt-10"
        ref="table"
        rowKey="id"
        :columns="table.columns"
        :data="table.loadData"
        :alert="false"
        :scroll="{x:1200}"
        :showPagination="false"
      >
        <template slot="operate" slot-scope="text, record">
          <a @click="edit(record)">编辑</a>
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
        <a-form-model-item label="配置数值" prop="name">
          <a-input-number
            v-model="editForm.form.value"
            placeholder="请输入配置值"
            style="width: 100%;"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import SysTip from '@/views/sys/components/SysTip'
import { STable } from '@/components'
import cloneDeep from 'lodash.clonedeep'
import { parseFormData } from '@/utils'
import { editSysConfig, listSysConfig } from '@/api/sys'

export default {
  name: 'Config',
  components: { SysTip, STable },
  data () {
    return {
      table: {
        columns: [{
          width: 230,
          dataIndex: 'name',
          title: '配置名称',
          ellipsis: true
        }, {
          width: 200,
          dataIndex: 'code',
          title: '系统编码',
          ellipsis: true
        }, {
          width: 300,
          dataIndex: 'remark',
          title: '备注',
          ellipsis: true
        }, {
          width: 80,
          align: 'center',
          dataIndex: 'value',
          title: '配置具体值'
        }, {
          width: 150,
          dataIndex: 'updatedTime',
          title: '修改时间'
        }, {
          width: 80,
          title: '操作',
          scopedSlots: { customRender: 'operate' },
          fixed: 'right'
        }],
        data: [],
        loadTableData: false,
        loadData: () => {
          return listSysConfig().then(res => {
            return res
          })
        }
      },
      editForm: {
        show: false,
        loading: false,
        form: {
          id: 0,
          value: 0
        },
        rules: {
          value: { required: true, trigger: 'blur', message: '请输入配置值' }
        }
      }
    }
  },
  methods: {
    refresh () {
      this.$refs.table.refresh()
    },
    // 显示信息编辑form
    showEditContext () {
      this.editForm.show = true
      this.editForm.loading = false
      // 初始化ID，方式编辑后残留数据值
      this.editForm.form.id = 0
    },
    // 处理表单提交事件
    handleSubmit () {
      this.editForm.loading = true
      const requestData = cloneDeep(this.editForm.form)
      editSysConfig(requestData).then(() => {
        this.$refs.table.refresh()
        this.editForm.show = false
      }).finally(() => {
        this.editForm.loading = false
      })
    },
    edit (row) {
      this.editForm.title = '编辑'
      this.showEditContext()
      parseFormData(this.editForm.form, row)
    }
  }
}
</script>

<style scoped>

</style>
