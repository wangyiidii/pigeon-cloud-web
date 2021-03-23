<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :width="dialogWidth"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="角色编码" prop="code">
        <el-input
          v-model.trim="form.code"
          autocomplete="off"
          :disabled="isEdit"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色名" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="个人简介" prop="desc">
        <el-input
          v-model.trim="form.desc"
          type="textarea"
          autocomplete="off"
          placeholder="请输入角色简介"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { createRole, updateRole } from '@/api/rbac/role'

  export default {
    name: 'TableEdit',
    data() {
      return {
        form: {},
        rules: {
          code: [
            { required: true, trigger: 'blur', message: '请输入角色编码' },
          ],
          name: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
          desc: [
            { required: true, trigger: 'blur', message: '请输入角色描述' },
          ],
        },
        title: '',
        isEdit: false,
        dialogFormVisible: false,
        dialogWidth: '500px',
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
        var val = document.body.clientWidth
        const def = 500 // 默认宽度
        if (val < def) {
          this.dialogWidth = '90%'
        } else {
          this.dialogWidth = def + 'px'
        }
      },
      showEdit(row) {
        if (!row) {
          this.pwdGroup = true
          this.isEdit = false
          this.title = '添加'
        } else {
          this.pwdGroup = false
          this.isEdit = true
          this.title = '编辑'
          this.form = row
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            if (this.form.id) {
              updateRole(this.form)
                .then((resp) => {
                  this.$baseNotify(resp.msg, '提示', 'success')
                  this.dialogFormVisible = false
                  this.$emit('fetch-data')
                  this.form = this.$options.data().form
                })
                .catch(() => {})
            } else {
              createRole(this.form)
                .then((resp) => {
                  this.$baseNotify(resp.msg, '提示', 'success')
                  this.dialogFormVisible = false
                  this.$emit('fetch-data')
                  this.form = this.$options.data().form
                })
                .catch(() => {})
            }
          } else {
            return false
          }
        })
      },
    },
  }
</script>
