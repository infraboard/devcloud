<template>
  <div class="app-container">
    <el-row>
      <el-card class="box-card">
        <el-row style="margin-bottom: 12px">
          <div class="fl">
            <el-radio-group v-model="env">
              <el-radio-button label="test">测试环境</el-radio-button>
              <el-radio-button label="dev">开发环境</el-radio-button>
              <el-radio-button label="demo">演示环境</el-radio-button>
              <el-radio-button label="online">生产环境</el-radio-button>
            </el-radio-group>
          </div>
          <div class="fr">
            <el-button type="primary" size="mini" @click="handleCreateAction">
              新增部署
            </el-button>
          </div>
        </el-row>
        <el-row>
          <el-row :gutter="20">
            <el-col v-for="item in deploys.items" :key="item.id" :span="8">
              <el-card
                class="box-card"
                shadow="never"
                style="background: #f2f2f2"
              >
                <el-row>
                  <div class="fl">
                    <span class="title">{{ item.name }}</span>
                  </div>
                  <div v-if="item.deploy_mode === 'HOST'" class="fr">
                    <svg-icon icon-class="host" />
                  </div>
                </el-row>

                <el-row class="f12" style="margin-top: 12px">
                  <div class="fl" style="width: 60px">创建时间:</div>
                  <div class="fl">
                    {{ item.create_at | parseTime("{y}-{m}-{d} {h}:{i}") }}
                  </div>
                  <div class="fr">{{ item.create_by }}</div>
                  <div class="fr" style="width: 60px">创建人:</div>
                </el-row>
                <!-- host模式显示 -->
                <div v-if="item.deploy_mode === 'HOST'">
                  <!-- 主机配置 -->
                  <el-row
                    v-for="host in item.host_deploy_config.hosts_ref"
                    :key="host"
                  >
                    <div class="f12" style="margin-top: 12px">
                      <div class="fl" style="margin-right: 8px">
                        <svg-icon icon-class="host-one" />
                      </div>
                      <div>
                        {{ host }}
                      </div>
                    </div>
                  </el-row>
                </div>

                <!-- host模式显示 -->
                <div v-if="item.deploy_mode === 'K8S'">
                  <!-- 主机配置 -->
                  <el-row
                    v-for="host in item.host_deploy_config.hosts_ref"
                    :key="host"
                  >
                    <div class="f12" style="margin-top: 12px">
                      <div class="fl" style="margin-right: 8px">
                        <svg-icon icon-class="host-one" />
                      </div>
                      <div>
                        {{ host }}
                      </div>
                    </div>
                  </el-row>
                </div>

                <!-- 操作栏 -->
                <div style="margin-top: 12px">
                  <el-row>
                    <div class="fl">
                      <a href=""><svg-icon icon-class="app-config" /></a>
                      <a href=""
                        ><svg-icon
                          style="margin-left: 14px"
                          icon-class="k8s-deploy"
                      /></a>
                      <a href=""
                        ><svg-icon
                          style="margin-left: 14px"
                          icon-class="k8s-service"
                      /></a>
                    </div>
                    <div class="fr">
                      <a href=""><svg-icon icon-class="detail-in" /></a>
                    </div>
                  </el-row>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { queryDeploy } from "@/api/workflow/deploy";

export default {
  name: "ApplicationDeploy",
  components: {},
  data() {
    return {
      env: "test",
      deploys: [],
    };
  },
  created() {
    this.getDeploy();
  },
  methods: {
    async getDeploy() {
      try {
        const resp = await queryDeploy();
        this.deploys = resp.data;
        console.log(resp);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
