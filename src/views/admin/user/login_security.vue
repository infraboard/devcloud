<template>
  <div class="app-container">
    <div>
      <el-card class="box-card f12">
        <el-row :gutter="8">
          <el-col :xs="12" :sm="12" :lg="12">
            <span class="title">域信息</span>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-button
              class="fr"
              type="text"
              size="mini"
              @click="handleUpdate(row)"
              >编辑</el-button
            >
          </el-col>
        </el-row>

        <el-row>
          <!-- 第一列 -->
          <el-col :xs="18" :sm="18" :lg="8">
            <el-row class="attr-row">
              <span class="attr-key">名称</span>
              <div class="attr-value">
                <span v-if="domain.display_name">{{
                  domain.display_name
                }}</span>
                <span>{{ domain.name }}</span>
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">LOGO</span>
              <div class="attr-value">
                <span v-if="domain.logo">{{ domain.logo }}</span>
                <span v-else> 上传 </span>
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">空间描述</span>
              <span class="attr-value">{{ domain.description }}</span>
            </el-row>
          </el-col>

          <!-- 第二列 -->
          <el-col :xs="18" :sm="18" :lg="8">
            <el-row class="attr-row">
              <span class="attr-key">状态</span>
              <div class="attr-value">
                <span v-if="domain.enabled"
                  ><svg-icon icon-class="normal"
                /></span>
                <span v-else><svg-icon icon-class="locked" /></span>
              </div>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">管理员</span>
              <span class="attr-value">{{ domain.owner }}</span>
            </el-row>
          </el-col>

          <!-- 第三列 -->
          <el-col :xs="18" :sm="18" :lg="8">
            <el-row class="attr-row">
              <span class="attr-key">创建时间</span>
              <span class="attr-value">{{
                domain.create_at | parseTime("{y}-{m}-{d} {h}:{i}")
              }}</span>
            </el-row>
            <el-row class="attr-row">
              <span class="attr-key">更新时间</span>
              <span class="attr-value">{{
                domain.update_at | parseTime("{y}-{m}-{d} {h}:{i}")
              }}</span>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <el-card class="box-card" style="margin-top: 12px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="登录安全" name="first">
          <security-setting :setting.sync="domain.security_setting" />
        </el-tab-pane>
        <el-tab-pane lazy label="LDAP设置" name="second">
          <ldap-setting />
        </el-tab-pane>
        <el-tab-pane lazy label="阿里钉钉" name="third" disabled>
          <ldap-setting />
        </el-tab-pane>
        <el-tab-pane lazy label="企业微信" name="four" disabled>
          <ldap-setting />
        </el-tab-pane>
        <el-tab-pane lazy label="飞书" name="five" disabled>
          <ldap-setting />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { GET_MY_DOMAIN } from "@/api/keyauth/profile";
import LdapSetting from "./components/LdapSetting";
import SecuritySetting from "./components/SecuritySetting";

export default {
  name: "DomainSetting",
  components: { LdapSetting, SecuritySetting },
  directives: {},
  data() {
    return {
      activeName: "first",
      tableKey: 0,
      domain: {},
      endpoints: [],
      total: 0,
      queryLoading: {},
      listQuery: {
        page_number: 1,
        page_size: 20,
      },
    };
  },
  computed: {
    dialogTitle() {
      return this.dialogFormType === "create" ? "新增服务" : "编辑服务";
    },
    serviceName() {
      return this.$route.params.id;
    },
  },
  created() {
    this.getServiceDetail();
  },
  methods: {
    getServiceDetail() {
      this.queryLoading = this.$loading({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        target: ".app-main",
        body: true,
      });
      // 获取用户列表
      GET_MY_DOMAIN()
        .then((resp) => {
          this.domain = resp.data;
        })
        .finally(() => {
          this.queryLoading.close();
        });
    },
    resetForm() {
      this.form = {
        name: "",
        description: "",
      };
    },
    handleCreate() {
      this.dialogFormType = "create";
      this.resetForm();
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    submit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.dialogFormType === "create") {
            // 新建
            this.createService();
          } else {
            // 更新
          }
        }
      });
    },
    handleUpdate(row) {
      this.dialogFormType = "update";
      this.form = Object.assign({}, row); // copy obj
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
  },
};
</script>
