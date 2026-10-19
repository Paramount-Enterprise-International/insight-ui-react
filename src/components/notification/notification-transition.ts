/** Retain the modal until its exit transition finishes, with a fallback for interrupted motion. */
export function waitForNotificationExit(
  panel: HTMLElement,
  exited: () => void
): () => void {
  const style = getComputedStyle(panel);
  const milliseconds = (value: string): number =>
    (parseFloat(value) || 0) * (value.trim().endsWith('ms') ? 1 : 1000);
  const durations = style.transitionDuration.split(',').map(milliseconds);
  const delays = style.transitionDelay.split(',').map(milliseconds);
  const duration = Math.max(
    0,
    ...durations.map((value, i) => value + delays[i % delays.length])
  );
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cancel = (): void => {
    cancelled = true;
    clearTimeout(timer);
    panel.removeEventListener('transitionend', ended);
  };
  const finish = (): void => {
    if (cancelled) return;
    cancel();
    exited();
  };
  const ended = (event: TransitionEvent): void => {
    if (event.target === panel && event.propertyName === 'transform') finish();
  };
  panel.addEventListener('transitionend', ended);
  if (duration > 0) timer = setTimeout(finish, duration + 50);
  else queueMicrotask(finish);
  return cancel;
}
