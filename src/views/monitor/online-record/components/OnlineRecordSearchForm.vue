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
      label="操作顾问"
      :style="{width:searchForm.width}">
      <a-select
        show-search
        allowClear
        option-filter-prop="children"
        :filter-option="filterOption"
        v-model="searchForm.form.userId"
        placeholder="请选择操作顾问"
        @change="search"
      >
        <a-select-option :value="0">全部</a-select-option>
        <a-select-option v-for="item in userList" :value="item.id" :key="item.id">{{ item.username }}</a-select-option>
      </a-select>
    </a-form-model-item>

    <a-form-model-item
      label="操作日期"
      :style="{width:searchForm.width}">
      <a-date-picker
        @change="search"
        :defaultValue="moment(new Date(),'YYYY/MM/DD')"
        style="width: 100%"
        v-model="searchForm.form.day"
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

export default {
  name: 'OnlineRecordSearchForm',
  props: {
    userList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data () {
    return {
      searchForm: {
        width: '340px',
        form: {}
      }
    }
  },
  methods: {
    moment,
    search () {
      const data = { ...this.searchForm.form }
      if (data.day) {
        data.day = data.day.format('YYYY-MM-DD')
      } else {
        delete data.day
      }
      this.$emit('search', data)
    },
    reset () {
      this.searchForm.form = {}
      this.search()
    },
    filterOption (input, option) {
      return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>
