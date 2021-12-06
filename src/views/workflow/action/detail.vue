<template>
  <div class="market_out">
    <div v-if="user">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="base">
          <span>测试</span>
        </el-tab-pane>
        <el-tab-pane lazy label="在线调试" name="debug">
          <span>测试</span>
        </el-tab-pane>
        <el-tab-pane label="关联应用" name="application">
          <span>测试</span>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "Profile",
  components: {},
  data() {
    return {
      user: {},
      activeTab: "base",
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(" | "),
        email: "admin@test.com",
        avatar: this.avatar,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.market_out ::v-deep .el-tabs__nav-wrap {
  padding: 0px 0px 0px 25px;
}
</style>
