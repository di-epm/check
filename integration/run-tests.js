~async function () {
  const cp = require('child_process')
  const fs = require('fs').promises
  const path = require('path')

  const dirname = path.join(module.path, 'screenshots')
  await fs.rm(dirname, { force: true, recursive: true })
  await fs.mkdir(dirname)

  const i = process.argv.indexOf("spawn")
  const prcs = i === -1 ? [] : process.argv.slice(i + 1).map(cmd => {
    console.log("spawn", cmd)
    const p = cp.spawn(cmd, { shell: true, stdio: 'ignore' })
    p.unref()
    console.log("  id:", p.pid)
    return p
  })

  await new Promise(resolve => setTimeout(resolve, 5000))

  const selenium = cp.spawn("selenium-standalone start", { shell: true, stdio: 'pipe' })
  console.log("Selenium process id:", selenium.pid)

  selenium.stderr.pipe(process.stderr)

  await new Promise(resolve => {
    let log = ''

    selenium.stdout.on('data', chunk => {
      process.stdout.write(chunk)

      if ((log += chunk).includes('Selenium started')) {
        selenium.unref()
        resolve()
      } else if (log.length > 64) {
        log = log.slice(-64)
      }
    })
  })

  const hermione = cp.spawn("npm run hermione", { shell: true, stdio: 'inherit' })
  console.log("Hermione process id:", hermione.pid)
  hermione.on('close', code => process.exit(code))

  process.on('exit', () => {
    selenium.exitCode ?? selenium.kill()
    hermione.exitCode ?? hermione.kill()
    for (let p of prcs) p.kill()
  })
}()
