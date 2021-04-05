<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <vab-upload
          ref="vabUpload"
          url="/upload"
          name="file"
          :limit="50"
          :size="2"
          @fetch-data="fetchData"
        ></vab-upload>
        <el-button type="primary" @click="handleShow({ key: 'value' })">
          上传
        </el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">
          删除
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form ref="form" :model="queryForm" :inline="true">
          <el-form-item>
            <el-input v-model="queryForm.title" placeholder="请输入关键字" />
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
        label="名称"
        prop="filename"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="预览">
        <template #default="{ row }">
          <el-image :preview-src-list="imageList" :src="row.url"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="大小"
        prop="size"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="创建时间"
        prop="createTime"
        width="200"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="180px">
        <template #default="{ row }">
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
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
  </div>
</template>

<script>
  import { list, deleteAttachment } from '@/api/system/attachment'
  import VabUpload from '@/components/VabUpload'
  export default {
    name: 'AttachmentTable',
    components: { VabUpload },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger',
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        imgShow: true,
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          title: '',
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
        list()
          .then((resp) => {
            const data = resp.data
            this.list = data.records
            this.total = data.records.length
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
      },
      handleShow(data) {
        this.$refs['vabUpload'].handleShow(data)
      },
      handleDelete(row) {
        if (row.id) {
          let param = {}
          param.id = row.id
          param.isDeleteInBucket = true
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            deleteAttachment(param)
              .then((resp) => {
                if (Boolean(resp.code)) {
                  this.$baseNotify(resp.msg, '提示', 'success')
                } else {
                  this.$baseNotify(resp.msg, '提示', 'error')
                }
              })
              .catch(() => {})
            this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              this.$baseNotify(
                '模拟批量删除' + this.selectRows.length + '个文件成功',
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
