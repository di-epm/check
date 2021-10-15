~async function () {
  const cp = require('child_process')
  const fs = require('fs').promises
  const path = require('path')
  const util = require('util')

  const dirname = path.join(module.path, 'screenshots')
  await fs.rm(dirname, { force: true, recursive: true })
  await fs.mkdir(dirname)

  process.exitCode = 1

  function log(...args) {
    process.stdout.write(args.map(x => util.format(x)).join(" ") + "\n")
  }

  const i = process.argv.indexOf("spawn")
  const prcs = []

  if (i !== -1) {
    for (let q = i + 1; q < process.argv.length; q += 2) {
      let cmd = process.argv[q]
      let cwd = process.argv[q + 1]

      log("spawn: ", cmd)
      log("in:    ", cwd)

      const p = cp.spawn(cmd, { shell: true, stdio: 'ignore', cwd })
      p.unref()

      log("id:    ", p.pid)
      console.log()
      prcs.push(p)
    }
  }

  await new Promise(resolve => setTimeout(resolve, 5000))

  const selenium = cp.spawn("selenium-standalone start", { shell: true, stdio: 'pipe' })
  log("Selenium process id:", selenium.pid)

  selenium.stderr.pipe(process.stderr, { end: false })

  await new Promise(resolve => {
    let plog = ''

    selenium.stdout.on('data', chunk => {
      process.stdout.write(chunk)

      if ((plog += chunk).includes('Selenium started')) {
        // selenium.unref()
        log("=== resolved ===", plog)
        resolve()
      } else if (plog.length > 64) {
        plog = plog.slice(-64)
      }
    })
  })

  log("=== before run ===")
  const hermione = cp.spawn("npm run hermione", { shell: true, stdio: 'inherit' })
  log("Hermione process id:", hermione.pid)
  hermione.on('close', code => process.exit(code))

  process.on('exit', () => {
    selenium.exitCode ?? selenium.kill()
    hermione.exitCode ?? hermione.kill()
    // for (let p of prcs) p.kill()
  })
}()
