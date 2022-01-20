# First Round (web)

### ‣ [Quick Start](#quick-start)

### ‣ [Conventions](#conventions)

### ‣ [Working With GQL](#working-with-gql)

### ‣ [Theming](#theming)

### ‣ [Shared Components](#shared-components)

## Quick Start

1. To get started install packages with `npm install`
2. Now fire up the development server `npm run start`

## Conventions

We will follow the airbnb style guide for react [here](https://airbnb.io/javascript/react/).

The most important exerts from this guide however are included here.

### Component Naming

**Note: we don't do this well right now, we probably should since the repeated directory/file naming is confusing.**

Use the filename as the component name. For example, ReservationCard.jsx should have a reference name of ReservationCard. However, for root components of a directory, use index.jsx as the filename and use the directory name as the component name:

```javascript
// bad ---> HOWEVER --> in our case we currently do this
import Footer from './Footer/Footer';

// bad
import Footer from './Footer/index';

// good
import Footer from './Footer';
```

### Components / Function Syntax

We prefer to **always** use arrow function syntax for component definitions and the components internal functions. The following code snippet demonstrates this.

```javascript
// move single export to default export
const ComponentName = ({ propName }) => {
  const handelClick = () => {
    // internal function body
    return;
  };

  return (
    <>
        <div>Component Content</div>
        {/* Attribute definitions on new lines */}
        <button 
            type="button" 
            onCLick={handleClick}
        />
    </>
  );
};

ProfileBadge.propTypes = {
  propName: propTypes.string.isRequired,
};

// prefer default export for single
// export
export default ComponentName;
```

A good approach is to create a VS code snippet to just auto complete the boilerplate for you, mine is as follows:

```
    "React Component": {
        "scope": "javascript,typescript",
        "prefix": "component",
        "body": [
            "import React from 'react';",
            "",
            "",
            "const $1 = ($2) => {",
            "   return (",
            "       $3",
            "   )",
            "};",
            "",
            "",
            "",
            "export default $1;"
        ],
        "description": "Create a React component"
    },
```

**Note: mash tab to go to each section of the snippet you need to name.**

## Working With GQL

Taking to the backend looks quite different to the normal REST API setup with axios. We use Apollo client to abstract a lot of the logic.

There are three types of 'graphql queries':

- Mutations
- Queries
- Subscriptions

In React we create `query-name.gql.js` files to work with these query types, the three appear as follows.

```javascript
import { gql } from '@apollo/client';

/* query type */
export const QueryClassifier = gql`
  query QueryClassifier {
    queryName {
      returnField1
      returnField2
    }
  }
`;

/* simple mutation type */
export const MutationClassifier = gql`
  mutation MutationClassifier {
    mutationName
  }
`;

/* subscription type*/

// coming soon \\
```

Often we need to pass `variables`, or what are called 'fields' in the graphql ecosystem, to interact with the resource we want. In the `query-name.gql.js` we have the following variation on the syntax.

```javascript
import { gql } from '@apollo/client';

export const MutationClassifier = gql`
  mutation MutationClassifier($variableName: InputType!) {
    mutationName(variableName: $variableName) {
      returnField1
      returnField1Object {
        returnSubField
      }
    }
  }
`;
```

This is mirrored the same way for the other query types.

## Theming

Because we are using custom themes with semantic ui we need to use their build tools instead of react-scripts so `yarn start` and the other variants alias the `craco start, build, eject` scripts. _This takes awhile longer then react-scripts :(_.

To configure the theme use the `src/sematic-ui/globals/site.variables` for broad changes like the color (react = american) pallet. For other edits to specific refer to the [docs](https://semantic-ui.com/usage/theming.html) note these are for the non-react version of sematic because we are going bellow the react binding level.

Components should still be used as the [react-sematic-ui](https://react.semantic-ui.com/) docs dictate.

To save time on imports from semantic the following VS code snippet can be used.

```
    "Semantic Imports": {
        "scope": "javascript,typescript",
        "prefix": "semanticimport",
        "body": [
            "import { $1 } from 'semantic-ui-react';",
            "import 'semantic-ui-less/semantic.less';",
            "",
        ],
        "description": "Import a semantic UI component"
    },
```

# Shared Components

- Primary Button
- Secondary Button
