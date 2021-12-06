<template>
  <el-drawer
    ref="drawer"
    :before-close="handleClose"
    :visible.sync="dialog"
    :show-close="false"
    :withHeader="false"
    size="80%"
  >
    <div class="drawer-content">
      <el-form ref="userForm" :model="form" :rules="rules">
        <el-form-item
          label="导入来源"
          :label-width="formLabelWidth"
          prop="scm_type"
        >
          <el-radio-group v-model="form.scm_type" @change="choicedRepoType">
            <el-radio-button label="gitlab">
              <svg-icon icon-class="gitlab" /> gitlab
            </el-radio-button>
            <el-radio-button label="github">
              <svg-icon icon-class="github" /> github
            </el-radio-button>
            <el-radio-button label="coding">
              <svg-icon icon-class="coding-net" /> coding
            </el-radio-button>
          </el-radio-group>
          <div class="input-tips">
            <span>代码仓库服务的类型</span>
          </div>
        </el-form-item>
        <el-form-item
          label="服务地址"
          :label-width="formLabelWidth"
          prop="scm_addr"
        >
          <el-input v-model="form.scm_addr" placeholder="" />
          <div class="input-tips">
            <span>仓库地址, 如果是私有仓库, 请修改成私有地址</span>
          </div>
        </el-form-item>
        <el-form-item
          label="访问令牌"
          :label-width="formLabelWidth"
          prop="token"
        >
          <el-input v-model="form.token" placeholder="" show-password />
          <div class="input-tips">
            <span
              >用于获取你仓库内的项目列表与设置WebHook,
              请务必确认权限是否ok</span
            >
          </div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="">
          <el-button
            type="primary"
            icon="el-icon-refresh"
            :loading="queryProjectLoading"
            :disabled="form.token.length === 0"
            @click="queryRepoProject"
            >获取项目</el-button
          >
          <el-table :data="projects" stripe empty-text="" style="width: 100%">
            <el-table-column label="名称" width="200px" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="描述" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.description }}</span>
              </template>
            </el-table-column>
            <el-table-column label="地址" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.http_url_to_repo }}</span>
              </template>
            </el-table-column>
            <el-table-column label="导入" width="120px" align="center">
              <template slot-scope="{ row, $index }">
                <el-switch
                  v-model="row.has_synced"
                  :disabled="row.has_synced"
                  :change="syncChanged(row, $index)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<script>
import {
  QUERY_REPO_PROJECT,
  CREATE_APPLICATION,
} from "@/api/workflow/application";

export default {
  name: "CreateActionDrawer",
  components: {},
  props: {
    visible: {
      default: false,
      type: Boolean,
    },
    departmentId: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      table: false,
      dialog: false,
      createApplicationLoading: false,
      form: {
        scm_type: "gitlab",
        scm_addr: "https://gitlab.com",
        token: "",
      },
      projects: [],
      queryProjectLoading: false,
      formLabelWidth: "80px",
      rules: {
        scm_addr: [
          {
            required: true,
            message: "请输入导入源仓库地址",
            trigger: "change",
          },
        ],
        token: [
          {
            required: true,
            message: "请输入用于获取应用列表的token",
            trigger: "change",
          },
        ],
      },
    };
  },
  watch: {
    visible: {
      handler: function (val) {
        this.dialog = val;
        if (val) {
          this.resetForm();
          this.$nextTick(() => {
            this.$refs["userForm"].clearValidate();
          });
        }
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    choicedRepoType(repoType) {
      switch (repoType) {
        case "gitlab":
          this.form.scm_addr = "https://gitlab.com";
          break;
        case "github":
          this.form.scm_addr = "https://github.com";
          break;
        case "coding":
          this.form.scm_addr = "https://coding.net";
          break;
      }
    },
    async queryRepoProject() {
      this.queryProjectLoading = true;
      try {
        const resp = await QUERY_REPO_PROJECT(this.form);
        this.projects = resp.data;
      } finally {
        this.queryProjectLoading = false;
      }
    },
    handleClose() {
      this.dialog = false;
      this.$emit("update:visible", false);
    },
    cancelForm() {
      this.dialog = false;
      this.$emit("update:visible", false);
    },
    resetForm() {
      this.form = {
        scm_type: "gitlab",
        scm_addr: "https://gitlab.com",
        token: "",
      };
      this.projects = [];
    },
    async syncChanged(row) {
      if (!row.has_synced || !this.visible) {
        return;
      }

      this.createApplicationLoading = true;
      try {
        const resp = await CREATE_APPLICATION({
          name: row.name,
          description: row.description,
          repo_ssh_url: row.ssh_url_to_repo,
          repo_http_url: row.http_url_to_repo,
          scm_type: this.form.scm_type,
          scm_project_id: row.id.toString(),
          scm_private_token: this.form.token,
        });
        this.$notify({
          message: `创建应用${resp.data.name}[${resp.data.description}]成功`,
          customClass: "notify-success",
        });
        this.$emit("change", resp.data);
      } catch (error) {
        this.$notify({
          message: `创建失败: ${error}`,
          customClass: "notify-error",
        });
      } finally {
        this.createApplicationLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-footer {
  text-align: center;
}
</style>
>
