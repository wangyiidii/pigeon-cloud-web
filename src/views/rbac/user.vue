<template>
  <div class="index-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>部门</span>
          </div>
          <el-tree
            :data="orgTree"
            :props="defaultProps"
            default-expand-all
            highlight-current
            @node-click="handleOrgSelected"
          ></el-tree>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18">
        <div class="table-container">
          <vab-query-form>
            <vab-query-form-left-panel>
              <el-button
                v-permissions="['sys:user:add']"
                icon="el-icon-plus"
                type="primary"
                @click="handleAdd"
              >
                添加
              </el-button>
              <el-button
                v-permissions="['sys:user:delete']"
                icon="el-icon-delete"
                type="danger"
                @click="handleDelete"
              >
                删除
              </el-button>
            </vab-query-form-left-panel>
            <vab-query-form-right-panel>
              <el-form ref="form" :model="queryForm" :inline="true">
                <el-form-item>
                  <el-input
                    v-model="queryForm.keyword"
                    placeholder="请输入关键字"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    icon="el-icon-search"
                    type="primary"
                    native-type="submit"
                    @click="fetchTableData()"
                  >
                    查询
                  </el-button>
                </el-form-item>
              </el-form>
            </vab-query-form-right-panel>
          </vab-query-form>

          <el-table
            ref="tableSort"
            v-loading="userTableLoading"
            :data="tableData"
            :element-loading-text="userTableLoadingText"
            :height="height"
            @selection-change="setSelectRows"
          >
            <el-table-column
              show-overflow-tooltip
              type="selection"
              width="55"
            ></el-table-column>
            <el-table-column show-overflow-tooltip label="序号" width="95">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="username"
              label="用户名"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="昵称"
              prop="name"
            ></el-table-column>
            <el-table-column show-overflow-tooltip label="头像">
              <template #default="{ row }">
                <el-avatar size="medium" :src="row.avatar"></el-avatar>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="状态">
              <template #default="{ row }">
                <el-tag :type="row.status | statusFilter">
                  {{ row.status | statusDisplayNameFilter }}
                </el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column
        show-overflow-tooltip
        label="手机号"
        prop="mobile"
        sortable
      ></el-table-column> -->

            <el-table-column
              show-overflow-tooltip
              label="创建时间"
              prop="createTime"
              width="200"
            ></el-table-column>

            <el-table-column show-overflow-tooltip label="来源">
              <template #default="{ row }">
                <el-tag>
                  {{ row.source | userSourceDisplayNameFilter }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="操作" width="180px">
              <template #default="{ row }">
                <div v-if="!row.isDefault">
                  <el-button
                    v-permissions="['sys:user:edit']"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleEdit(row)"
                  ></el-button>
                  <el-button
                    v-permissions="['sys:user:delete']"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(row)"
                  ></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :background="background"
            :current-page="queryForm.pageNo"
            :layout="layout"
            :page-size="queryForm.pageSize"
            :total="total"
          ></el-pagination>
          <table-edit ref="edit" @fetch-data="fetchData"></table-edit>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { list, deleteUser } from '@/api/rbac/user'
  import { orgTree } from '@/api/rbac/org'

  import TableEdit from './components/UserTable'

  export default {
    name: 'UserTable',
    components: {
      TableEdit,
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          ENABLED: 'success',
          DISABLED: 'warning',
          DELETED: 'danger',
        }
        return statusMap[status]
      },
      statusDisplayNameFilter(status) {
        const statusMap = {
          ENABLED: '可用',
          DISABLED: '禁用',
          DELETED: '已删除',
        }
        return statusMap[status]
      },
      userSourceDisplayNameFilter(status) {
        const statusMap = {
          PRIVATE: '平台',
          GITHUB: 'Github',
          GITEE: 'Gitee',
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        // 左，组织树
        orgTree: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        // 右，用户表格
        tableData: [],
        userTableLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        selectRows: '',
        userTableLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          keyword: '',
          orgId: '',
        },
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {
      this.fetchData()
    },
    beforeDestroy() {},
    mounted() {},
    methods: {
      async fetchData() {
        // 组织树
        this.fetchOrgTree()
        // 用户列表
        this.fetchTableData()
      },
      // 组织树
      async fetchOrgTree() {
        orgTree()
          .then((resp) => {
            this.orgTree = resp.data
          })
          .catch(() => {})
      },
      // 用户表格数据
      async fetchTableData() {
        if (this.queryForm.orgId) {
          list(this.queryForm)
            .then((resp) => {
              const data = resp.data
              this.tableData = data.records
              this.total = data.records.length
              this.userTableLoading = false
            })
            .catch(() => {
              this.userTableLoading = false
            })
        }
      },
      handleOrgSelected(data) {
        this.queryForm.keyword = ''
        this.queryForm.orgId = data.id
        this.fetchTableData()
      },
      // 显示添加
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      // 显示编辑
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      // 处理删除
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            let delUids = [row.id]
            deleteUser(delUids)
              .then((resp) => {
                this.$baseNotify(resp.msg, '提示', 'success')
                this.fetchData()
              })
              .catch(() => {})
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              this.$baseNotify(
                '模拟批量删除' + this.selectRows.length + '个用户成功',
                '提示',
                'success'
              )
              this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      setSelectRows(val) {
        this.selectRows = val
      },
    },
  }
</script>
<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;
  }
</style>
