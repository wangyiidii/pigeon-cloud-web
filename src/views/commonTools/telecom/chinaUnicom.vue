<template>
  <div>
    <el-form
      ref="form_chinaUnicom"
      :model="form"
      :rules="rules"
      :inline="true"
      style="float: left"
    >
      <el-form-item label="手机号" label-width="55px">
        <el-input
          v-model="form.mobile"
          prop="mobile"
          size="medium"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <el-form :inline="true" style="float: left">
      <el-form-item label="验证码" label-width="55px">
        <el-input
          v-model="form.password"
          style="width: 120px"
          prop="password"
          size="medium"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <span v-show="show.timeCounter">{{ timeCounter }}</span>
        <el-button
          v-show="!show.timeCounter"
          type="primary"
          size="mini"
          @click="sendRandom('form_chinaUnicom')"
        >
          获取验证码
        </el-button>
      </el-form-item>
    </el-form>
    <el-form
      v-show="show.img_code"
      label-width="100px"
      :inline="true"
      style="float: left"
    >
      <el-form-item label="图片验证码">
        <el-input
          v-model="form.userContent"
          style="width: 120px"
          prop="password"
          size="medium"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <img
          style="position: relative; top: 2px; height: 30px"
          :src="'data:image/png;base64,' + imageCodeBase64"
        />
      </el-form-item>
    </el-form>
    <div style="clear: both"></div>
    <div class="text-center row-space">
      <el-button
        type="primary"
        :loading="btnLoading.chinaUnicomLoadingBtn"
        @click="randomLogin('form_chinaUnicom')"
      >
        登陆并获取
      </el-button>
    </div>
    <el-tabs
      v-show="show.chinaUnicomInfoCard"
      type="border-card"
      class="row-space"
    >
      <el-tab-pane label="Cookie">
        <p>
          <strong>手机号:</strong>
          <el-tag>{{ chinaUnicomInfo.num }}</el-tag>
        </p>
        <p>
          <strong>归属地:</strong>
          <el-tag type="warning">
            {{ chinaUnicomInfo.proName }} {{ chinaUnicomInfo.cityName }}
          </el-tag>
        </p>
        <p>
          <strong>Cookie:</strong>
          <el-input
            v-model="chinaUnicomInfo.cookie"
            type="textarea"
            class="row-space"
            size="medium"
            :rows="8"
          ></el-input>
        </p>
        <p>
          <strong>appid:</strong>
          <el-input
            v-model="appid"
            type="textarea"
            class="row-space"
            size="medium"
            :rows="2"
          ></el-input>
        </p>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { sendRandom, randomLogin } from '@/api/commonTools/telecom.js'

  import Vue from 'vue'
  // 纯数字校验
  const validateNumber = (rule, value, callback) => {
    let numberReg = /^\d+$|^\d+[.]?\d+$/
    if (value !== '') {
      if (!numberReg.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    } else {
      callback(new Error('请输入值'))
    }
  }
  export default {
    data() {
      return {
        telecomType: 2,
        appid: '',
        timeCounter: 0, // 倒计时计数器
        imageCodeBase64: '',
        show: {
          chinaUnicomInfoCard: false,
          tab_packageUsage: false,
          timeCounter: false,
          tab_myInfo: false,
          img_code: false,
        },
        btnLoading: {
          chinaUnicomLoadingBtn: false,
        },
        btnEnabled: {
          //chinaUnicomBtn: false,
        },
        form: {
          mobile: '',
          password: '',
          userContent: '',
          imageId: '',
        },
        chinaUnicomInfo: {
          num: '',
          proName: '',
          cityName: '',
          cookie: '',
          member: [],
          packageUsage: {},
          myInfo: {},
        },
        rules: {
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            {
              validator: validateNumber,
              message: '手机号格式不正确',
              trigger: 'blur',
            },
          ],
          password: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
          ],
        },
      }
    },
    mounted: function () {
      let mobile = localStorage.getItem('mobile')
      let cookieStr = localStorage.getItem('cookieStr')
      let chinaUnicomResp = localStorage.getItem('chinaUnicomResp')
      if (!Boolean(mobile)) {
        return
      }
      this.form.mobile = mobile
      if (Boolean(chinaUnicomResp)) {
        chinaUnicomResp = JSON.parse(chinaUnicomResp)
        this.chinaUnicomInfo = chinaUnicomResp.list[0]
        this.chinaUnicomInfo.cookie = cookieStr
        this.chinaUnicomInfo.member = chinaUnicomResp.member
        this.appid = chinaUnicomResp.appId
        this.show.chinaUnicomInfoCard = true
      }
    },
    methods: {
      sendRandom(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            this.$message.error('缺少必要参数')
          } else {
            this.show.chinaUnicomInfoCard = false
            let params = {}
            params.mobile = this.form.mobile
            params.type = this.telecomType
            sendRandom(params)
              .then((resp) => {
                let message = resp.msg
                Vue.prototype.$baseMessage(message, 'success')
                this.timeCounter = 60
                this.show.timeCounter = true
                var auth_timetimer = setInterval(() => {
                  this.timeCounter--
                  if (this.timeCounter <= 0) {
                    this.show.timeCounter = false
                    clearInterval(auth_timetimer)
                  }
                }, 1000)
              })
              .catch((err) => {
                console.log(err)
              })
          }
        })
      },
      randomLogin(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            Vue.prototype.$baseMessage('缺少必要参数', 'error')
          } else {
            // 加载动画
            this.btnLoading.chinaUnicomLoadingBtn = true
            let params = {}
            params.mobile = this.form.mobile
            params.password = this.form.password
            params.type = this.telecomType
            if (Boolean(this.form.imageId)) {
              params.userContent = this.form.userContent
              params.imageId = this.form.imageId
            }
            randomLogin(params)
              .then((resp) => {
                // 按钮加载停止
                this.btnLoading.chinaUnicomLoadingBtn = false
                // 倒计时定时器停止并隐藏
                this.show.timeCounter = false
                let message = resp.msg
                let data = resp.data
                if ('请输入图片验证码' == message) {
                  this.form.imageId = data.imageID
                  this.imageCodeBase64 = data.imageContent
                  this.show.img_code = true
                  Vue.prototype.$baseMessage(message, 'error')
                  return
                } else {
                  Vue.prototype.$baseMessage(message, 'success')
                }
                this.chinaUnicomInfo = data.chinaUnicomResp.list[0]
                let cookieStr = data.cookieStr
                this.chinaUnicomInfo.cookie = cookieStr
                this.chinaUnicomInfo.member = data.chinaUnicomResp.member
                this.appid = data.chinaUnicomResp.appId
                localStorage.setItem('mobile', this.chinaUnicomInfo.num)
                localStorage.setItem('cookieStr', cookieStr)
                localStorage.setItem(
                  'chinaUnicomResp',
                  JSON.stringify(data.chinaUnicomResp)
                )
                this.show.chinaUnicomInfoCard = true
                this.btnLoading.chinaUnicomLoadingBtn = false
                this.show.timeCounter = false
              })
              .catch((err) => {
                this.btnLoading.chinaUnicomLoadingBtn = false
                this.show.timeCounter = false
                console.log(err)
              })
          }
        })
      },
    },
  }
</script>
