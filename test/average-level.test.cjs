const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')
const { parse, compileScript } = require('@vue/compiler-sfc')
const ts = require('typescript')
const vue = require('vue')

const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'average-level.vue'), 'utf8')
const { descriptor } = parse(source)
const script = compileScript(descriptor, { id: 'average-level-test' })
const { outputText } = ts.transpileModule(script.content, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
})
const componentExports = {}
new Function('require', 'exports', 'ref', 'computed', 'watch', 'tools', 'useHeaderUtil', outputText)(
  (name) => {
    if (name === 'vue') return vue
    if (name === '@unhead/vue') return { useHead: () => {} }
    if (name === '@mdi/js') return { mdiFootPrint: '', mdiShieldSwordOutline: '' }
    throw new Error(`Unexpected import: ${name}`)
  },
  componentExports,
  vue.ref,
  vue.computed,
  vue.watch,
  { 'average-level': { params: {} } },
  () => ({ getHead: () => ({}) })
)

function createTool(t) {
  const scope = vue.effectScope()
  t.after(() => scope.stop())
  return scope.run(() => componentExports.default.setup({}, { expose: () => {} }))
}

function findAverageSlider(node) {
  if (node.tag === 'v-slider' && node.props.some((prop) => prop.name === 'label' && prop.value?.content === '平均')) {
    return node
  }
  for (const child of node.children ?? []) {
    const slider = findAverageSlider(child)
    if (slider) return slider
  }
}

test('特級職Lv95を入力でき、基本職・上級職の上限も保つ', async (t) => {
  const tool = createTool(t)

  assert.equal(tool.maxLevel('basic'), 55)
  assert.equal(tool.maxLevel('advanced'), 90)
  assert.equal(tool.maxLevel('special'), 95)

  tool.members.value = Array.from({ length: 4 }, () => ({ levelType: 'special', level: 95 }))
  await vue.nextTick()
  assert.deepEqual(tool.members.value.map(({ level }) => level), [95, 95, 95, 95])
  assert.equal(tool.averageLevel.value, 140)
  assert.equal(tool.metal.value, 'メタルエンゼル')
})

test('平均バーの表示範囲が特級職4人の最大補正レベルを含む', (t) => {
  const tool = createTool(t)
  tool.members.value = Array.from({ length: 4 }, () => ({ levelType: 'special', level: tool.maxLevel('special') }))

  const slider = findAverageSlider(descriptor.template.ast)
  assert.ok(slider)
  const max = Number(slider.props.find(({ name }) => name === 'max')?.value?.content)
  assert.ok(max >= tool.averageLevel.value, `${tool.averageLevel.value} が平均バーの上限 ${max} を超えています`)
})

test('85の目盛りがメタルエンゼルへの出現境界を示す', (t) => {
  const tool = createTool(t)
  assert.ok(tool.tickLabels.includes(85))

  tool.members.value = [39, 40, 40, 40].map((level) => ({ levelType: 'special', level }))
  assert.equal(tool.averageLevel.value, 84.7)
  assert.equal(tool.metal.value, 'メタルつむり')

  tool.members.value = Array.from({ length: 4 }, () => ({ levelType: 'special', level: 40 }))
  assert.equal(tool.averageLevel.value, 85)
  assert.equal(tool.metal.value, 'メタルエンゼル')
})
