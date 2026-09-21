import React from 'react';
import DotGridBackground from './DotGridBackground';

export default function BackgroundController({
  effect = 'dots',
  mode = 'pomodoro',
  mods = {
    enableRipple: true,
    enableRepulsion: true,
    enableIdleWave: true,
    enableColorTint: true,
  }
}) {
  if (effect === 'none') return null;

  return (
    <DotGridBackground
      mode={mode}
      enableRipple={mods?.enableRipple !== false}
      enableRepulsion={mods?.enableRepulsion !== false}
      enableIdleWave={mods?.enableIdleWave !== false}
      enableColorTint={mods?.enableColorTint !== false}
    />
  );
}
