~async function () {
  const cp = require('child_process')
  const fs = require('fs').promises
  const path = require('path')

  const dirname = path.join(module.path, 'screenshots')
  await fs.rm(dirname, { force: true, recursive: true })
  await fs.mkdir(dirname)

  const selenium = cp.exec("selenium-standalone start", { shell: true, windowsHide: false })
  console.log("Selenium process id:", selenium.pid)
  selenium.unref()

  await new Promise(resolve => setTimeout(resolve, 3000))

  const hermione = cp.spawn("npm run hermione", { shell: true, stdio: 'inherit' })
  console.log("Hermione process id:", hermione.pid)
  hermione.on('close', code => process.exit(code))

  process.on('exit', () => {
    selenium.exitCode ?? selenium.kill()
    hermione.exitCode ?? hermione.kill()
  })
}()
