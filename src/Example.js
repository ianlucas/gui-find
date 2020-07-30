
import Vue from 'vue'
import GuiFind from './GuiFind'

new Vue({
  render: (h) => (
    h(GuiFind, {
      props: {
        value: true
      }
    })
  )
}).$mount('#app')
