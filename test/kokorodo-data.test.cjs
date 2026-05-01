const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')

const dataDir = path.join(__dirname, '..', 'src', 'assets', 'data', 'kokorodo')

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, fileName), 'utf8'))
}

function collectFrameMonsterReferences(frames) {
  return frames.flatMap(({ jobName, routes }) =>
    routes.flatMap(({ name: routeName, levels }) =>
      levels.flatMap(({ code, level, monsters }) =>
        monsters.map((monsterName) => ({
          monsterName,
          location: `${jobName} ${routeName}${level} (code: ${code})`
        }))
      )
    )
  )
}

test('frames.json が参照するモンスターは monsters.json に存在する', () => {
  const frames = readJson('frames.json')
  const monsters = readJson('monsters.json')

  const missingReferences = collectFrameMonsterReferences(frames)
    .filter(({ monsterName }) => !(monsterName in monsters))
    .map(({ monsterName, location }) => `${location}: ${monsterName}`)

  assert.deepEqual(missingReferences, [])
})
