import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const plan = JSON.parse(
  readFileSync(
    new URL("../.github/project-plan.json", import.meta.url),
    "utf8",
  ),
);
const dryRun = process.argv.includes("--dry-run");
if (dryRun) {
  console.log(JSON.stringify(plan, null, 2));
  process.exit(0);
}
function gh(args, json = true) {
  const output = execFileSync(
    "gh",
    json ? [...args, "--format", "json"] : args,
    { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
  );
  return json ? JSON.parse(output) : output;
}
// Preflight before any write. Existing Git proxy authentication may not include Projects access.
execFileSync("gh", ["api", "user", "--jq", ".login"], {
  stdio: ["ignore", "ignore", "inherit"],
});
const { projects } = gh([
  "project",
  "list",
  "--owner",
  plan.owner,
  "--limit",
  "100",
]);
let project = projects.find((p) => p.title === plan.title);
if (!project)
  project = gh([
    "project",
    "create",
    "--owner",
    plan.owner,
    "--title",
    plan.title,
  ]);
const number = String(project.number);
gh(
  ["project", "link", number, "--owner", plan.owner, "--repo", plan.repository],
  false,
);
gh(
  [
    "project",
    "edit",
    number,
    "--owner",
    plan.owner,
    "--description",
    plan.description,
  ],
  false,
);
const { fields } = gh(["project", "field-list", number, "--owner", plan.owner]);
const status = fields.find((f) => f.name === "Status");
if (!status)
  throw new Error(
    "The project needs a Status field before items can be populated.",
  );
const { items } = gh([
  "project",
  "item-list",
  number,
  "--owner",
  plan.owner,
  "--limit",
  "1000",
]);
for (const task of plan.items) {
  let item = items.find((i) => i.title === task.title);
  if (!item)
    item = gh([
      "project",
      "item-create",
      number,
      "--owner",
      plan.owner,
      "--title",
      task.title,
      "--body",
      task.body,
    ]);
  const option = status.options.find(
    (o) => o.name.toLowerCase() === task.status.toLowerCase(),
  );
  if (!option) throw new Error(`Missing Status option: ${task.status}`);
  gh(
    [
      "project",
      "item-edit",
      "--id",
      item.id,
      "--project-id",
      project.id,
      "--field-id",
      status.id,
      "--single-select-option-id",
      option.id,
    ],
    false,
  );
}
console.log(
  `Project prepared: ${project.url || `https://github.com/users/${plan.owner}/projects/${number}`}`,
);
