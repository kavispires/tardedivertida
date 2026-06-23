import dailySfxButtonFile from '@assets/sounds/daily-sfx-button.mp3';
import { Howl } from 'howler';

export const buttonCountdownSfx = new Howl({
  src: [dailySfxButtonFile],
  volume: 0.2,
  sprite: {
    normal: [0, 7000],
    quick: [7500, 11000],
    long: [12000, 22000],
  },
  // onend: () => alert('Sound finished playing'),
});

export const ButtonCountdownSfxNames = ['normal', 'quick', 'long'] as const;

type SFXTypes = 'normal' | 'quick' | 'long';

export const playCountdownSFX = (name: SFXTypes) => {
  // Stop any currently playing countdown sound first
  buttonCountdownSfx.stop();

  switch (name) {
    case 'normal':
      buttonCountdownSfx.play('normal');
      break;
    case 'quick':
      buttonCountdownSfx.play('quick');
      break;
    case 'long':
      buttonCountdownSfx.play('long');
      break;
  }
};

export const stopCountdownSFX = () => {
  buttonCountdownSfx.stop();
};
