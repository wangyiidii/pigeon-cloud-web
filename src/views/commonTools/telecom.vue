<template>
  <div class="more-container">
    <el-header>运营商Cookie获取</el-header>
    <el-row>
      <el-col :md="8">&zwj;</el-col>
      <el-col :md="8">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="移动" name="tab_chinaMobile"></el-tab-pane>
          <el-tab-pane label="联通" name="tab_chinaUnicom">
            <china-unicom />
          </el-tab-pane>
          <el-tab-pane label="电信" name="tab_chinaTelecom">
            <china-telecom />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
  import chinaTelecom from './telecom/chinaTelecom'
  import ChinaUnicom from './telecom/chinaUnicom'

  export default {
    components: {
      ChinaUnicom,
      chinaTelecom,
    },
    data() {
      return {
        activeName: 'tab_chinaUnicom',
        lastActiveName: 'tab_chinaUnicom',
      }
    },
    watch: {},

    methods: {
      handleClick(tab, event) {
        if (tab.name === 'tab_chinaMobile') {
          this.$message.warning('暂未支持，敬请期待')
          setTimeout(() => {
            this.activeName = this.lastActiveName
          }, 1)
          return
        }
        this.lastActiveName = tab.name
      },
    },
  }
</script>
<style>
  .row-space {
    margin: 10px 0;
  }
  .el-header,
  .el-footer {
    text-align: center;
    line-height: 60px;
    font-size: 30px;
    font-weight: bold;
  }
  .text-center {
    text-align: center;
  }
</style>
