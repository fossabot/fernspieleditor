import { actions } from './sounds-actions'
import { getters } from './sounds-getters'
import { mutations } from './sounds-mutations'
import { PhonebookSubsetForSounds } from './sounds-phonebook-subset'
import { deserializeSounds } from './sounds-deserialize'

/**
 * Initialize the `vuex` module for sounds with the given initial data.
 *
 * @param {object} sounds initial map of UUIDs against sound objects
 * @returns {object} `vuex` module for sounds
 */
export default function createSoundModule (sounds: PhonebookSubsetForSounds) {
  return {
    state: deserializeSounds(sounds),
    actions,
    getters,
    mutations
  }
}
