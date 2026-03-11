import { collection, config, fields, singleton } from "@keystatic/core";

const storageKind = (process.env.KEYSTATIC_STORAGE_KIND ?? "local") as "local" | "github";
const githubRepo =
  (process.env.KEYSTATIC_GITHUB_REPO as `${string}/${string}` | undefined) ?? ("global34/govcon-intel" as const);

export default config({
  storage:
    storageKind === "github"
      ? {
          kind: "github",
          repo: githubRepo,
          // Monorepo: content lives under `web/`.
          pathPrefix: process.env.KEYSTATIC_PATH_PREFIX ?? "web",
        }
      : {
          kind: "local",
        },
  singletons: {
    homepage: singleton({
      label: "Homepage",
      path: "src/content/site/homepage",
      schema: {
        heroEyebrow: fields.text({ label: "Hero eyebrow" }),
        heroHeadline: fields.text({ label: "Hero headline" }),
        heroCopy: fields.text({ label: "Hero paragraph", multiline: true }),
        primaryCtaLabel: fields.text({ label: "Primary CTA label" }),
        primaryCtaHref: fields.text({ label: "Primary CTA href" }),
        secondaryCtaLabel: fields.text({ label: "Secondary CTA label" }),
        secondaryCtaHref: fields.text({ label: "Secondary CTA href" }),
        heroImage: fields.image({
          label: "Hero image",
          directory: "public/uploads",
          publicPath: "/uploads",
        }),
      },
    }),
  },
  collections: {
    signals: collection({
      label: "Signals (Public Posts)",
      slugField: "title",
      path: "src/content/signals/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        date: fields.date({ label: "Publish Date", validation: { isRequired: true } }),
        summary: fields.text({ label: "Summary / Why it matters", multiline: true }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Opportunities", value: "opportunities" },
            { label: "Compliance", value: "compliance" },
            { label: "Teaming", value: "teaming" },
            { label: "Budget", value: "budget" },
            { label: "Vehicles", value: "vehicles" },
          ],
          defaultValue: "opportunities",
        }),
        content: fields.markdoc({ label: "Content" }),
      },
    }),
  },
});
