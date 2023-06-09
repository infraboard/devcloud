<template>
  <div class="host-container">
    <tips :tips="tips" />
    <div class="table-op">
      <div class="search">
        <el-input
          v-model="query.keywords"
          placeholder="请输入实例ID|名称|IP 敲回车进行搜索"
          @keyup.enter.native="get_hosts"
        ></el-input>
      </div>
      <div class="op"></div>
    </div>
    <div class="box-shadow">
      <el-table :data="hosts" v-loading="fetchHostLoading" style="width: 100%">
        <el-table-column prop="name" label="名称">
          <template slot-scope="{ row }">
            <router-link
              :to="{ path: '/cmdb/host/detail', query: { id: row.base.id } }"
            >
              {{ row.base.instance_id }}
            </router-link>
            <br />
            {{ row.information.name }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="资产来源">
          <template slot-scope="{ row }">
            {{ row.base.vendor }} <br />
            {{ row.base.region }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="内网IP/外网IP">
          <template slot-scope="{ row }">
            {{ row.information.private_ip }} <br />
            {{ row.information.public_ip }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="系统类型">
          <template slot-scope="{ row }">
            {{ row.describe.os_name }}
          </template>
        </el-table-column>
        <el-table-column prop="sync_at" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.base.create_at | parseTime }}
          </template>
        </el-table-column>
        <el-table-column prop="expire_at" label="过期时间">
          <template slot-scope="scope">
            {{ scope.row.information.expire_at | parseTime }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="规格">
          <template slot-scope="{ row }">
            {{ row.describe.cpu }} / {{ row.describe.memory }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="状态">
          <template slot-scope="{ row }">
            {{ row.information.status }}
          </template>
        </el-table-column>
        <el-table-column prop="操作" align="center" label="状态">
          <template>
            <el-button type="text" disabled>归档</el-button>
            <el-button type="text" disabled>监控</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.page_number"
        :limit.sync="query.page_size"
        @pagination="get_hosts"
      />
    </div>
  </div>
</template>

<script>
import Tips from "@/components/Tips";
import Pagination from "@/components/Pagination";
import { LIST_HOST } from "@/api/cmdb/host.js";

const tips = ["现在仅同步了阿里云主机资产"];

export default {
  name: "CmdbHost",
  components: { Tips, Pagination },
  data() {
    return {
      tips: tips,
      query: {
        page_size: 20,
        page_number: 1,
        keywords: "",
      },
      fetchHostLoading: false,
      total: 0,
      hosts: [],
    };
  },
  created() {
    this.get_hosts();
  },
  methods: {
    async get_hosts() {
      this.fetchHostLoading = true;
      try {
        const resp = await LIST_HOST(this.query);
        this.hosts = resp.data.items;
        this.total = resp.data.total;
      } catch (error) {
        this.$notify.error({
          title: "获取主机异常",
          message: error,
        });
      } finally {
        this.fetchHostLoading = false;
      }
    },
    handleSizeChange(val) {
      this.query.page_size = val;
      this.get_hosts();
    },
    handleCurrentChange(val) {
      this.query.page_number = val;
      this.get_hosts();
    },
  },
};
</script>

<style lang="scss" scoped>
.box-shadow {
  margin: 12px 0;
}

.table-op {
  margin-top: 12px;
}

.search {
  width: 30%;
}
</style>
