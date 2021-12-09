export function clsx(
  classes: string | Record<string, boolean | undefined> | (string | Record<string, boolean | undefined>)[],
) {
  if (typeof classes === 'string') return classes;

  if (!Array.isArray(classes)) {
    const toBeClasses = Object.keys(classes)
      .map((key) => (classes[key] ? key : null))
      .filter((x) => x);
    return toBeClasses.join(' ');
  }

  return classes
    .map((el) => {
      if (typeof el === 'string') return el;
      return clsx(el);
    })
    .filter((x) => x)
    .join(' ');
}
