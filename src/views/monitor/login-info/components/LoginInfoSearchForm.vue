<template>
  <a-form-model
    ref="searchForm"
    :model="searchForm.form"
    layout="inline"
    @submit.native.prevent
    :label-col="{span:5}"
    :wrapper-col="{ span: 19 }"
  >
    <a-form-model-item
      label="操作时间"
      :style="{width:searchForm.width}">
      <a-range-picker
        style="width: 100%"
        v-model="searchForm.form.date"
        format="YYYY/MM/DD"
      />
    </a-form-model-item>

    <a-form-model-item :label-width="0" style="width: 180px" :wrapper-col="{ span: 24 }">
      <a-button type="primary" icon="search" @click="search">搜索</a-button>
      <a-button icon="redo" class="ml-5" @click="reset">重置</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import moment from 'moment'
import TableSearchFormMixins from '@/mixins/TableSearchFormMixins'

export default {
  name: 'LoginInfoSearchForm',
  mixins: [TableSearchFormMixins],
  data () {
    return {
      searchForm: {
        width: '340px'
      }
    }
  },
  methods: {
    moment,
    search () {
      const data = { ...this.searchForm.form }
      if (data.date && data.date.length > 0) {
        data.beginDate = data.date[0].format('YYYY-MM-DD')
        data.endDate = data.date[1].format('YYYY-MM-DD')
        delete data.date
      } else {
        delete data.beginDate
        delete data.endDate
      }
      this.$emit('search', data)
    }
  }
}
</script>
