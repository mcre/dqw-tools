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

function createQuestRange(chapter, start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => `${chapter}章${start + index}話`)
}

function concatQuestRanges(...ranges) {
  return ranges.flatMap(([chapter, start, end]) => createQuestRange(chapter, start, end))
}

function findFrame(frames, jobName, routeName, level) {
  const job = frames.find(({ jobName: name }) => name === jobName)
  const route = job?.routes.find(({ name }) => name === routeName)
  return route?.levels.find(({ level: frameLevel }) => frameLevel === level)
}

test('frames.json が参照するモンスターは monsters.json に存在する', () => {
  const frames = readJson('frames.json')
  const monsters = readJson('monsters.json')

  const missingReferences = collectFrameMonsterReferences(frames)
    .filter(({ monsterName }) => !(monsterName in monsters))
    .map(({ monsterName, location }) => `${location}: ${monsterName}`)

  assert.deepEqual(missingReferences, [])
})

test('frames.json に最新のこころ道一致モンスターが反映されている', () => {
  const frames = readJson('frames.json')
  const expectedLatestRouteMatches = [
    { jobName: 'ゴッドハンド', routeName: '守護道', level: 2, monsterNames: ['エルダーフレイム'] },
    { jobName: 'ゴッドハンド', routeName: '守護道', level: 4, monsterNames: ['メタルハンド'] },
    { jobName: 'ゴッドハンド', routeName: '武道', level: 10, monsterNames: ['ヘルミラージュ'] },
    { jobName: '大魔道士', routeName: '理力道', level: 4, monsterNames: ['サウルスロード'] },
    { jobName: '大神官', routeName: '祈道', level: 7, monsterNames: ['アイアンナイト'] },
    { jobName: 'ニンジャ', routeName: '風道', level: 2, monsterNames: ['アイアンナイト'] },
    { jobName: 'ニンジャ', routeName: '風道', level: 8, monsterNames: ['ヘルガイオン'] },
    { jobName: 'ニンジャ', routeName: '波道', level: 4, monsterNames: ['シャドーノーブル'] },
    { jobName: '魔剣士', routeName: '魔道', level: 9, monsterNames: ['アイアンナイト', '巨匠もじゃらきラクーン'] },
    { jobName: '魔剣士', routeName: '刃道', level: 8, monsterNames: ['かぐわシイタケ', 'ブラックルーン'] },
    { jobName: '守り人', routeName: 'まもり道', level: 6, monsterNames: ['かぐわシイタケ', 'ブラックルーン'] },
    { jobName: '守り人', routeName: 'まもり道', level: 8, monsterNames: ['マージマタンゴ'] },
    { jobName: 'ドラゴン', routeName: '人道', level: 9, monsterNames: ['ギリメカラ'] },
    { jobName: '魔人', routeName: '超魔道', level: 6, monsterNames: ['キラーデーモン'] }
  ]

  for (const { jobName, routeName, level, monsterNames } of expectedLatestRouteMatches) {
    const frame = findFrame(frames, jobName, routeName, level)

    assert.ok(frame, `${jobName} ${routeName}${level} が見つかりません`)
    for (const monsterName of monsterNames) {
      assert.ok(frame.monsters.includes(monsterName), `${jobName} ${routeName}${level}: ${monsterName}`)
    }
  }
})

test('monsters.json に最新こころ道モンスターの検索用メタデータがある', () => {
  const monsters = readJson('monsters.json')
  const expectedLatestMonsters = {
    エルダーフレイム: {
      color: '紫',
      cost: 149,
      frequency: 'よく',
      quests: concatQuestRanges([15, 5, 10], [16, 1, 4]),
      limitedTimeEvents: [],
      condition: null
    },
    マージマタンゴ: {
      color: '緑',
      cost: 168,
      frequency: 'とても',
      quests: createQuestRange(18, 1, 10),
      limitedTimeEvents: [],
      condition: null
    },
    シャドーノーブル: {
      color: '赤',
      cost: 168,
      frequency: 'よく',
      quests: createQuestRange(18, 1, 10),
      limitedTimeEvents: [],
      condition: null
    },
    メタルハンド: {
      color: '青',
      cost: 84,
      frequency: 'あまり',
      quests: createQuestRange(18, 1, 10),
      limitedTimeEvents: [],
      condition: null
    },
    ブラックルーン: {
      color: '紫',
      cost: 170,
      frequency: 'ときどき',
      quests: createQuestRange(18, 3, 10),
      limitedTimeEvents: [],
      condition: null
    },
    アイアンナイト: {
      color: '青',
      cost: 171,
      frequency: 'よく',
      quests: createQuestRange(18, 5, 10),
      limitedTimeEvents: [],
      condition: null
    },
    ヘルミラージュ: {
      color: '黄',
      cost: 173,
      frequency: 'ときどき',
      quests: createQuestRange(18, 7, 10),
      limitedTimeEvents: [],
      condition: null
    },
    サウルスロード: {
      color: '黄',
      cost: 174,
      frequency: 'とても',
      quests: createQuestRange(18, 9, 10),
      limitedTimeEvents: [],
      condition: null
    },
    ヘルガイオン: {
      color: '黄',
      cost: 161,
      frequency: null,
      quests: [],
      limitedTimeEvents: ['メガモン'],
      condition: null
    },
    キラーデーモン: {
      color: '赤',
      cost: 165,
      frequency: null,
      quests: [],
      limitedTimeEvents: ['強敵', 'ほこら'],
      condition: null
    },
    ギリメカラ: {
      color: '赤',
      cost: 180,
      frequency: null,
      quests: [],
      limitedTimeEvents: ['宝の地図'],
      condition: null
    },
    巨匠もじゃらきラクーン: {
      color: '青',
      cost: 130,
      frequency: null,
      quests: [],
      limitedTimeEvents: ['メガモン'],
      condition: null,
      memo: 'もじゃらきラクーン覚醒後のみ対象'
    },
    かぐわシイタケ: {
      color: '紫',
      cost: 130,
      frequency: null,
      quests: [],
      limitedTimeEvents: ['メガモン'],
      condition: null,
      memo: 'あやシイタケ覚醒後のみ対象'
    }
  }

  for (const [monsterName, expectedMonster] of Object.entries(expectedLatestMonsters)) {
    assert.deepEqual(monsters[monsterName], expectedMonster, monsterName)
  }
})
