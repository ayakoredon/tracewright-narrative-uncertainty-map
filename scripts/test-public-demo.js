const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);

if (!scriptMatch) throw new Error("Public demo inline script was not found.");

function element(id = "") {
  const classes = new Set();
  return {
    id,
    innerHTML: "",
    textContent: "",
    value: "",
    dataset: {},
    classList: {
      add: (...names) => names.forEach(name => classes.add(name)),
      remove: (...names) => names.forEach(name => classes.delete(name)),
      toggle: (name, force) => {
        if (force === undefined ? !classes.has(name) : force) classes.add(name);
        else classes.delete(name);
      }
    },
    addEventListener: () => {},
    closest: () => null,
    scrollIntoView: () => {}
  };
}

const ids = [...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]);
const elements = new Map(ids.map(id => [id, element(id)]));
const reviewPanels = ["summary", "claims", "evidence", "sources", "follow-up"].map(id => elements.get(id));

const documentStub = {
  querySelector(selector) {
    if (selector.startsWith("#")) return elements.get(selector.slice(1)) || null;
    return null;
  },
  querySelectorAll(selector) {
    if (selector === ".review-section") return reviewPanels;
    return [];
  },
  addEventListener: () => {}
};

const context = vm.createContext({
  console,
  document: documentStub,
  window: { setTimeout: () => {}, location: {} },
  CSS: { escape: value => String(value) },
  requestAnimationFrame: callback => callback()
});

vm.runInContext(scriptMatch[1], context, { filename: "index.html" });
const caseCount = vm.runInContext("cases.length", context);

for (let index = 0; index < caseCount; index += 1) {
  vm.runInContext(`
    selected = cases[${index}].id;
    renderList();
    renderHead();
    summary();
    claims();
    evidence();
    sources();
    followUp();
  `, context);

  for (const panel of reviewPanels) {
    if (!panel.innerHTML.trim()) throw new Error(`Case ${index + 1} left #${panel.id} empty.`);
  }
}

console.log(`Public demo rendered ${caseCount} cases across ${reviewPanels.length} review-map views.`);
