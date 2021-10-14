~async function () {
  const cp = require('child_process')
  const fs = require('fs').promises
  const path = require('path')

  const dirname = path.join(module.path, 'screenshots')
  await fs.rm(dirname, { force: true, recursive: true })
  await fs.mkdir(dirname)

  const selenium = cp.spawn("selenium-standalone start", { shell: true, stdio: 'pipe' })
  console.log("Selenium process id:", selenium.pid)

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
  })
}()
