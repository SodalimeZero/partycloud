<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" class="text">
    </div>
  </div>
</template>

<script>
import WangEditor from 'wangeditor'
import { onMounted, onBeforeUnmount, ref, reactive } from 'vue'

export default {
  name: 'App',
  setup () {
    const editor = ref()
    const content = reactive({
      html: '',
      text: ''
    })

    let instance
    onMounted(() => {
      instance = new WangEditor(editor.value)
      Object.assign(instance.config, {
        onchange () {
          console.log('change')
        }
      })
      instance.create()
    })

    onBeforeUnmount(() => {
      instance.destroy()
      instance = null
    })

    const syncHTML = () => {
      content.html = instance.txt.html()
    }

    return () => (
      <div>
      <div ref={editor}></div>
      <button onClick={syncHTML}>同步内容</button>
      <div innerHTML={content.html}></div>
      </div>
  )
  }
}

</script>

<style lang="css">
.editor {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 0;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  min-height: 500px;
}
</style>
