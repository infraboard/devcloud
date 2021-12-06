<template>
  <div class="market_out" style="height: calc(100vh - 60px)">
    <div class="app-layout__header-title">
      <div class="app-justify-grid">
        <div>
          <svg-icon icon-class="back" @click="goBack" />
          <span class="title" style="margin-left: 16px">{{ app.id }}</span>
          <span style="margin-left: 8px">({{ app.name }})</span>
        </div>
      </div>
    </div>
    <div style="position: relative">
      <!-- <Add /> -->
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="base">
          <application-base :app="app" />
        </el-tab-pane>
        <el-tab-pane lazy label="应用部署" name="deploy">
          <application-deploy />
        </el-tab-pane>
        <el-tab-pane lazy label="流水线" name="flow" style="position: relative">
          <span>测试</span>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="application">
          <span>测试</span>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { DESCRIBE_APPLICATION } from "@/api/workflow/application";

import ApplicationBase from "./components/ApplicationBase.vue";
import ApplicationDeploy from "./components/ApplicationDeploy.vue";

export default {
  name: "Profile",
  components: { ApplicationBase, ApplicationDeploy },
  data() {
    return {
      activeTab: "base",
      app: {},
    };
  },
  computed: {},
  created() {
    this.getApp();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async getApp() {
      try {
        const resp = await DESCRIBE_APPLICATION(this.$route.params.id);
        this.app = resp.data;
      } catch (error) {
        console.log(error);
      }
    },
    handleSelect(pipeline) {
      this.app.pipelines = pipeline;
    },
  },
};
</script>

<style lang="scss" scoped>
.market_out ::v-deep .el-tabs__nav-wrap {
  padding: 0px 25px;
}

.market_out ::v-deep .el-tabs__header {
  margin: 0px 0px;
}
</style>
