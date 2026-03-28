import { spawn } from 'child_process'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

execSync('node scripts/build.mjs', { cwd: root, stdio: 'inherit' })

const port = process.env.PORT || process.env.SERVER_PORT || '10914'
const serveMain = join(root, 'node_modules/serve/build/main.js')

spawn(
  process.execPath,
  [serveMain, 'dist', '-s', '-l', `tcp://0.0.0.0:${port}`],
  { cwd: root, stdio: 'inherit' },
).on('error', (err) => {
  console.error(err)
  process.exit(1)
})
