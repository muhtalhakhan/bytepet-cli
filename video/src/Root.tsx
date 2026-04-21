import React from 'react';
import { Composition } from 'remotion';
import { BytepetVideo } from './BytepetVideo';

export const Root: React.FC = () => {
  return (
    <Composition
      id="BytepetVideo"
      component={BytepetVideo}
      durationInFrames={600}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
