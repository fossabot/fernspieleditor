<script>
import TransitionDialog from './transition-dialog.vue'
import SoundPicker from './sound-picker.vue'
import { data, computed, methods } from './inspector-logic'
export default {
  name: 'Inspector',
  components: {
    'transition-dialog': TransitionDialog,
    'sound-picker': SoundPicker
  },
  data,
  computed,
  methods
}
</script>

<template>
  <article class="auxiliary-editor inspector">
    <div
      v-if="nothingFocused"
      class="inspector-passive-msg"
    >
      <p>Click on a state to focus it.</p>
      <p>Double click to add a new state.</p>
      <p>Drag with your mouse to move.</p>
    </div>
    <div v-if="focusedState">
      <header>
        <h2>{{ focusedState.name }}</h2>
      </header>

      <div v-if="isAny(focusedStateId)">
        {{ focusedState.description }}
      </div>

      <div
        v-if="!isAny(focusedStateId)"
        class="inspector-properties"
      >
        <h3>Properties</h3>
        <input
          class="stack"
          placeholder="Name"
          maxlength="32"
          :value="focusedState.name"
          @blur="change($event, focusedStateId, 'name')"
          @keyup="change($event, focusedStateId, 'name')"
          @paste="change($event, focusedStateId, 'name')"
          @input="change($event, focusedStateId, 'name')"
        >
        <input
          class="stack"
          placeholder="Description"
          :value="focusedState.description"
          @blur="change($event, focusedStateId, 'description')"
          @keyup="change($event, focusedStateId, 'description')"
          @paste="change($event, focusedStateId, 'description')"
          @input="change($event, focusedStateId, 'description')"
        >
        <input
          class="stack"
          type="number"
          min="0"
          max="5"
          step="0.25"
          placeholder="Ring time"
          :value="focusedState.ring"
          @blur="change($event, focusedStateId, 'ring')"
          @keyup="change($event, focusedStateId, 'ring')"
          @paste="change($event, focusedStateId, 'ring')"
          @input="change($event, focusedStateId, 'ring')"
        >
        <label
          class="stack"
        >
          <span
            class="inspector-initial-button toggle button"
            :class="toggleActiveClass(isInitial(focusedStateId))"
          >Initial state</span>
          <input
            type="checkbox"
            :checked="isInitial(focusedStateId)"
            @input="setInitial($event)"
          >
        </label>
        <label
          class="stack"
        >
          <span
            class="inspector-terminal-button toggle button"
            :class="toggleActiveClass(focusedState.terminal)"
          >Terminal state</span>
          <input
            type="checkbox"
            :value="focusedState.terminal"
            @input="change($event, focusedStateId, 'terminal')"
          >
        </label>
      </div>

      <h3>Transitions</h3>
      <article
        v-for="transition in transitionSummariesWith(focusedStateId)"
        :key="`from-or-to-${transition.id}`"
        class="card"
      >
        <header>
          <div class="inspector-transition-summary flex two">
            <div class="inspector-transition-summary-text">
              <span v-text="transition.when"></span>
              <span v-if="transition.from === focusedStateId">
                to <span v-text="transition.toName"></span>
              </span>
              <span v-if="transition.to === focusedStateId">
                from <span v-text="transition.fromName"></span>
              </span>
            </div>
            <div class="inspector-modify-transition-btns">
              <button
                class="dangerous"
                @click="removeTransition(transition.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </header>
      </article>

      <transition name="slide">
        <transition-dialog
          v-if="addingTransition"
          :from="focusedStateId"
          @addtransitiondone="addingTransition = false"
        ></transition-dialog>
      </transition>

      <div class="inspector-add-transition-btns">
        <button
          :disabled="addingTransition"
          @click="addingTransition = true"
        >
          Add transition
        </button>
        <button
          :class="{ warning: addingTransition }"
          :disabled="!addingTransition"
          @click="addingTransition = false"
        >
          Cancel
        </button>
      </div>

      <div
        v-if="!isAny(focusedStateId)"
        class="inspector-properties"
      >
        <h3>Sounds</h3>
        <article>
          <sound-picker
            :picked="focusedState.sounds"
            @picked="change($event, focusedStateId, 'sounds')"
          ></sound-picker>
        </article>
      </div>

      <article
        v-if="!isAny(focusedStateId)"
        class="inspector-actions"
      >
        <header><h3>Danger Zone</h3></header>
        <footer>
          <button
            class="dangerous"
            @click="removeState(focusedStateId)"
          >
            Delete state
          </button>
        </footer>
      </article>
    </div>
  </article>
</template>

<style lang="scss">
@use "../../style/variables/colors";

$default-color: #0074d9;
$success-green: #2ecc40;
$error-red: #ff4136;

.inspector-passive-msg {
  margin-top: 4em;
  text-align: center;
  color: colors.$text-passive;
}

.inspector-add-transition-btns {
  text-align: center;
}

.inspector-transition-summary {
  align-items: center;
  justify-content: space-between;
}

.inspector-transition-summary-text {
  margin-top: -0.2em;
  padding-left: 0.5em;
}

.inspector-transition-summary-text,
.inspector-modify-transition-btns {
  padding-bottom: 0 !important;
}

.inspector-modify-transition-btns {
  text-align: right;
  flex-basis: 30%;
}

.inspector-actions {
  .dangerous {
    background-color: colors.$danger;
  }

  footer {
    text-align: center;
  }
}

.slide-enter-active, .slide-leave-active {
  transition: max-height 0.2s ease-in;
  max-height: 10em;
  overflow: hidden;
}
.slide-enter, .slide-leave-to {
  max-height: 0;
}

.inspector-initial-button,
.inspector-terminal-button {
  &.is-inactive {
    background-color: colors.$inactive;
  }
}

.inspector-initial-button {
  &.is-active {
    background-color: colors.$active;
  }
}

.inspector-terminal-button {
  &.is-active {
    background-color: colors.$active-alternate;
  }
}
</style>
