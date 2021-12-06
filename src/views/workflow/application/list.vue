<template>
  <div class="app-container">
    <div>
      <tips :tips="tips" />
    </div>

    <!-- 表格功能区 -->
    <div class="table-operate-zone">
      <div class="table-search">
        <el-input
          v-model="filterValue"
          class="input-with-select filter-search-input"
          clearable
          placeholder="按回车进行搜索"
          @clear="clearSearch"
          @keyup.enter.native="handleSearch"
        >
          <el-select slot="prepend" v-model="filterKey" placeholder="请选择">
            <el-option label="用户名" value="account" />
            <el-option label="部门" value="login_ip" />
            <el-option label="状态" value="login_city" />
          </el-select>
        </el-input>
      </div>
      <div class="table-operate">
        <el-button type="primary" size="mini" @click="handleCreateAction">
          导入应用
        </el-button>
      </div>
    </div>

    <div class="box-shadow">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="actionList"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="selection" width="45" align="center" />
        <el-table-column
          label="名称"
          prop="account"
          align="center"
          min-width="110"
        >
          <template slot-scope="{ row }">
            <router-link
              :to="`/workflow/application/${row.id}`"
              class="link-type"
            >
              <span>{{ row.name }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="WebHook设置"
          prop="scm_hook_id"
          align="center"
          min-width="110"
        >
          <template slot-scope="{ row }">
            <span v-if="row.scm_hook_id === ''"
              ><svg-icon icon-class="failed"
            /></span>
            <span v-else><svg-icon icon-class="normal" /></span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.create_at | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="account"
          align="center"
          min-width="110"
        >
          <template slot-scope="{ row }">
            <span>{{ row.create_by }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="标签"
          prop="account"
          align="center"
          min-width="110"
        >
          <template slot-scope="{ row }">
            <span>{{ row.tags }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="描述"
          prop="account"
          align="center"
          min-width="110"
        >
          <template slot-scope="{ row }">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="230">
          <template slot-scope="{ row, $index }">
            <el-button type="text" size="mini" @click="handleUpdate(row)"
              >编辑</el-button
            >
            <el-divider direction="vertical" />
            <el-button
              type="text"
              :loading="deleteLoading === row.id"
              size="mini"
              @click="handleDelete(row, $index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page_number"
        :limit.sync="listQuery.page_size"
        @pagination="getApplicationList"
      />
    </div>
    <create-action-drawer
      :visible.sync="dialogFormVisible"
      @change="updateApplicationList"
    />
  </div>
</template>

<script>
import {
  QUERY_APPLICATION,
  DELETE_APPLICATION,
} from "@/api/workflow/application";
import Pagination from "@/components/Pagination";
import CreateActionDrawer from "./create.vue";
import Tips from "@/components/Tips";

const tips = ["流程模版是将多条流水线组成一个模版, 方便应用快速使用"];

export default {
  name: "FlowList",
  components: { Pagination, CreateActionDrawer, Tips },
  data() {
    return {
      tips,
      filterKey: "account",
      filterValue: "",
      searchDepartmentLoading: false,
      departmentOptions: [],
      tableKey: 0,
      actionList: null,
      total: 0,
      createLoading: false,
      deleteLoading: "",
      listLoading: true,
      listQuery: {
        page_number: 1,
        page_size: 20,
        with_department: true,
      },
      dialogFormVisible: false,
    };
  },
  computed: {
    dialogTitle() {
      return this.dialogFormType === "create" ? "新增用户" : "编辑用户";
    },
  },
  created() {
    this.getApplicationList();
  },
  methods: {
    async getApplicationList() {
      this.listLoading = true;
      // 获取步骤列表
      try {
        const resp = await QUERY_APPLICATION(this.listQuery);
        this.actionList = resp.data.items;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getApplicationList();
    },
    clearSearch() {},
    handleCreateAction() {
      this.dialogFormVisible = true;
    },
    updateApplicationList() {
      console.log("update");
      this.getApplicationList();
    },
    handleUpdate(row) {
      this.dialogFormType = "update";
      this.form = Object.assign({}, row); // copy obj
      this.form.timestamp = new Date(this.form.timestamp);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    async handleDelete(row) {
      try {
        this.deleteLoading = row.id;
        await DELETE_APPLICATION(`${row.name}`);
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 2000,
        });
        this.getApplicationList();
      } catch (error) {
        this.$notify({
          title: "失败",
          message: `删除失败: ${error}`,
          type: "error",
          duration: 2000,
        });
      } finally {
        this.deleteLoading = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mall-actions {
  margin-left: 12px;
}

.app-container ::v-deep .el-select {
  width: 102px;
}
.app-container ::v-deep .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
