const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync('arrays-data.js', 'utf8'), sandbox);
const data = sandbox.window.ARRAYS_DATA;
const env = { ...process.env, DOTNET_CLI_TELEMETRY_OPTOUT: '1', DOTNET_NOLOGO: '1' };
function command(exe, args, cwd) {
  const result = spawnSync(exe, args, { cwd, encoding: 'utf8', timeout: 60000, env });
  assert.equal(result.status, 0, `${exe}: ${result.error || result.stderr || result.stdout}`);
  return result.stdout.replaceAll('\r\n', '\n');
}
const configurations = {
  cpp: { executable: 'g++', version: ['--version'], file: 'arrays.cpp', run(dir) { const binary = path.join(dir, 'arrays' + (process.platform === 'win32' ? '.exe' : '')); command('g++', ['-std=c++17', '-Wall', '-Wextra', '-Werror', path.join(dir, 'arrays.cpp'), '-o', binary], dir); return command(binary, [], dir); } },
  python: { executable: 'python', version: ['--version'], file: 'arrays.py', run: dir => command('python', [path.join(dir, 'arrays.py')], dir) },
  java: { executable: 'javac', version: ['-version'], file: 'Main.java', run(dir) { command('javac', ['Main.java'], dir); return command('java', ['-cp', dir, 'Main'], dir); } },
  javascript: { executable: process.execPath, version: ['--version'], file: 'arrays.js', run: dir => command(process.execPath, [path.join(dir, 'arrays.js')], dir) },
  csharp: { executable: 'dotnet', version: ['--list-sdks'], file: 'Program.cs', run(dir, version) {
    const sdk = version.stdout.match(/^(\d+)\.\d+\.\d+/m);
    fs.writeFileSync(path.join(dir, 'Arrays.csproj'), `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net${sdk[1]}.0</TargetFramework></PropertyGroup></Project>`);
    command('dotnet', ['build', 'Arrays.csproj', '--nologo', '-v', 'quiet'], dir);
    return command('dotnet', [path.join(dir, 'bin', 'Debug', `net${sdk[1]}.0`, 'Arrays.dll')], dir);
  } }
};
for (const [language, config] of Object.entries(configurations)) test(`Arrays ${language} sample prints its expected output`, { timeout: 120000 }, t => {
  const available = spawnSync(config.executable, config.version, { encoding: 'utf8', env, timeout: 10000 });
  if (available.status !== 0 || (language === 'csharp' && !/^\d+\.\d+\.\d+/m.test(available.stdout))) return t.skip(`${config.executable} toolchain is unavailable`);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'codeviz-arrays-'));
  try {
    fs.writeFileSync(path.join(dir, config.file), data.examples[language].code);
    assert.equal(config.run(dir, available), data.output);
  } finally {
    assert.ok(path.resolve(dir).startsWith(path.resolve(os.tmpdir()) + path.sep + 'codeviz-arrays-'));
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
