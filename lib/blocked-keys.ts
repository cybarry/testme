export const BLOCKED_KEYS = [
  'F12',
  'Control+Shift+I',
  'Control+Shift+J',
  'Control+Shift+C',
  'Control+Shift+K',
  'Control+U',
  'Control+P',
  'Cmd+Option+I',
  'Cmd+Shift+C',
  'Cmd+Option+U'
];

export const isBlocedKeyCombo = (event: KeyboardEvent): boolean => {
  const isCtrlShift = event.ctrlKey && event.shiftKey;
  const isCmdOption = event.metaKey && event.altKey;
  const isCtrlP = (event.ctrlKey || event.metaKey) && event.key === 'p';
  const isCmdP = event.metaKey && event.key === 'p';
  
  return (
    event.key === 'F12' ||
    (isCtrlShift && ['i', 'j', 'c', 'k'].includes(event.key)) ||
    (event.ctrlKey && event.key === 'u') ||
    (event.ctrlKey && event.key === 'p') ||
    (isCmdOption && ['i', 'u'].includes(event.key)) ||
    (event.metaKey && event.key === 'p')
  );
};
