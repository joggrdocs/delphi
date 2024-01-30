/**
 * Get input from the environment
 * 
 * @param {Node.env} env 
 * @param {string} name 
 * @returns 
 */
exports.getInput = function (env, name) {
  return env[name];
}

/**
 * Get multiline input from the environment
 * 
 * @param {Node.env} env 
 * @param {string} name 
 * @returns Array<string> 
 */
exports.getMultilineInput = function (env, name) {
  const input = getInput(env, name);
  return input ? input.filter(input => !!input).split("\n") : [];
};
