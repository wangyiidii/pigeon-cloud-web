<template>
  <el-dialog
    title="编辑菜单"
    :visible.sync="dialogFormVisible"
    :width="dialogWidth"
    @close="close"
  >
    <el-tree
      ref="menuTree"
      :data="resourceTree"
      :props="defaultProps"
      :default-expanded-keys="menuTreeExpandedKeys"
      node-key="id"
      show-checkbox
    ></el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { resourceTree } from '@/api/rbac/resource'
  import { getRoleMenu, bindMenu } from '@/api/rbac/role'

  export default {
    name: 'RoleResourceEdit',
    data() {
      return {
        dialogWidth: '500px',
        dialogFormVisible: false,
        resourceTree: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        currRole: {},
        menuTreeExpandedKeys: [],
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
      setDialogWidth() {
        let val = document.body.clientWidth
        const def = 500 // 默认宽度
        if (val < def) {
          console.log(11)
          this.dialogWidth = '90%'
        } else {
          console.log(22)
          this.dialogWidth = def + 'px'
        }
      },
      showEdit(row) {
        this.currRole = row
        // 获取空的树
        this._resourceTree()
        // 加载选中项
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
        // let updateMenuIdList = checkMenuList.map(function (item, index) {
        //   console.log(item)
        //   return Number(item.id)
        // })
        let param = {}
        param.roleId = this.currRole.id
        param.menuIdList = checkMenuList
        bindMenu(param)
          .then((resp) => {
            this.$baseNotify(resp.msg, '提示', 'success')
          })
          .catch(() => {})
        this.dialogFormVisible = false
      },
      _resourceTree() {
        resourceTree()
          .then((resp) => {
            const data = resp.data
            this.resourceTree = data
          })
          .catch(() => {})
      },
    },
  }
</script>
