<template>
  <div class="app-container">
    <div class="title-row">
      <!-- 左侧box -->
      <div class="detail-left">
        <!-- 基础信息 -->
        <div class="box-shadow detail-basic">
          <el-descriptions title="用户信息">
            <template slot="extra">
              <div v-show="isEdit" class="fr">
                <el-button
                  type="text"
                  :loading="saveLoading"
                  size="mini"
                  @click="save"
                  >保存</el-button
                >
                <el-button type="text" size="mini" @click="cancel"
                  >取消</el-button
                >
              </div>
              <div v-show="!isEdit">
                <el-button
                  class="fr"
                  type="text"
                  size="mini"
                  @click="handleUpdate()"
                  >编辑</el-button
                >
              </div>
            </template>
            <el-descriptions-item label="账号">
              {{ user.account }}
            </el-descriptions-item>
            <el-descriptions-item label="头像">
              <span v-if="user.profile">{{ user.profile.avatar }}</span>
              <span v-else>上传</span>
            </el-descriptions-item>
            <el-descriptions-item label="性别">
              <div v-show="isEdit">
                <el-radio v-model="form.gender" label="MALE">男</el-radio>
                <el-radio v-model="form.gender" label="FEMALE">女</el-radio>
                <el-radio v-model="form.gender" label="UNKNOWN">保密</el-radio>
              </div>
              <div v-show="!isEdit">
                <span v-if="user.profile">{{ user.profile.gender }}</span>
                <span v-else>保密</span>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="昵称">
              <el-input
                v-show="isEdit"
                v-model="form.nick_name"
                maxlength="20"
                show-word-limit
                placeholder="用户昵称"
              />
              <span v-show="!isEdit">{{ user.profile.nick_name }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="姓名">
              <el-input
                v-show="isEdit"
                v-model="form.real_name"
                maxlength="20"
                show-word-limit
                placeholder="真实姓名"
              />
              <span v-show="!isEdit">{{ user.profile.real_name }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="电话">
              <el-input
                v-show="isEdit"
                v-model="form.phone"
                maxlength="20"
                show-word-limit
                placeholder="电话号码"
              />
              <span v-show="!isEdit">{{ user.profile.phone }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="邮箱">
              <el-input
                v-show="isEdit"
                v-model="form.email"
                maxlength="20"
                show-word-limit
                placeholder="邮箱地址"
              />
              <span v-show="!isEdit">{{ user.profile.email }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="城市">
              <el-input
                v-show="isEdit"
                v-model="form.city"
                maxlength="10"
                show-word-limit
                placeholder="省"
              />
              <span v-show="!isEdit">{{ user.profile.city }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="类型">
              <span>{{ user.type }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <span v-if="user.status" class="attr-value">{{
                user.status.locked
              }}</span>
              <span v-else>未知</span>
            </el-descriptions-item>
            <el-descriptions-item label="部门">
              <span class="attr-value">{{ user.department_id }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="过期时间">
              <span v-if="user.expires_days" class="attr-value">{{
                user.expires_days
              }}</span>
              <span v-else class="attr-value">永不过期</span>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ user.create_at | parseTime("{y}-{m}-{d} {h}:{i}") }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">
              {{ user.update_at | parseTime("{y}-{m}-{d} {h}:{i}") }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <!-- 右侧box -->
      <el-card class="box-card f12 detail-right" :style="rightStyle">
        <el-row :gutter="8">
          <span class="title">快捷操作</span>
        </el-row>
        <el-row :gutter="8" style="margin-top: 8px">
          <el-button style="margin-left: 22px">修改密码</el-button>
        </el-row>
      </el-card>
    </div>

    <el-card class="box-card" style="margin-top: 12px">
      <el-tabs v-model="activeName">
        <el-tab-pane lazy label="访问策略" name="first">
          <user-policy :account="account" />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      width="700px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="90px"
        style="margin-left: 50px; margin-right: 50px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="createLoading" @click="submit()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { DESCRIBE_SUB_ACCOUNT, UPDATE_SUB_ACCOUNT } from "@/api/keyauth/user";
import UserPolicy from "./components/UserPolicy.vue";

export default {
  name: "SubAccountDetail",
  components: { UserPolicy },
  directives: {},
  data() {
    return {
      saveLoading: false,
      isEdit: false,
      activeName: "first",
      tableKey: 0,
      queryLoading: {},
      user: {},
      createLoading: false,
      dialogFormVisible: false,
      dialogFormType: "create",
      form: {
        real_name: "",
        nick_name: "",
        phone: "",
        email: "",
        address: "",
        gender: "UNKNOWN",
        avatar: "",
        language: "",
        city: "",
        province: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入角色名称!", trigger: "change" },
        ],
      },
      rightStyle: {},
    };
  },
  computed: {
    dialogTitle() {
      return this.dialogFormType === "create" ? "新增空间" : "编辑空间";
    },
    account() {
      return this.$route.query.account;
    },
  },
  created() {
    this.getSubAccountDetail();
  },
  methods: {
    getSubAccountDetail() {
      this.queryLoading = this.$loading({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        target: ".app-main",
        body: true,
      });
      // 获取用户列表
      this.listPolicyQuery;
      DESCRIBE_SUB_ACCOUNT(this.account)
        .then((resp) => {
          this.user = resp.data;
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
    handleUpdate() {
      this.dialogFormType = "update";
      this.form = Object.assign({}, this.user.profile); // copy obj
      this.isEdit = true;
    },
    save() {
      this.saveLoading = true;
      console.log(this.form);
      UPDATE_SUB_ACCOUNT(this.account, this.form)
        .then((resp) => {
          this.user = resp.data;
          this.saveLoading = false;
          this.isEdit = false;
        })
        .catch(() => {})
        .finally(() => {
          this.saveLoading = false;
        });
    },
    cancel() {
      this.isEdit = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.title-row {
  display: -webkit-box;
}
.detail-left {
  width: 74%;
}
.detail-right {
  margin-left: 1%;
  width: 25%;
  border: 1px solid #e6ebf5;
}

.full-width {
  width: 330px;
}
</style>
