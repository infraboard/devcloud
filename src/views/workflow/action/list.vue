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
          新增单元
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
              :to="`/workflow/manage/action/${row.name}@${row.version}`"
              class="link-type"
            >
              <span>{{ row.name }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="运行方式"
          prop="account"
          align="center"
          min-width="110"
        >
          <template slot-scope="{ row }">
            <span>{{ row.runner_type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可见范围" min-width="150px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.visiable_mode }}</span>
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
        @pagination="getActionList"
      />
    </div>
    <create-action-drawer
      :visible.sync="dialogFormVisible"
      @change="updateActionList"
    />
  </div>
</template>

<script>
import { QUERY_ACTION, DELETE_ACTION } from "@/api/workflow/action";
import Pagination from "@/components/Pagination";
import CreateActionDrawer from "./create.vue";
import Tips from "@/components/Tips";

const tips = [
  "执行单元是流水线编排的最小单元, 可以将多个执行单元组成一条流水线",
];

export default {
  name: "ActionList",
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
    this.getActionList();
  },
  methods: {
    async getActionList() {
      this.listLoading = true;
      // 获取步骤列表
      try {
        const resp = await QUERY_ACTION(this.listQuery);
        this.actionList = resp.data.items;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getActionList();
    },
    clearSearch() {},
    handleCreateAction() {
      this.dialogFormVisible = true;
    },
    updateActionList() {
      this.getActionList();
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
        await DELETE_ACTION(`${row.name}@${row.version}`);
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 2000,
        });
        this.getActionList();
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
