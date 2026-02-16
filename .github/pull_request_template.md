## Summary
<!-- Provide a brief description of what this PR does -->

## JIRA Ticket
<!-- Link to the JIRA ticket. Extract from your branch name: feature/CORE-1234-description -->
<https://saaslabs.atlassian.net/browse/XXXX-0000>

## Type of Change
<!-- Check the relevant option -->
- [ ] `feat` - New feature
- [ ] `fix` - Bug fix
- [ ] `perf` - Performance improvement
- [ ] `refactor` - Code refactoring (no functional changes)
- [ ] `docs` - Documentation only
- [ ] `test` - Adding or updating tests
- [ ] `chore` - Maintenance tasks
- [ ] `security` - Security fix

## Changes Made
<!-- List the key changes in this PR -->
-
-
-

## Test Plan
<!-- Describe how you tested these changes -->

### Unit Tests

- [ ] Added new unit tests
- [ ] Updated existing unit tests
- [ ] No unit tests needed (explain why)

### Integration Tests

- [ ] Added integration tests
- [ ] Updated integration tests
- [ ] No integration tests needed (explain why)

### End to End Tests

- [ ] Added new E2E tests
- [ ] Updated existing E2E tests
- [ ] No E2E tests needed (explain why)
- [ ] E2E tests pass locally
- [ ] Verified critical user flows work as expected

### Manual Testing
<!-- Describe the manual testing performed -->
1.
2.
3.

## API Changes
<!-- If this PR modifies APIs, include request/response examples -->
<details>
<summary>Click to expand API examples</summary>

**Endpoint:** `METHOD /api/v1/endpoint`

**Request:**

```json
{
  "example": "request"
}
```

**Response:**

```json
{
  "example": "response"
}
```

</details>

## Database Changes
<!-- Check if applicable -->
- [ ] No database changes
- [ ] New migration added
- [ ] Schema changes (describe below)
- [ ] Data migration required

<details>
<summary>Database change details</summary>

<!-- Describe schema changes, new tables, indexes, etc. -->

</details>

## Configuration & Deployment
<!-- Check all that apply -->
- [ ] No configuration changes required
- [ ] New environment variables added (list below)
- [ ] Feature flag required
- [ ] Config changes needed in deployment

<details>
<summary>Configuration details</summary>

| Variable | Description | Required In |
|----------|-------------|-------------|
| `ENV_VAR_NAME` | Description | staging, prod |

</details>

## Breaking Changes
<!-- Check one -->
- [ ] No breaking changes
- [ ] Contains breaking changes (describe below)

<details>
<summary>Breaking change details</summary>

**What breaks:**

**Migration path for consumers:**

</details>

## Rollback Plan
<!-- How to revert if issues arise in production -->
- [ ] Standard rollback (revert commit)
- [ ] Requires additional steps (describe below)

<details>
<summary>Rollback steps</summary>

1.
2.

</details>

## Pre-merge Checklist

- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Added/updated relevant documentation
- [ ] Added changeset (`pnpm changeset`)
- [ ] No new lint warnings introduced
- [ ] All CI checks pass

## Additional Notes
<!-- Any additional context, screenshots, or information -->
