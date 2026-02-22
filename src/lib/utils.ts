export function cn(...inputs: (string | boolean | undefined | null | { [key: string]: boolean })[]) {
  return inputs
    .flatMap((input) => {
      if (typeof input === 'string') return input;
      if (typeof input === 'object' && input !== null) {
        return Object.entries(input)
          .filter(([_, value]) => value)
          .map(([key, _]) => key);
      }
      return [];
    })
    .filter(Boolean)
    .join(' ');
}
