import { Profiler, ReactNode, ProfilerOnRenderCallback } from 'react';

interface ProfilerWrapperProps {
  id: string;
  children: ReactNode;
}

export function ProfilerWrapper({ id, children }: ProfilerWrapperProps) {
  const onRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    console.log(`[Profiler] ${id}:
      Phase: ${phase}
      Actual Duration: ${actualDuration.toFixed(2)}ms
      Base Duration: ${baseDuration.toFixed(2)}ms
      Start Time: ${startTime.toFixed(2)}ms
      Commit Time: ${commitTime.toFixed(2)}ms
    `);
  };

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
} 