import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { SCENES } from './components/constants';
import { SceneIntro } from './components/SceneIntro';
import { SceneReveal } from './components/SceneReveal';
import { SceneActions } from './components/SceneActions';
import { SceneMoods } from './components/SceneMoods';
import { SceneOutro } from './components/SceneOutro';

export const BytepetVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={SCENES.intro.from}   durationInFrames={SCENES.intro.dur}   premountFor={30}>
        <SceneIntro />
      </Sequence>
      <Sequence from={SCENES.reveal.from}  durationInFrames={SCENES.reveal.dur}  premountFor={30}>
        <SceneReveal />
      </Sequence>
      <Sequence from={SCENES.actions.from} durationInFrames={SCENES.actions.dur} premountFor={30}>
        <SceneActions />
      </Sequence>
      <Sequence from={SCENES.moods.from}   durationInFrames={SCENES.moods.dur}   premountFor={30}>
        <SceneMoods />
      </Sequence>
      <Sequence from={SCENES.outro.from}   durationInFrames={SCENES.outro.dur}   premountFor={30}>
        <SceneOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
