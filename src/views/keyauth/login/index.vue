<template>
  <div class="login-container">
    <img src="@/assets/login/bg.png" alt="" class="wave" />
    <div class="container">
      <div class="img">
        <img src="@/assets/login/img-3.svg" alt="" />
      </div>
      <div class="login-box">
        <form action="">
          <img src="@/assets/login/avatar.svg" alt="" class="avatar" />
          <h2>极乐研发云</h2>
          <div id="username" class="input-group">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <div>
              <h5>账号</h5>
              <input
                v-model="loginForm.username"
                tabindex="1"
                type="text"
                class="input"
              />
            </div>
          </div>
          <div id="password" class="input-group">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <div>
              <h5>密码</h5>
              <input
                v-model="loginForm.password"
                type="password"
                tabindex="2"
                class="input"
              />
            </div>
          </div>
          <a href="#">忘记密码</a>
          <!-- 提交表单 -->
          <el-button
            class="btn"
            :loading="loading"
            tabindex="3"
            size="medium"
            type="primary"
            @click="handleLogin"
          >
            登录
          </el-button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      passwordType: "password",
      loginForm: {
        grant_type: "password",
        username: "",
        password: "",
      },
    };
  },
  mounted() {
    this.addEventHandler();
  },
  methods: {
    shake(elemId) {
      let elem = document.getElementById(elemId);
      if (elem) {
        elem.classList.add("shake");
        setTimeout(() => {
          elem.classList.remove("shake");
        }, 800);
      }
    },
    check() {
      if (this.loginForm.username === "") {
        this.shake("username");
        return false;
      }
      if (this.loginForm.password === "") {
        this.shake("password");
        return false;
      }
      return true;
    },
    addEventHandler() {
      const inputs = document.querySelectorAll(".input");

      function focusFunction() {
        let parentNode = this.parentNode.parentNode;
        parentNode.classList.add("focus");
      }
      function blurFunction() {
        let parentNode = this.parentNode.parentNode;
        if (this.value == "") {
          parentNode.classList.remove("focus");
        }
      }

      inputs.forEach((input) => {
        input.addEventListener("focus", focusFunction);
        input.addEventListener("blur", blurFunction);
      });
    },
    async handleLogin() {
      if (this.check()) {
        this.loading = true;
        try {
          // 调用后端接口进行登录, 状态保存到vuex中
          await this.$store.dispatch("user/login", this.loginForm);

          // 调用后端接口获取用户profile, 状态保存到vuex中
          const user = await this.$store.dispatch("user/getInfo");
          console.log(user);
        } catch (error) {
          this.$message.error(`${error}`);
          return;
        } finally {
          this.loading = false;
        }

        // 登陆成功, 重定向到Home或者用户指定的URL
        this.$router.push({
          path: this.$route.query.redirect || "/",
          query: this.otherQuery,
        });
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
