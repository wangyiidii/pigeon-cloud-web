<template>
  <div>
    <el-form :model="form" :rules="rules" :inline="true">
      <el-form-item label="手机号" label-width="82px">
        <el-input
          v-model="mobile"
          prop="mobile"
          style="width: 200px"
          size="medium"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="图片验证码" label-width="82px">
        <el-input
          v-model="userContent"
          prop="password"
          size="medium"
          style="width: 110px"
          clearable
        ></el-input>
        <el-image
          style="
            position: relative;
            top: 14px;
            left: 4px;
            width: 90px;
            height: 38px;
          "
          :src="'data:image/png;base64,' + captcha"
          @click="getCaptcha()"
        ></el-image>
      </el-form-item>
      <el-form-item label="短信验证码" label-width="82px">
        <el-input
          v-model="password"
          style="width: 112px"
          size="medium"
          clearable
        ></el-input>
        <el-button type="primary" style="margin: 0 5px" @click="sendRandom()">
          点击获取
        </el-button>
      </el-form-item>
      <div class="text-center row-space">
        <el-button type="primary" @click="randomLogin()">登陆并获取</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
  import {
    getCaptcha,
    sendRandom,
    randomLogin,
  } from '@/api/commonTools/telecom.js'
  export default {
    data() {
      return {
        telecomType: 3,
        mobile: '',
        imageId: '',
        userContent: '',

        password: '',
        captcha: '',
        rules: {},
      }
    },
    created() {
      this.getCaptcha()
    },
    methods: {
      getCaptcha() {
        this.userContent = ''
        this.password = ''
        let params = {}
        params.type = this.telecomType
        getCaptcha(params)
          .then((resp) => {
            this.captcha = resp.data.image
            this.imageId = resp.data.key
          })
          .catch(() => {})
      },
      sendRandom() {
        this.password = ''
        let params = {}
        params.type = this.telecomType
        params.imageId = this.imageId
        params.mobile = this.mobile
        params.userContent = this.userContent
        sendRandom(params)
          .then((resp) => {
            this.captcha = resp.data.image
          })
          .catch(() => {})
      },
      randomLogin() {
        let params = {}
        params.type = this.telecomType
        params.imageId = this.imageId
        params.mobile = this.mobile
        params.userContent = this.userContent
        params.password = this.password
        randomLogin(params)
          .then((resp) => {
            console.log(resp)
          })
          .catch(() => {})
      },
    },
  }
</script>
<style>
  .el-input-group__append {
    color: black;
    background-color: white;
  }
</style>
