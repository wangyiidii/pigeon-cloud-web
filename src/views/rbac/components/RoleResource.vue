<template>
  <el-dialog
    title="编辑菜单权限"
    :visible.sync="dialogFormVisible"
    :width="dialogWidth"
    @close="close"
  >
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-tree
          ref="menuTree"
          :data="resourceTree"
          :props="defaultProps"
          :default-expanded-keys="menuTreeExpandedKeys"
          node-key="id"
          show-checkbox
          highlight-current
          @node-click="switchMenu"
          @check-change="handleMenuTreeCheckChange"
        ></el-tree>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-table
          ref="permsTable"
          :data="permsTableData"
          @select="onTableSelect"
        >
          <el-table-column
            show-overflow-tooltip
            type="selection"
            width="55"
            :selectable="permsTableCheckEnabled"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="编码"
            prop="code"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="名称"
            prop="desc"
          ></el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { menuTree, menuPermsMap } from '@/api/rbac/resource'
  import { getRoleMenu, getRolePermission, bindResource } from '@/api/rbac/role'

  export default {
    name: 'RoleResourceEdit',
    data() {
      return {
        // 当前角色
        currRole: {},
        // dialog
        dialogWidth: '',
        dialogFormVisible: false,
        // 左
        resourceTree: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        menuTreeExpandedKeys: [],

        // 右
        currMenuId: -1,
        menuPermsMap: {},
        permsTableData: [],
        checkedPermsIds: [],
      }
    },
    created() {
      this.setDialogWidth()
    },
    mounted() {
      window.onresize = () => {
        return (() => {
          this.setDialogWidth()
        })()
      }
    },
    methods: {
      // dialog宽度
      setDialogWidth() {
        let val = document.body.clientWidth
        const def = 800 // 默认宽度
        if (val < def) {
          this.dialogWidth = '90%'
        } else {
          this.dialogWidth = def + 'px'
        }
      },
      showEdit(row) {
        this.currRole = row
        // 先给相关数据置空
        this.checkedPermsIds = []
        this.permsTableData = []
        // 获取空的树（左）和权限（右）
        this.initData()
        // 菜单选中项
        getRoleMenu(row.id)
          .then((resp) => {
            let checkedMenuIds = resp.data.map(function (item, index) {
              return Number(item.id)
            })

            // 延迟渲染树的选中节点（这里不用el-tree的default-checked-keys属性）
            this.$nextTick(() => {
              checkedMenuIds.forEach((i, n) => {
                var node = this.$refs.menuTree.getNode(i)
                if (node.isLeaf) {
                  this.$refs.menuTree.setChecked(node, true)
                } else {
                  // 设置展开节点
                  this.menuTreeExpandedKeys.push(i)
                }
              })
            })
          })
          .catch(() => {})

        // 权限选中项
        getRolePermission(row.id)
          .then((resp) => {
            this.checkedPermsIds = resp.data.map(function (item) {
              return Number(item.id)
            })
          })
          .catch(() => {})
        // 显示dialog
        this.dialogFormVisible = true
      },

      close() {
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      save() {
        let checkMenuList = this.$refs.menuTree
          .getCheckedKeys()
          .concat(this.$refs.menuTree.getHalfCheckedKeys())
        let param = {}
        param.roleId = this.currRole.id
        param.menuIdList = checkMenuList
        param.permissionIdList = this.checkedPermsIds
        bindResource(param)
          .then((resp) => {
            this.$baseNotify(resp.msg, '提示', 'success')
          })
          .catch(() => {})
        this.dialogFormVisible = false
      },
      /**
       * 切换左侧菜单时触发。
       * 显示该菜单下的权限，并默认勾选选中的权限；菜单下没有权限则清空
       */
      switchMenu(data) {
        this.currMenuId = data.id
        if (this.menuPermsMap.hasOwnProperty(this.currMenuId)) {
          // 渲染右边权限表格
          this.permsTableData = this.menuPermsMap['' + this.currMenuId + '']
          // 默认勾选
          this.$nextTick(() => {
            this.renderPermTable()
          })
        } else {
          // 清空右边的权限
          this.permsTableData = []
        }
      },
      handleMenuTreeCheckChange(menuNode, checked) {
        if (!checked && this.menuPermsMap.hasOwnProperty(menuNode.id)) {
          let aa = this.menuPermsMap[menuNode.id].map((item) => {
            return Number(item.id)
          })
          this.checkedPermsIds = this.checkedPermsIds.filter(function (v) {
            return aa.indexOf(v) == -1
          })
        }
        this.renderPermTable()
      },
      renderPermTable() {
        this.permsTableData.forEach((row) => {
          if (this.checkedPermsIds.indexOf(Number(row.id)) >= 0) {
            this.$refs.permsTable.toggleRowSelection(row, true)
          } else {
            this.$refs.permsTable.toggleRowSelection(row, false)
          }
        })
      },
      /**
       * 表格选中时（@select）触发，更新this.checkedPermsIds
       */
      onTableSelect(rows, row) {
        let selected = rows.length && rows.indexOf(row) !== -1
        let currId = Number(row.id)
        if (selected) {
          if (!this.checkedPermsIds.hasOwnProperty()) {
            this.checkedPermsIds.push(currId)
          }
        } else {
          this.checkedPermsIds.pop(currId)
        }
      },
      /**
       * 权限表格是否可选，根据左侧菜单是否选中
       */
      permsTableCheckEnabled() {
        if (!this.$refs.menuTree) {
          return false
        }
        let selectedMeuId = this.$refs.menuTree
          .getCheckedKeys()
          .concat(this.$refs.menuTree.getHalfCheckedKeys())
          .map((item) => {
            return Number(item)
          })
        return selectedMeuId.indexOf(Number(this.currMenuId)) != -1
      },
      /**初始化菜单树，和菜单权限map */
      initData() {
        // 菜单树
        menuTree()
          .then((resp) => {
            const data = resp.data
            this.resourceTree = data
          })
          .catch(() => {})
        // 菜单权限映射
        menuPermsMap()
          .then((resp) => {
            this.menuPermsMap = resp.data
          })
          .catch(() => {})
      },
    },
  }
</script>
