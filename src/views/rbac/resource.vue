<template>
  <div class="index-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <el-card v-if="false" shadow="never">
          <div slot="header">
            <span>菜单树</span>
          </div>
          <el-tree
            :data="resourceTree"
            :props="defaultProps"
            show-checkbox
            @node-click="handleNodeClick"
          ></el-tree>
          <div class="bottom"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <vab-query-form>
          <vab-query-form-top-panel :span="12">
            <el-button icon="el-icon-plus" type="primary" @click="handleEdit">
              添加
            </el-button>
          </vab-query-form-top-panel>
        </vab-query-form>
        <el-table
          v-loading="listLoading"
          :data="resourceTree"
          :element-loading-text="elementLoadingText"
          row-key="path"
          border
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="名称/标题"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="path"
            label="路径"
            width="200px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="component"
            label="vue文件路径"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="redirect"
            label="重定向"
            width="100px"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="图标"
            width="50px"
            align="center"
          >
            <template #default="{ row }">
              <span v-if="row.meta">
                <vab-icon
                  v-if="row.meta.icon"
                  :icon="['fas', row.meta.icon]"
                ></vab-icon>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="状态"
            width="60px"
            align="center"
          >
            <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.status == 0 ? '启用' : '禁用' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="200">
            <template #default="{ row }">
              <el-button type="text" @click="handleEdit(row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { resourceTree } from '@/api/rbac/resource'
  export default {
    data() {
      return {
        resourceTree: [],
        listLoading: true,
        elementLoadingText: '正在加载...',
        defaultProps: {
          children: 'children',
          label: 'name',
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleNodeClick(data) {
        console.log(data)
      },
      async fetchData() {
        resourceTree()
          .then((resp) => {
            const data = resp.data
            this.resourceTree = data
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
      },
      handleEdit(row) {
        if (row.path) {
          this.$refs['edit'].showEdit(row)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          })
        }
      },
    },
  }
</script>
