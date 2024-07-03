const REGEX_BLANK_PATTERN: RegExp = /^\s+$/g;

export function isStringBlank(string: string): boolean {
  return string === '' || REGEX_BLANK_PATTERN.test(string);
}
