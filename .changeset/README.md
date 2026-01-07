# Changesets

This directory contains changeset files that document changes made to this package. Changesets are used to automatically generate changelogs and version bumps.

## How to use Changesets

### Creating a changeset

When you make changes that should be included in a release, create a changeset by running:

```bash
npm run changeset
```

This will prompt you to:
1. Select the type of change (patch, minor, or major)
2. Write a summary of the changes

The changeset file will be created in the `.changeset` directory.

### Versioning and releasing

1. **Version packages**: Run `npm run version` to:
   - Update package versions based on changesets
   - Generate/update CHANGELOG.md entries
   - Remove consumed changeset files

2. **Release**: Run `npm run release` to publish the package (requires npm publish permissions)

### Workflow

1. Make your code changes
2. Run `npm run changeset` to document the changes
3. Commit the changeset file along with your code changes
4. When ready to release, run `npm run version` to bump versions and update changelog
5. Review the generated changelog and version changes
6. Commit the version and changelog updates
7. Run `npm run release` to publish

## Changeset file format

Changeset files are markdown files with frontmatter. Example:

```markdown
---
"n8n-nodes-justcall": patch
---

Fixed a bug in the contact handler
```

The frontmatter specifies which packages are affected and the version bump type (patch/minor/major).

