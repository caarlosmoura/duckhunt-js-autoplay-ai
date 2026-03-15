import { Howl } from 'howler';

import barkDucks from '../assets/sounds/barkDucks.mp3';
import champ from '../assets/sounds/champ.mp3';
import gunSound from '../assets/sounds/gunSound.mp3';
import laugh from '../assets/sounds/laugh.mp3';
import loserSound from '../assets/sounds/loserSound.mp3';
import ohYeah from '../assets/sounds/ohYeah.mp3';
import quacking from '../assets/sounds/quacking.mp3';
import quak from '../assets/sounds/quak.mp3';
import sniff from '../assets/sounds/sniff.mp3';
import thud from '../assets/sounds/thud.mp3';

const soundFiles = {
  barkDucks,
  champ,
  gunSound,
  laugh,
  loserSound,
  ohYeah,
  quacking,
  quak,
  sniff,
  thud
};

class SoundManager {
  constructor(files) {
    this.sounds = Object.keys(files).reduce((collection, key) => {
      collection[key] = new Howl({
        src: [files[key]]
      });
      return collection;
    }, {});
    this.soundIds = new Map();
    this.listeners = {
      play: new Set(),
      stop: new Set(),
      end: new Set()
    };
  }

  play(name) {
    if (this.soundIds.has(name)) {
      const activeHowl = this.soundIds.get(name);
      activeHowl.play(name);
      this.emit('play', name);
      return name;
    }

    const howl = this.sounds[name];
    if (!howl) {
      return null;
    }

    const id = howl.play();
    this.soundIds.set(id, howl);
    howl.once('end', () => {
      this.soundIds.delete(id);
      this.emit('end', id);
    }, id);
    this.emit('play', id);
    return id;
  }

  stop(id) {
    if (id == null) {
      return;
    }

    const howl = this.soundIds.get(id);
    if (!howl) {
      return;
    }

    howl.stop(id);
    this.soundIds.delete(id);
    this.emit('stop', id);
  }

  pause(id) {
    if (id == null) {
      return;
    }

    const howl = this.soundIds.get(id);
    if (!howl) {
      return;
    }

    howl.pause(id);
  }

  mute(isMuted) {
    Object.keys(this.sounds).forEach((name) => {
      this.sounds[name].mute(isMuted);
    });
  }

  on(eventName, handler) {
    if (!this.listeners[eventName]) {
      return this;
    }

    this.listeners[eventName].add(handler);
    return this;
  }

  emit(eventName, payload) {
    if (!this.listeners[eventName]) {
      return;
    }

    this.listeners[eventName].forEach((handler) => {
      handler(payload);
    });
  }
}

const sound = new SoundManager(soundFiles);

export default sound;
