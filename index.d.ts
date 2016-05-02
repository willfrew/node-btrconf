/*
 * load is generic over your config interface.
 * See the README for example usage.
 */
export function load<ConfigInterface>(filename: string): ConfigInterface;
