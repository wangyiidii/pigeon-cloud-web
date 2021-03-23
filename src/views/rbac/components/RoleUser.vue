<template>
  <el-dialog
    title="授权用户"
    :width="dialogWidth"
    :visible.sync="dialogFormVisible"
  >
    <div style="text-align: center">
      <el-transfer
        v-model="checedkForm.userIdList"
        style="text-align: left; display: inline-block"
        :titles="['用户列表', '角色']"
        :data="userListLeft"
      ></el-transfer>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { list as userList } from '@/api/rbac/user'
  import { getRoleUserIdList, bindUser } from '@/api/rbac/role'
  export default {
    name: 'RoleUserEdit',
    data() {
      return {
        dialogWidth: '720px',
        dialogFormVisible: false,
        // 当前角色信息
        currRole: {},
        // 穿梭框左
        userListLeft: [],
        // 穿梭框右 - 表单
        checedkForm: { roleId: 0, userIdList: [] },
      }
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
        var val = document.body.clientWidth
        const def = 720 // 默认宽度
        if (val < def) {
          this.dialogWidth = '90%'
        } else {
          this.dialogWidth = def + 'px'
        }
      },
      showEdit(row) {
        this.checedkForm.roleId = row.id
        this.dialogFormVisible = true

        userList()
          .then((resp) => {
            this.userListLeft = []
            resp.data.records.forEach((u) => {
              this.userListLeft.push({
                key: u.id,
                label: u.name,
                disabled: u.isDefault,
              })
            })
          })
          .catch(() => {})
        getRoleUserIdList(this.checedkForm.roleId).then((resp) => {
          this.checedkForm.userIdList = resp.data
        })
      },
      close() {
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      save() {
        bindUser(this.checedkForm).then((resp) => {
          this.$baseNotify(resp.msg, '提示', 'success')
        })
        this.dialogFormVisible = false
      },
    },
  }
</script>
