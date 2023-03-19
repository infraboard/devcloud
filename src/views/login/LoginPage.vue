<template>
  <div class="content">
    <a-form :model="form" :style="{ width: '480px' }" @submit="handleSubmit">
      <a-form-item :style="{ 'justify-content': 'center' }">
        <div class="title">登录微服务研发平台</div>
      </a-form-item>
      <a-form-item
        field="name"
        label="用户"
        :rules="[{ required: true, message: '请输入用户名称' }]"
        :validate-trigger="['change', 'input']"
      >
        <a-input v-model="form.name" placeholder="请输入用户名称">
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="pass"
        label="密码"
        :rules="[
          { required: true, message: '请输入用户密码' },
          { minLength: 5, message: '密码长度不得小于5位' }
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input-password v-model="form.pass" placeholder="请输入密码">
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <!-- 点击保护, loading, 请求中，按钮显示loading, loading 是不能点击 -->
        <a-button :loading="submitLoading" style="width: 100%" type="primary" html-type="submit">{{
          loginButtonText
        }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { LOGIN } from '@/api/mcenter/user'
import type { LoginData } from '@/api/mcenter/user'
import type { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'

const form = reactive({
  name: '',
  pass: '',
  isRead: false
})

const submitLoading = ref(false)
const loginButtonText = ref('登录')

const router = useRouter()
const handleSubmit = async ({
  errors,
  values
}: {
  errors: Record<string, ValidatedError> | undefined
  values: Record<string, any>
}) => {
  if (errors === undefined) {
    console.log(values)

    // 执行与后端交互
    try {
      // 处于请求中
      submitLoading.value = true
      loginButtonText.value = '登录中'

      console.log(values)
      let resp = LOGIN(values as LoginData)
      console.log(resp)

      // 登录过后我们是如何处理登录状态保存的? 通过Cookie处理的
      // Set username,session, 只要有username这个cookie那么当前就是登录中
      // 默认axios 不会执行Set-Cookie逻辑
      // Cookies.set("username", resp.message.username);

      // 登录成功后, 进行页面跳转? 登录成功后，默认跳转哪里?
      // 如果该页面有跳转参数: redirect=BackendTagList&key=a
      // 登录成功后，需要跳转到之定义的页面, 而不是都跳转到BackendBlogList

      // 默认跳转页面
      let redirectRouteName = 'BackendBlogList'

      // 获取当前页面的Location参数, 使用router.currentRoute
      const { redirect, ...othersQuery } = router.currentRoute.value.query
      let redirectRouteQuery = othersQuery
      if (redirect) {
        redirectRouteName = redirect.toString()
      }

      router.push({
        name: redirectRouteName,
        query: redirectRouteQuery
      })
    } catch (error) {
      // 被拦截器处理过后的error(字符串)
      console.log(error)
      // 反馈组件, 进行消息提醒
      Message.error({
        content: `认证失败: ${(error as Error).message}`,
        duration: 5000
      })
    } finally {
      // 请求结束，loading停止
      submitLoading.value = false
      loginButtonText.value = '登录'
    }
  }
}
</script>

<style lang="css" scoped>
.content {
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 100%;
  font-weight: 600;
  font-size: 20px;
}
</style>
