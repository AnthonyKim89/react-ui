// On grid constants, see https://www.npmjs.com/package/react-grid-layout

// Screen width breakpoints in pixels. The names are arbitrary but match those
// in GRID_COLUMN_SIZES.
export const GRID_BREAKPOINTS = {
  large: 1024,
  medium: 512,
  small: 0
};

// How wide the grid is, in columns, for each of the supported screen sizes.
// The pixel sizes of columns are dynamic, based on current screen width.
export const GRID_COLUMN_SIZES = {
  large: 12,
  medium: 8,
  small: 1
};

// How many pixels high each "row" is in the grid.
// App heights are measured in rows. For height 5, height in pixels
// is 5 * GRID_ROW_HEIGHT. 
export const GRID_ROW_HEIGHT = 30;
