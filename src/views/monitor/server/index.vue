<template>
  <div>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-card title="CPU" hoverable :loading="loading">
          <a-row class="data-container-height" :gutter="24">
            <a-col :span="18">
              <div>属性</div>
            </a-col>
            <a-col :span="6">
              <div>值</div>
            </a-col>
            <a-divider></a-divider>
          </a-row>
          <a-row class="data-container-height" v-for="(item,index) in cpu.infoList" :key="index" :gutter="24">
            <a-col :span="18">
              <div>{{ item.name }}</div>
            </a-col>
            <a-col :span="6">
              <div>{{ cpu.values[item.key] }}{{ index > 0 ? '%' : '' }}</div>
            </a-col>
            <a-divider></a-divider>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="内存" hoverable :loading="loading">
          <a-row class="data-container-height" :gutter="24">
            <a-col :span="8">
              <div>属性</div>
            </a-col>
            <a-col :span="8">
              <div>内存</div>
            </a-col>
            <a-col :span="8">
              <div>JVM</div>
            </a-col>
            <a-divider></a-divider>
          </a-row>
          <a-row class="data-container-height" v-for="(item,index) in mem.infoList" :key="index" :gutter="24">
            <a-col :span="8">
              <div>{{ item.name }}</div>
            </a-col>
            <a-col :span="8">
              <div>{{ mem.values[item.key] }}{{ index > 2 ? '%' : 'G' }}</div>
            </a-col>
            <a-col :span="8">
              <div>{{ jvm.values[item.key] }}{{ index > 2 ? '%' : 'M' }}</div>
            </a-col>
            <a-divider></a-divider>
          </a-row>
        </a-card>
      </a-col>
    </a-row>

    <a-card title="服务器信息" hoverable class="mt-10" :loading="loading">
      <a-row class="data-container-height" :gutter="24">
        <a-col :span="4">
          <div>服务器名称</div>
        </a-col>
        <a-col :span="8">
          <div>{{ server.values['computerName'] }}</div>
        </a-col>
        <a-col :span="4">
          <div>操作系统</div>
        </a-col>
        <a-col :span="8">
          <div>{{ server.values['osName'] }}</div>
        </a-col>
        <a-divider></a-divider>
      </a-row>
      <a-row class="data-container-height" :gutter="24">
        <a-col :span="4">
          <div>服务器IP</div>
        </a-col>
        <a-col :span="8">
          <div>{{ server.values['computerIp'] }}</div>
        </a-col>
        <a-col :span="4">
          <div>系统架构</div>
        </a-col>
        <a-col :span="8">
          <div>{{ server.values['osArch'] }}</div>
        </a-col>
        <a-divider></a-divider>
      </a-row>
    </a-card>

    <a-card title="Java虚拟机信息" hoverable class="mt-10" :loading="loading">
      <a-row class="data-container-height" :gutter="24">
        <a-col :span="4">
          <div>Java名称</div>
        </a-col>
        <a-col :span="8">
          <div>{{ jvm.values['name'] }}</div>
        </a-col>
        <a-col :span="4">
          <div>Java版本</div>
        </a-col>
        <a-col :span="8">
          <div>{{ jvm.values['version'] }}</div>
        </a-col>
        <a-divider></a-divider>
      </a-row>
      <a-row class="data-container-height" :gutter="24">
        <a-col :span="4">
          <div>启动时间</div>
        </a-col>
        <a-col :span="8">
          <div>{{ jvm.values['startTime'] }}</div>
        </a-col>
        <a-col :span="4">
          <div>运行时长</div>
        </a-col>
        <a-col :span="8">
          <div>{{ jvm.values['runTime'] }}</div>
        </a-col>
        <a-divider></a-divider>
      </a-row>
      <a-row class="data-container-height" :gutter="24">
        <a-col :span="4">
          <div>安装路径</div>
        </a-col>
        <a-col :span="8">
          <div>{{ jvm.values['home'] }}</div>
        </a-col>
        <a-divider></a-divider>
      </a-row>
    </a-card>

    <a-card title="磁盘状态" hoverable class="mt-10 sysFile-table" :loading="loading">
      <a-table rowKey="id" :columns="sysFile.columns" :data-source="sysFile.data" :pagination="false"></a-table>
    </a-card>
  </div>
</template>

<script>
import { getServerInfo } from '@/api/monitor'

export default {
  name: 'ServerInfo',
  data () {
    return {
      loading: true,
      cpu: {
        values: {},
        infoList: [{
          key: 'cpuNum',
          name: '核心数'
        }, {
          key: 'used',
          name: '用户使用率'
        }, {
          key: 'sys',
          name: '系统使用率'
        }, {
          key: 'free',
          name: '当前空闲率'
        }]
      },
      mem: {
        values: {},
        infoList: [{
          name: '总内存',
          key: 'total'
        }, {
          name: '已用内存',
          key: 'used'
        }, {
          name: '剩余内存',
          key: 'free'
        }, {
          name: '使用率',
          key: 'usage'
        }]
      },
      jvm: {
        values: {}
      },
      server: {
        values: {}
      },
      sysFile: {
        columns: [{
          title: '盘符路径',
          dataIndex: 'dirName'
        }, {
          title: '文件系统',
          dataIndex: 'sysTypeName'
        }, {
          title: '盘符类型',
          dataIndex: 'typeName'
        }, {
          title: '总大小',
          dataIndex: 'total'
        }, {
          title: '可用大小',
          dataIndex: 'free'
        }, {
          title: '已用大小',
          dataIndex: 'used'
        }, {
          title: '已用百分比',
          dataIndex: 'usage'
        }],
        data: []
      }
    }
  },
  created () {
    this.viewServerInfo()
  },
  methods: {
    viewServerInfo () {
      this.loading = true
      getServerInfo().then(response => {
        const { data } = response
        this.cpu.values = data['cpu']
        this.mem.values = data['mem']
        this.jvm.values = data['jvm']
        this.server.values = data['sys']
        this.sysFile.data = data['sysFiles']
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-card-body {
  padding-top: 10px;
}

.sysFile-table{
  /deep/ .ant-card-body {
    padding-left: 12px;
    padding-right: 12px;
  }
}

.data-container-height {
  line-height: 44px;
}
</style>
