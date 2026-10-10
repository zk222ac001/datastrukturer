// Compile/run a standalone source in an isolated temporary directory.
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const { spawnSync } = require('node:child_process');
const assert = require('node:assert/strict');
const env = { ...process.env, DOTNET_CLI_TELEMETRY_OPTOUT: '1', DOTNET_NOLOGO: '1' };
const configs = {
  c: ['gcc', '--version', 'lesson.c'], cpp: ['g++', '--version', 'lesson.cpp'],
  python: ['python', '--version', 'lesson.py'], javascript: [process.execPath, '--version', 'lesson.js'],
  java: ['javac', '-version', 'Main.java'], csharp: ['dotnet', '--list-sdks', 'Program.cs']
};
function available(language) {
  const [exe, flag] = configs[language];
  const version = spawnSync(exe, [flag], { encoding: 'utf8', timeout: 10000, env });
  return version.status === 0 && (language !== 'csharp' || /^\d+\.\d+\.\d+/m.test(version.stdout)) ? version : null;
}
function execute(language, code, version = available(language)) {
  assert.ok(version, `${language} compiler/runtime unavailable`);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'codeviz-native-'));
  function run(exe, args) {
    const result = spawnSync(exe, args, { cwd: dir, encoding: 'utf8', env, timeout: 60000 });
    assert.equal(result.status, 0, `${exe}: ${result.error || result.stderr || result.stdout}`);
    return result.stdout.replaceAll('\r\n', '\n');
  }
  try {
    const [exe, , filename] = configs[language];
    fs.writeFileSync(path.join(dir, filename), code);
    if (language === 'c' || language === 'cpp') {
      const binary = path.join(dir, 'lesson' + (process.platform === 'win32' ? '.exe' : ''));
      run(exe, [language === 'c' ? '-std=c11' : '-std=c++17', '-Wall', '-Wextra', '-Werror', filename, '-o', binary]);
      return run(binary, []);
    }
    if (language === 'python' || language === 'javascript') return run(exe, [filename]);
    if (language === 'java') { run(exe, [filename]); return run('java', ['-cp', dir, 'Main']); }
    const sdk = version.stdout.match(/^(\d+)\.\d+\.\d+/m)[1];
    fs.writeFileSync(path.join(dir, 'Lesson.csproj'), `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net${sdk}.0</TargetFramework></PropertyGroup></Project>`);
    run('dotnet', ['build', 'Lesson.csproj', '--nologo', '-v', 'quiet']);
    return run('dotnet', [path.join(dir, 'bin', 'Debug', `net${sdk}.0`, 'Lesson.dll')]);
  } finally {
    assert.ok(path.resolve(dir).startsWith(path.resolve(os.tmpdir()) + path.sep + 'codeviz-native-'));
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
module.exports = { available, execute };
