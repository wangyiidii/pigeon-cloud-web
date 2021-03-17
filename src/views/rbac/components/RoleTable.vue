<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
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
      <el-form-item label="菜单" prop="desc">
        <el-tree
          :data="resourceTree"
          :props="defaultProps"
          show-checkbox
          @node-click="handleNodeClick"
        ></el-tree>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/table'
  import { resourceTree } from '@/api/rbac/resource'

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
        },
        title: '',
        isEdit: false,
        dialogFormVisible: false,
        resourceTree: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        this._resourceTree()
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
            this.$baseMessage('模拟编辑成功', 'success')
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
            this.$emit('fetch-data')
            this.form = this.$options.data().form
          } else {
            return false
          }
        })
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
