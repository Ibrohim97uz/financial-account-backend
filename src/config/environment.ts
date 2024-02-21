export function GetCurrentEnvironmentPath(): string {
  console.log('env', process.env.NODE_ENV);

  return process.env.NODE_ENV?.startsWith('production')
    ? '.production.env'
    : '.development.env';
}
