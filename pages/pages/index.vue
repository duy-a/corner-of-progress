<script>
export default {
  middleware({ redirect }) {
    return redirect('301', '/')
  },
}
</script>
