<template>
  <div>
    <!-- 基础信息 -->
    <div class="box-shadow basic-info">
      <el-descriptions title="主机信息">
        <el-descriptions-item label="名称">
          {{ host.information.name }}
        </el-descriptions-item>
        <el-descriptions-item label="实例ID">
          {{ host.base.instance_id }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ host.information.status }}
        </el-descriptions-item>
        <el-descriptions-item label="规格">
          {{ host.describe.cpu }} / {{ host.describe.memory }}
        </el-descriptions-item>
        <el-descriptions-item label="厂商">
          {{ host.base.vendor }}
        </el-descriptions-item>
        <el-descriptions-item label="系统">
          {{ host.describe.os_name }}
        </el-descriptions-item>
        <el-descriptions-item label="地域">
          {{ host.base.region }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ host.base.create_at | parseTime }}
        </el-descriptions-item>
        <el-descriptions-item label="序列号">
          {{ host.describe.serial_number }}
        </el-descriptions-item>
        <el-descriptions-item label="过期时间">
          {{ host.information.expire_at | parseTime }}
        </el-descriptions-item>
        <el-descriptions-item label="同步时间">
          {{ host.base.sync_at | parseTime }}
        </el-descriptions-item>
        <el-descriptions-item label="同步账号">
          {{ host.information.sync_account }}
        </el-descriptions-item>
        <el-descriptions-item label="内网IP">
          {{ host.information.private_ip.join(",") }}
        </el-descriptions-item>
        <el-descriptions-item label="公网IP">
          {{ host.information.public_ip.join(",") }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- 关联信息 -->
    <el-card class="box-shadow associate-info">
      <el-tabs v-model="activeName">
        <el-tab-pane label="主机事件" name="event"> 主机事件 </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import { GET_HOST } from "@/api/cmdb/host";

export default {
  name: "HostDetail",
  data() {
    return {
      host: {},
      activeName: "event",
    };
  },
  async mounted() {
    try {
      let resp = await GET_HOST(this.$route.query.id);
      this.host = resp.data;
    } catch (error) {
      this.$notify.error({
        title: "获取主机异常",
        message: error,
      });
    }
  },
};
</script>

<style scoped>
.basic-info {
  padding: 20px;
  background-color: white;
}
.associate-info {
  margin-top: 12px;
}
</style>
