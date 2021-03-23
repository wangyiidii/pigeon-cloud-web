<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :width="dialogWidth"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model.trim="form.username"
          autocomplete="off"
          :disabled="isEdit"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="pwdGroup" label="密码" prop="password">
        <el-input v-model.trim="form.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="pwdGroup" label="确认密码" prop="password">
        <el-input
          v-model.trim="form.confirmPassword"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model.trim="form.mobile" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="resource">
        <el-radio-group v-model.trim="form.sex" autocomplete="off">
          <el-radio-button label="M">男</el-radio-button>
          <el-radio-button label="W">女</el-radio-button>
          <el-radio-button label="N">未知</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input v-model.trim="form.avatar" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="个人简介" prop="desc">
        <el-input
          v-model.trim="form.desc"
          type="textarea"
          autocomplete="off"
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
  import { createUser, updateUserInfo } from '@/api/rbac/user'
  export default {
    name: 'TableEdit',
    data() {
      return {
        form: {
          sex: 'M',
        },
        rules: {
          username: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
          ],
          password: [
            { required: true, trigger: 'blur', message: '请输入密码' },
          ],
          confirmPassword: [
            { required: true, trigger: 'blur', message: '请输入确认密码' },
          ],
          name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
        },
        title: '',
        pwdGroup: false,
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
            console.log(this.form.id)

            if (this.form.id) {
              updateUserInfo(this.form)
                .then((resp) => {
                  this.$baseNotify(resp.msg, '提示', 'success')
                  this.$refs['form'].resetFields()
                  this.dialogFormVisible = false
                  this.$emit('fetch-data')
                  this.form = this.$options.data().form
                })
                .catch(() => {
                  return
                })
            } else {
              createUser(this.form)
                .then((resp) => {
                  this.$baseNotify(resp.msg, '提示', 'success')
                  this.$refs['form'].resetFields()
                  this.dialogFormVisible = false
                  this.$emit('fetch-data')
                  this.form = this.$options.data().form
                })
                .catch(() => {
                  return
                })
            }
          } else {
            return false
          }
        })
      },
    },
  }
</script>
