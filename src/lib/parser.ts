export function parseListInputs (buildArgs?: string): string[] {
  if (buildArgs) {
    return buildArgs.split(',');
  } else {
    return [];
  }
}
