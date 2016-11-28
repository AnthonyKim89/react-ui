# Organizing Styles

## CSS Frameworks

The project includes the [Boostrap](http://getbootstrap.com/) framework (version 3), so its CSS selectors may be used wherever needed.

The [React Bootstrap](https://react-bootstrap.github.io/) library is also included, which means there are React components available for most Bootstrap widgets. Using them is advisable whenever appropriate.

For iconography, the [font-awesome](http://fontawesome.io/) toolkit is available. It will be automatically applied to elements with the appropriate `fa` CSS classes attached.

Note: We do not yet have our own Bootstrap theme, but one should be created sooner or later to minimize the need for ad-hoc overriding of Bootstrap styles.

## File Organization

Place *globally applicable styles*, in the `.css` files under `./src`, such as `index.css` and `fonts.css`.

If you add a new file here, remember to import it into the app using an `@import` rule in `./src/index.css`. 

Place *component-specific styles* in a `Component.css` file next to the `.js` file (e.g. `Dashboard.css` for `Dashboard.js`), and then `import` it from the `.js` file.

## Selector Architecture

We're generally following the guidelines detailed in Brad Frost's ["CSS Architecture For Design Systems"](http://bradfrost.com/blog/post/css-architecture-for-design-systems/), which itself is based on [BEM](http://getbem.com/introduction/. We have a couple of exceptions to the rules:

* We do not use a global namespace prefix.
* We may need to divert from the naming scheme occasionally when overriding Bootstrap styles (though in the long term such overrides should be organized into a Bootstrap theme).