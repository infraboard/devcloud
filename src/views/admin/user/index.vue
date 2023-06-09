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
        <el-button type="primary" size="mini" @click="handleCreateUser">
          新建用户
        </el-button>
      </div>
    </div>

    <div class="box-shadow">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="userList"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="selection" width="45" align="center" />
        <el-table-column
          label="用户名"
          prop="account"
          align="center"
          min-width="110"
        >
          <template slot-scope="{ row }">
            <router-link
              :to="{
                path: '/admin/user/detail',
                query: { account: row.account },
              }"
              class="link-type"
            >
              <span>{{ row.account }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="部门"
          prop="account"
          align="center"
          min-width="110"
        >
          <template slot-scope="{ row }">
            <div v-if="row.department">
              <router-link
                :to="'/user/department/' + row.department.id"
                class="link-type"
              >
                <span>{{ row.department.name }}</span>
              </router-link>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.create_at | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          align="center"
          min-width="110"
        >
          <template slot-scope="{ row }">
            <span v-if="row.status.locked"
              ><svg-icon icon-class="locked"
            /></span>
            <span v-else><svg-icon icon-class="normal" /></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="230">
          <template slot-scope="{ row, $index }">
            <el-button type="text" size="mini" @click="handleUpdate(row)"
              >编辑</el-button
            >
            <el-divider direction="vertical" />
            <el-button
              v-if="row.status.locked"
              type="text"
              size="mini"
              @click="handleLock(row)"
              >解冻</el-button
            >
            <el-button v-else type="text" size="mini" @click="handleUnLock(row)"
              >冻结</el-button
            >
            <el-divider direction="vertical" />
            <el-button
              type="text"
              :loading="deleteLoading === row.account"
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
        @pagination="getUserList"
      />
    </div>
    <create-account-drawer
      :visible.sync="dialogFormVisible"
      @change="updateAccountList"
    />
  </div>
</template>

<script>
import { QUERY_SUB_ACCOUNT, DELETE_SUB_ACCOUNT } from "@/api/keyauth/user";
import { QUERY_DEPARTMENT } from "@/api/keyauth/department";
import Pagination from "@/components/Pagination";
import CreateAccountDrawer from "@/components/ChoiceDepartment";
import Tips from "@/components/Tips";

const tips = ["用户可以将 邮箱地址/电话号码 作为用户名登录"];

export default {
  name: "SubAccount",
  components: { Pagination, CreateAccountDrawer, Tips },
  data() {
    return {
      tips,
      filterKey: "account",
      filterValue: "",
      searchDepartmentLoading: false,
      departmentOptions: [],
      tableKey: 0,
      userList: null,
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
    this.getUserList();
  },
  methods: {
    more() {},
    async getUserList() {
      this.listLoading = true;
      try {
        let resp = await QUERY_SUB_ACCOUNT(this.listQuery);
        this.userList = resp.data.items;
        this.total = resp.data.total;
      } catch (error) {
        this.$message.error(`${error}`);
      } finally {
        this.listLoading = false;
      }
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getUserList();
    },
    clearSearch() {},
    handleCreateUser() {
      this.dialogFormVisible = true;
    },
    updateAccountList() {
      this.getUserList();
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
    handleLock() {
      // 冻结用户
    },
    handleUnLock() {
      // 解除冻结用户
    },
    async handleDelete(row) {
      this.deleteLoading = row.account;
      try {
        let resp = await DELETE_SUB_ACCOUNT(row.account);
        console.log(resp);
        this.getUserList();
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 2000,
        });
      } catch (error) {
        this.$message.error(`${error}`);
      } finally {
        this.deleteLoading = "";
      }
    },
    async remoteSearchDepartment(keywords) {
      try {
        let resp = await QUERY_DEPARTMENT({ keywords });
        this.departmentOptions = resp.data.items;
      } catch (error) {
        this.$message.error(`${error}`);
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
