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
              <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
                添加
              </el-button>
              <el-button
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
                    v-model="queryForm.title"
                    placeholder="请输入关键字"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    icon="el-icon-search"
                    type="primary"
                    native-type="submit"
                  >
                    查询
                  </el-button>
                </el-form-item>
              </el-form>
            </vab-query-form-right-panel>
          </vab-query-form>

          <el-table
            ref="tableSort"
            v-loading="listLoading"
            :data="list"
            :element-loading-text="elementLoadingText"
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
              label="角色编码"
              prop="code"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="角色名"
              prop="name"
              sortable
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="创建时间"
              prop="createTime"
              width="200"
            ></el-table-column>
            <el-table-column show-overflow-tooltip label="状态">
              <template #default="{ row }">
                <el-tag :type="row.status | statusFilter">
                  {{ row.status | statusDisplayNameFilter }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="操作" width="180px">
              <template #default="{ row }">
                <div v-if="!row.isDefault">
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="handleEdit(row)"
                  ></el-button>
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(row)"
                  ></el-button>
                  <el-button
                    type="text"
                    icon="el-icon-user"
                    @click="handleRoleUser(row)"
                  ></el-button>
                  <el-button
                    type="text"
                    icon="el-icon-setting"
                    @click="handleResource(row)"
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
          <role-resource-edit ref="roleResourceEdit"></role-resource-edit>
          <role-user ref="roleUserEdit"></role-user>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { list, deleteRole } from '@/api/rbac/role'
  import { orgTree } from '@/api/rbac/org'
  import TableEdit from './components/RoleTable'
  import RoleResourceEdit from './components/RoleResource'
  import RoleUser from './components/RoleUser'

  export default {
    name: 'RoleTable',
    components: {
      TableEdit,
      RoleResourceEdit,
      RoleUser,
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
    },
    data() {
      return {
        // 左，组织树
        orgTree: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        //
        imgShow: true,
        list: [],
        imageList: [],
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
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
        // 角色列表
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
      //角色列表
      async fetchTableData() {
        if (this.queryForm.orgId) {
          list(this.queryForm)
            .then((resp) => {
              const data = resp.data
              this.list = data.records
              this.total = data.records.length
              this.listLoading = false
            })
            .catch(() => {
              this.listLoading = false
            })
        }
      },
      handleOrgSelected(data) {
        this.queryForm.keyword = ''
        this.queryForm.orgId = data.id
        this.fetchTableData()
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      handleResource(row) {
        this.$refs['roleResourceEdit'].showEdit(row)
      },
      handleRoleUser(row) {
        this.$refs['roleUserEdit'].showEdit(row)
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            let delRoleIds = [row.id]
            deleteRole(delRoleIds)
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
