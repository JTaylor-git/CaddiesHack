<script>
  export let open = false;
</script>

<div class="drawer" class:open={open}>
  <slot />
</div>

<style>
.drawer {
  position: fixed;
  top: 0;
  right: -250px;
  width: 250px;
  height: 100%;
  background: #f4f4f4;
  transition: right 0.3s;
  padding: 1rem;
  overflow-y: auto;
}
.drawer.open {
  right: 0;
}
</style>
