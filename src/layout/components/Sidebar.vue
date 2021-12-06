<template>
  <div class="sidebar" :style="{ width: sidebarWidth }">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <cmdb-menu :isCollapse="isCollapse" v-show="isSystem('cmdb')" />
      <admin-menu :isCollapse="isCollapse" v-show="isSystem('admin')" />
      <workflow-menu :isCollapse="isCollapse" v-show="isSystem('workflow')" />
    </el-scrollbar>
  </div>
</template>

<script>
import CmdbMenu from "./menu/CmdbMenu.vue";
import AdminMenu from "./menu/AdminMenu.vue";
import WorkflowMenu from "./menu/WorkflowMenu.vue";

export default {
  name: "Sidebar",
  components: {
    CmdbMenu,
    AdminMenu,
    WorkflowMenu,
  },
  data() {
    return {
      sidebarWidth: "",
    };
  },
  watch: {
    isCollapse: {
      handler(newV) {
        if (newV) {
          this.sidebarWidth = "65px";
        } else {
          this.sidebarWidth = "210px";
        }
      },
      immediate: true,
    },
  },
  computed: {
    isCollapse() {
      return this.$store.getters.sidebar.opened;
    },
  },
  methods: {
    isSystem(system) {
      return this.$store.getters.system === system;
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-el-menu {
  height: calc(100vh - 50px);
}

.sidebar {
  height: calc(100vh - 50px);
}
</style>
