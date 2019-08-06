import Vue from 'vue'
import defaultSound from '../../fixtures/default-sound.js'
import uuid from '../../../util/random/uuid.js'
import { cleanIfPresent } from '../../../util/sanitize.js'
import { toStr, toBool, toFiniteFloat } from '../../../util/conv.js'
import {
  ADD_SOUND,
  UPDATE_SOUND
} from '../../mutation-types.js'

export default {
  [UPDATE_SOUND] (sounds, { id, ...updatedProps }) {
    Vue.set(
      sounds,
      id,
      sanitizeSound({
        ...(sounds[id] || defaultSound()),
        ...updatedProps
      })
    )
  },
  [ADD_SOUND] (sounds, newSound) {
    const id = uuid()
    newSound = {
      ...defaultSound(),
      ...sanitizeSound(newSound)
    }
    Vue.set(sounds, id, newSound)
  }
}

function sanitizeSound (sound) {
  const sanitized = {
    // Make sure props have expected types
    name: toStr(sound.name),
    loop: toBool(sound.loop),
    speech: toStr(sound.speech),
    volume: toFiniteFloat(sound.volume),
    backoff: toFiniteFloat(sound.backoff)
    // any additional properties from the parameter are left out
  }

  if (typeof sound.file === 'string' && sound.file !== '') {
    // A file can be cleared by setting it to the empty string,
    // only set non-empty paths and data-URIs
    sanitized.file = sound.file
  } else if (typeof sound.file === 'object' && sound.file !== null) {
    // File objects are fine too
    sanitized.file = sound.file
  }

  return sanitized
}