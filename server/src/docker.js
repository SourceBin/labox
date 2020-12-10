const { promisify } = require('util');
const { randomBytes } = require('crypto');
const child_process = require('child_process');

const spawn = child_process.spawn;
const exec = promisify(child_process.exec);

const IMAGE_NAME = 'labox';
const TIMEOUT = 15 * 1000;

module.exports.exec = function (
  cmd,
  stdin,
  {
    net = 'none',
    cpus = 1,
    memory = '250m',
    name = randomBytes(5).toString('hex'),
  } = {}
) {
  return new Promise((resolve, reject) => {
    const args = [
      'run',
      '--rm',
      '-i',
      `--net=${net}`,
      `--cpus=${cpus}`,
      `--memory=${memory}`,
      `--name=${name}`,
      IMAGE_NAME,
    ];

    // Start container
    const container = spawn('docker', args.concat(cmd));

    // Set timeout
    const timeout = setTimeout(async () => {
      await exec(`docker kill ${name}`);

      reject(new Error('timeout'));
    }, TIMEOUT);

    // Write stdin to container
    container.stdin.write(stdin);
    container.stdin.end();

    // Handle stdout
    const stdout = [];
    container.stdout.on('data', (chunk) => stdout.push(chunk));

    // Handle stderr
    const stderr = [];
    container.stderr.on('data', (chunk) => stderr.push(chunk));

    // Handle error
    container.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    // Handle exit
    container.on('exit', (code) => {
      clearTimeout(timeout);
      resolve({
        code,
        stdout: Buffer.concat(stdout).toString(),
        stderr: Buffer.concat(stderr).toString(),
      });
    });
  });
};

module.exports.run = function (language, executor, code, opts) {
  return module.exports.exec(
    ['bash', 'run.sh', language, executor],
    code,
    opts
  );
};

module.exports.format = function (language, code, opts) {
  return module.exports.exec(['bash', 'format.sh', language], code, opts);
};
