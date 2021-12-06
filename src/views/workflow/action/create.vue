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
          label="运行方式"
          :label-width="formLabelWidth"
          prop="runner_type"
        >
          <el-radio-group v-model="form.runner_type" @change="choicedRunnper">
            <el-radio-button
              v-for="runner in runners"
              :key="runner.type"
              :label="runner.type"
            />
          </el-radio-group>
          <div class="input-tips">
            <span>执行的方式</span>
          </div>
        </el-form-item>
        <el-form-item
          v-for="param in runnerParams"
          :key="param.key_name"
          :required="param.required"
          :label-width="formLabelWidth"
          :label="param.key_desc"
        >
          <el-input v-model="param.default_value" />
          <div class="input-tips">
            <span>{{ param.value_desc }}</span>
          </div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="执行参数">
          <el-button type="primary" icon="el-icon-plus" @click="addValue"
            >添加参数</el-button
          >
          <div class="input-tips">
            <span
              >运行时的需要传人的参数说明, 其中名称推荐使用英文,
              而别名使用中文</span
            >
          </div>
          <el-table
            v-show="form.run_params.length > 0"
            :data="form.run_params"
            stripe
            empty-text=""
            style="width: 100%"
          >
            <el-table-column label="名称" width="120px" align="center">
              <template slot-scope="{ row }">
                <el-input v-model="row.key_name" />
              </template>
            </el-table-column>
            <el-table-column label="别名" width="120px" align="center">
              <template slot-scope="{ row }">
                <el-input v-model="row.key_desc" />
              </template>
            </el-table-column>
            <el-table-column label="默认值" width="180px" align="center">
              <template slot-scope="{ row }">
                <el-input v-model="row.default_value" />
              </template>
            </el-table-column>
            <el-table-column label="描述" align="center">
              <template slot-scope="{ row }">
                <el-input v-model="row.value_desc" />
              </template>
            </el-table-column>
            <el-table-column label="是否必须" width="80px" align="center">
              <template slot-scope="{ row }">
                <el-checkbox v-model="row.required" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60px" align="center">
              <template slot-scope="{ row, $index }">
                <el-button
                  style="color: #f56c6c"
                  type="text"
                  icon="el-icon-delete"
                  @click="deleteValue(row, $index)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item
          label="是否公开"
          :label-width="formLabelWidth"
          prop="description"
        >
          <el-radio-group v-model="form.visiable_mode">
            <el-radio-button label="NAMESPACE">空间内可见</el-radio-button>
            <el-radio-button label="GLOBAL">全局可见</el-radio-button>
          </el-radio-group>
          <div class="input-tips">
            <span>默认仅默认本空间可见, 如果公开则所有空间可见</span>
          </div>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" placeholder="" />
          <div class="input-tips">
            <span
              >执行单元名称, 任务编排时通过名称和版本来进行引用,
              比如k8sdeploy@v1, 其中k8sdeploy是名称, v1是版本</span
            >
          </div>
        </el-form-item>
        <el-form-item label="版本" :label-width="formLabelWidth" prop="version">
          <el-input v-model="form.version" placeholder="" />
          <div class="input-tips">
            <span>执行单元版本号, 为了避免升级而影响到原来版本</span>
          </div>
        </el-form-item>
        <el-form-item
          label="备注"
          :label-width="formLabelWidth"
          prop="description"
        >
          <el-input
            v-model="form.description"
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder=""
          />
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button
          type="primary"
          :loading="createActionLoading"
          @click="submit"
          >{{ createActionLoading ? "提交中 ..." : "确 定" }}</el-button
        >
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { QUERY_RUNNER, CREATE_ACTION } from "@/api/workflow/action";

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
      runners: [],
      runnerParams: [],

      table: false,
      dialog: false,
      createActionLoading: false,
      form: {
        runner_type: "DOCKER",
        runner_params: {},
        run_params: [],
        description: "",
        visiable_mode: "NAMESPACE",
      },
      formLabelWidth: "80px",
      rules: {
        name: [
          { required: true, message: "请输入执行单元名称", trigger: "change" },
        ],
        version: [
          { required: true, message: "请输入执行单元版本", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    visible: {
      handler: function (val) {
        this.dialog = val;
        if (val) {
          this.queryRunnerOptions();
          this.resetForm();
          this.$nextTick(() => {
            this.$refs["userForm"].clearValidate();
          });
        }
      },
      immediate: true,
    },
  },
  created() {
    this.queryRunnerOptions();
  },
  mounted() {},
  methods: {
    async queryRunnerOptions() {
      try {
        const resp = await QUERY_RUNNER();
        this.runners = resp.data.items;
        this.choicedRunnper(this.form.runner_type);
      } catch (error) {
        console.log(error);
      }
    },
    choicedRunnper(runner) {
      this.runners.forEach((item) => {
        if (item.type === runner) {
          this.runnerParams = item.param_desc;
        }
      });
    },
    addValue() {
      this.form.run_params.push({
        required: false,
        key_name: "",
        key_desc: "",
        default_value: "",
        value_desc: "",
      });
    },
    deleteValue(row, index) {
      this.form.run_params.splice(index, 1);
    },
    handleClose() {
      if (this.createActionLoading) {
        return;
      }
      this.createActionLoading = false;
      this.dialog = false;
      this.$emit("update:visible", false);
    },
    cancelForm() {
      this.createActionLoading = false;
      this.dialog = false;
      this.$emit("update:visible", false);
    },
    resetForm() {
      this.form = {
        runner_type: "DOCKER",
        runner_params: {},
        run_params: [],
        description: "",
        visiable_mode: "NAMESPACE",
      };
    },
    submit() {
      this.$refs["userForm"].validate(async (valid) => {
        if (valid) {
          try {
            this.createActionLoading = true;

            this.runnerParams.forEach((item) => {
              this.form.runner_params[item.key_name] = item.default_value;
            });
            const resp = await CREATE_ACTION(this.form);
            this.$notify({
              message: `创建[${resp.data}]成功`,
              customClass: "notify-success",
            });
            this.$refs.drawer.closeDrawer();
            this.$emit("update:visible", false);
            this.$emit("change", resp.data);
          } catch (error) {
            this.$notify({
              message: `创建失败: ${error}`,
              customClass: "notify-error",
            });
          } finally {
            this.createActionLoading = false;
          }
        }
      });
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
