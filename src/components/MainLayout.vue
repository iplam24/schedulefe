<template>
  <div class="main-layout-wrapper">
    <header class="top-bar">
      <div class="breadcrumb">Trang chủ / Thời khóa biểu</div>
      <div class="version">v2.5 Stable</div>
    </header>

    <div class="layout-body">
      <slot></slot>
    </div>

    <footer class="bottom-bar">
      <p>© 2025 Green Calendar - Student Portal System</p>
      <div class="footer-links">
        <span>Hướng dẫn</span>
        <span>Hỗ trợ</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.main-layout-wrapper { display: flex; flex-direction: column; min-height: 100vh; width: 100%; }
.top-bar { 
  background: white; padding: 15px 40px; display: flex; justify-content: space-between; 
  border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 600; color: #94a3b8; 
}
.layout-body { flex: 1; display: flex; flex-direction: column; width: 100%; }
.bottom-bar { 
  background: white; padding: 20px 40px; display: flex; justify-content: space-between; 
  border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; 
}
@media (max-width: 992px) {
  .top-bar, .bottom-bar { padding: 15px 20px; }
  .footer-links { display: none; }
}
</style>