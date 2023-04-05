# Development Guidelines

This a description of all patterns, methods and architecture decisions, that should be followed by anyone working on the project.

`The work is in progress, so some of the things listed below might not be implemented in the app yet.`

## Folders structure

- `/src` - main folder for the app code.

  - `/components` - Reusable/shared components. All components in this folder must be global state (store) agnostic. Components might only operate with data and callbacks received as properties.

  - `/controllers` - Page- or component-specific controllers. Only controllers can directly access the global state (store) and/or dispatch actions.

  - `/models` - Model classes for data objects, e.g. Orders, Offers, etc. All data received from the DB must be inserted in a global store as Objects.

  - `/pages` - This folder contains pages components, also sometimes known as "views". Page is responsible for rendering the UI, all the heavy lifting processes, such as effects, must be done in controllers.

  - `/services` - This folder contains calls to external services, APIs, etc.

  - `/store` - Global state files (Redux store).

  - `/types` - Object types definitions.

  - `/utils` - Reusable functions, such as helpers, convertors, formatters, etc.

  - `App.tsx` - Must contain only global providers (like theme provider, router provider, store provider, etc) and/or top level routing.

  - `App.css` - Global CSS styles.

  - `index.tsx` - App entry point. Creates root and renders the App.

## Naming, exporting and files organiztion

### Components

Must contain an index file exporting all components.

Names of components must by in CamelCase format.

Each component in the folder must be wrapped in its own folder, called the same as the component (e.g. `/Button/Button.tsx`). Large components might be broken down to a smaller components (e.g. `/Card/Card.tsx` and `/Card/CardHeader.tsx`).

Each of such small, child component must be in the same dfolder as a parent component.

Child components can be used only withing the parent component.

### Models

Must contain an index file exporting all available models.

Names of models must by in CamelCase format.

Models are classes, named as simply as possible, e.g. `Order`, `Offer`, etc.

Model can contain methods specific to a data type, such as getting properties in a specific format, or checking if object meets some conditions.

### Pages

Names of pages must by in CamelCase format.

Each component must end with a word `Page`.

Same as components, each page must be wrapped in a folder called the same as the page, e.g. `/HomePage/HomePage.tsx`.

If a route has nested pages, they can be placed in the same folder, e.g. `/TradePage/TradePage.tsx` for `/trade` route and `/TradePage/TradeHistoryPage.tsx` for `/trade/history` route.

### Services

Must contain an index file exporting all services.

Services can be broken down to a files by its purposes or types, e.g. `offerServices` for API requests related to offers or `userServices` for user related requests.

Names of services must by in camelCase format, with lower first letter.

### Store

Contains everything Redux related.

### Types

Must contain an index file exporting all available types.

Names of types must by in CamelCase format.

Each data/object type file must end with a word `Type`, e.g. `OfferType`.

### Utils

Must contain an index file exporting all available utils.

Names of utilities must by in camelCase format, with lower first letter.

Each util function or a group of related utilities must be in a separate file.

## To be continued...
