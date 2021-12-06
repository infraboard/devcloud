<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <el-descriptions :column="1" title="应用信息">
            <el-descriptions-item label="创建时间">{{
              app.create_at | parseTime("{y}-{m}-{d} {h}:{i}")
            }}</el-descriptions-item>
            <el-descriptions-item label="创建者">{{
              app.create_by
            }}</el-descriptions-item>
            <el-descriptions-item label="描述">{{
              app.description
            }}</el-descriptions-item>
            <el-descriptions-item label="来源">{{
              app.scm_type
            }}</el-descriptions-item>
            <el-descriptions-item label="项目 id">{{
              app.scm_project_id
            }}</el-descriptions-item>
            <el-descriptions-item label="Hook id">{{
              app.scm_hook_id
            }}</el-descriptions-item>
            <el-descriptions-item label="项目地址">
              <a :href="app.repo_http_url" target="_blank">
                {{ app.repo_http_url }} <a /></a
            ></el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card" shadow="never">
          <el-descriptions :column="1" title="流水线信息" />
          <span>{{ app.pipline_create_status }}</span>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "ApplicationBase",
  components: {},
  props: {
    app: {
      default() {
        return {};
      },
      type: Object,
    },
  },
  data() {
    return {};
  },
};
</script>
