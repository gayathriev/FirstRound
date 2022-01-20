# DevOps

# Branches

-   The `master` branch will function as the **prod** environment
-   The `staging` branch will be the bleeding edge version of the web app
-   Build all features, namely pages on a separate branch, then merge into `experimental`

# Commits

-   All commit messages should follow the [conventional](https://www.conventionalcommits.org/en/v1.0.0/) commits structure:

```markdown
type(target): description
```

-   Examples are as follows

```markdown
refactor(web): moved button to shared components
```

```markdown
feat(api): added auth routes for users
```

```markdown
refactor(gloal): updated package.json
```

# Testing

Run all tests with:

```jsx
npm run test
```

Test web with

```jsx
npm run test-web
```

Test api with

```jsx
npm run test-api
```

# Project Structure Guidelines

```
.
├── docs
│   ├── devops.md
│   └── pull_request_template.md
├── lerna.json
├── package.json
├── packages
│   ├── api
│   └── web
└── README.md
```

## `api`

<!-- TODO -->

## `web`

-   src
    -   modules
        -   component
            -   `component.gql`
            -   `component.jsx`
            -   `component.css`
            -   `component.test.jsx`
        -   shared-components
            -   component
                -   `component.gql`
                -   `component.jsx`
                -   `component.css`
                -   `component.test.jsx`
    -   pages
        -   `dashboard.jsx`
-   tests
-   package.json
