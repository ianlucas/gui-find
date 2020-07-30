<template>
  <div
    v-show="value"
    class="gui-search"
    @mousedown.self.prevent
  >
    <GlobalEvents
      v-if="value"
      @keydown.esc="handleClose"
    />
    <input
      v-model="keyword"
      class="gui-search-input"
      type="text"
      @input="handleInput"
      @keydown.enter.prevent="moveCursor(1)"
    >
    <button
      class="gui-search-button"
      tabindex="-1"
      @click="handleClose"
    >
      <svg
        viewBox="0 0 413.348 413.348"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M413.348 24.354L388.994 0l-182.32 182.32L24.354 0 0 24.354l182.32 182.32L0 388.994l24.354 24.354 182.32-182.32 182.32 182.32 24.354-24.354-182.32-182.32z" />
      </svg>
    </button>
    <button
      :disabled="!elements.length"
      class="gui-search-button"
      tabindex="-1"
      @mousedown.left.prevent="moveCursor(1)"
    >
      <svg
        viewBox="0 0 551.13 551.13"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M275.565 361.679L51.668 137.783H0l275.565 275.565L551.13 137.783h-51.668z" />
      </svg>
    </button>
    <button
      :disabled="!elements.length"
      class="gui-search-button"
      tabindex="-1"
      @mousedown.left.prevent="moveCursor(-1)"
    >
      <svg
        viewBox="0 0 551.13 551.13"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M275.565 189.451l223.897 223.897h51.668L275.565 137.783 0 413.348h51.668z" />
      </svg>
    </button>
    <span
      class="gui-search-count"
      @mousedown.self.prevent
    >
      {{ displayedCursor }}/{{ elements.length }}
    </span>
  </div>
</template>

<style>
.gui-search-input {
  border: none;
  font-family: inherit;
  font-size: inherit;
  outline: none;
  width: 65%;
}

.gui-search {
  border: 1px solid #ccc;
  background-color: #fff;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: absolute;
  padding: 1em;
  right: 10px;
  top: 10px;
  width: 400px;
}

.gui-search-cursor {
  background-color: #f39439;
}

.gui-search-button {
  border: none;
  border-radius: 50%;
  background-color: transparent;
  height: 21px;
  margin-right: 5px;
  outline: none;
  width: 21px;
}

.gui-search-button:disabled {
  opacity: 0.5;
}

.gui-search-button:hover:not(:disabled) {
  background-color: #f1f1f1;
}

.gui-search-button:active:not(:disabled) {
  background-color: #dddddd;
}

.gui-search-button svg {
  height: 10px;
}

.gui-search-button:first-of-type {
  margin-right: 0;
}

.gui-search-count,
.gui-search-button {
  float: right;
}

.gui-search-count {
  margin-right: 10px;
}
</style>

<script>
import Mark from 'mark.js'
import GlobalEvents from 'vue-global-events'

const CURSOR_CLASS = 'gui-search-cursor'

export default {
  components: {
    GlobalEvents
  },

  props: {
    everywhere: {
      type: Boolean
    },

    value: {
      type: Boolean
    }
  },

  data: () => ({
    keyword: '',
    instance: null,
    context: null,
    elements: [],
    cursor: 0
  }),

  computed: {
    realContext () {
      return (
        this.everywhere
          ? document.body
          : this.context
      )
    },

    displayedCursor () {
      return (
        this.elements.length
          ? this.cursor + 1
          : 0
      )
    }
  },

  mounted () {
    this.context = this.$el.parentElement
    document.body.appendChild(this.$el)
  },

  methods: {
    mark (keyword) {
      if (!this.realContext) {
        return
      }
      if (this.instance) {
        this.instance.unmark()
      }
      this.instance = new Mark(this.realContext)
      this.instance.mark(keyword)
      this.elements = Array.from(
        this.realContext.querySelectorAll('mark')
      )
      this.setCursor(0)
    },

    handleInput (e) {
      this.mark(e.target.value)
    },

    setCursor (value) {
      const previous = this.cursor
      const previousElement = this.elements[previous]
      const currentElement = this.elements[value]

      if (previousElement) {
        previousElement.classList.remove(CURSOR_CLASS)
      }
      if (currentElement) {
        currentElement.classList.add(CURSOR_CLASS)
        currentElement.scrollIntoView(false)
      }

      this.cursor = value
    },

    moveCursor (direction) {
      const length = this.elements.length
      let next = this.cursor + direction

      if (!length) {
        return
      }

      if (next === length) {
        next = 0
      } else if (next < 0) {
        next = length - 1
      }

      this.setCursor(next)
    },

    handleClose () {
      this.$emit('input', false)
    }
  }
}
</script>
