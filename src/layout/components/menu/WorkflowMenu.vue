<template>
  <div>
    <el-menu
      default-active="/workflow/action"
      :default-openeds="['/workflow/action']"
      class="sidebar-el-menu"
      :collapse="isCollapse"
      router
    >
      <el-submenu index="/workflow/action">
        <!-- 添加个title -->
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">编排管理</span>
        </template>
        <!-- 导航条目 -->
        <el-menu-item index="/workflow/action/list">执行单元</el-menu-item>
      </el-submenu>

      <el-submenu index="/workflow/application">
        <!-- 添加个title -->
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">应用管理</span>
        </template>
        <!-- 导航条目 -->
        <el-menu-item index="/workflow/application/list">应用列表</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "CmdbMenu",
  props: {
    isCollapse: {
      required: true,
      type: Boolean,
    },
  },
};
</script>
