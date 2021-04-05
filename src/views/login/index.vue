<template>
  <div class="login-container">
    <div class="login-border">
      <el-row type="flex">
        <!-- <el-col :span="12" class="login-left">
          <img
            src="@/assets/login_images/matecloud-banner.png"
            style="height: 485px"
          />
        </el-col> -->

        <el-col :span="12">
          <div class="login-main">
            <h4 class="title">Pigeon</h4>
            <el-tabs v-model="activeName" @tab-click="handleClickLoginTabs">
              <el-tab-pane label="用户密码" name="user">
                <span slot="label">
                  <i slot="prefix" class>
                    <svg-icon icon-class="user" />
                  </i>
                  用户密码
                </span>
                <userLogin></userLogin>
              </el-tab-pane>
              <el-tab-pane label="手机登录" name="mobile">
                <span slot="label">
                  <i slot="prefix" class>
                    <svg-icon icon-class="mobile" />
                  </i>
                  手机登录
                </span>
              </el-tab-pane>
            </el-tabs>
            <div class="third-login">
              <el-divider>第三方登录</el-divider>
              <div class="third-way">
                <span class="third-icon" @click="handleSocial('github')">
                  <svg-icon slot="prefix" icon-class="github" />
                </span>
                <span class="third-icon" @click="handleSocial('gitee')">
                  <svg-icon
                    slot="prefix"
                    icon-class="gitee"
                    class="el-input__icon login-icon"
                  />
                </span>
                <span class="third-icon" @click="handleSocial()">
                  <svg-icon
                    slot="prefix"
                    icon-class="qq"
                    class="el-input__icon login-icon"
                  />
                </span>
                <span class="third-icon" @click="handleSocial()">
                  <svg-icon
                    slot="prefix"
                    icon-class="alipay"
                    class="el-input__icon login-icon"
                  />
                </span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import userLogin from './userLogin'
  import {} from '@/utils/util'
  import { validatenull } from '@/utils/validate'
  import { baseURL } from '@/config'

  export default {
    name: 'ArtemisLogin',

    components: {
      userLogin,
    },
    data() {
      return {
        activeName: 'user',
        lastActiveName: 'user',
        loginForm: {},
      }
    },
    computed: {},
    watch: {},
    created: function () {
      this.handleSocialCallback()
    },
    methods: {
      handleClickLoginTabs(tab, event) {
        if (tab.name != 'user') {
          this.$nextTick(() => {
            this.activeName = this.lastActiveName
            this.$message.info('敬请期待')
          })

          return
        }
        lastActiveName = this.activeName
      },
      handleSocial(type) {
        if (type) {
          window.location.href = baseURL + 'auth/oauth/render/' + type
        } else {
          this.$message.info('敬请期待')
        }
      },
      handleSocialCallback() {
        const params = this.$route.query
        if (
          validatenull(params.source) &&
          validatenull(params.state) &&
          validatenull(params.code)
        ) {
          return
        } else {
          this.loginForm.source = params.source
          this.loginForm.code = params.code
          this.loginForm.state = params.state
          this.loading = true
          this.$store
            .dispatch('user/loginBsocial', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch((error) => {
              this.loading = false
            })
        }
      },
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    //background: url('~@/assets/login_images/background.svg');
    background-color: #f0f2f5;
  }

  @media screen and (max-width: 768px) {
    .login-left {
      display: none;
    }
  }
  .login-left {
    & img {
      float: right;
    }
  }
  .login-main {
    width: 323px;
    height: 455px;
    padding: 25px 25px 5px 25px;
    background: #ffffff;
    // border-radius: 6px;
  }

  .title {
    margin: 10px auto 40px auto;
    font-size: 24px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.85);
    text-align: center;
  }

  .login-form {
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }

    .input-icon {
      width: 14px;
      height: 39px;
      margin-left: 2px;
    }
  }

  .login-tip {
    font-size: 13px;
    color: #bfbfbf;
    text-align: center;
  }

  .login-footer {
    position: fixed;
    bottom: 1rem;
    width: 100%;
    height: 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1rem;
    color: #2c3e50;
    text-align: center;
  }

  .tips {
    margin-bottom: 10px;
    font-size: 14px;
    color: #fff;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .third-login {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 10px 0 30px 0;
    vertical-align: middle;

    & .third-icon {
      margin: 0 20px;
      cursor: pointer;
      fill: rgba(0, 0, 0, 0.2);
      & .svg-icon {
        width: 32px;
        height: 32px;
      }
    }
  }

  .third-way {
    display: flex;
    justify-content: center;
    width: 323px;
  }

  .third-icon:hover {
    fill: rebeccapurple;
  }
</style>
