```jsx
const data = `
How the Word Cloud Generator Works

The layout algorithm for positioning words without overlap is available on GitHub under an open source license as d3-cloud. Note that this is the only the layout algorithm and any code for converting text into words and rendering the final output requires additional development.

As word placement can be quite slow for more than a few hundred words, the layout algorithm can be run asynchronously, with a configurable time step size. This makes it possible to animate words as they are placed without stuttering. It is recommended to always use a time step even without animations as it prevents the browser’s event loop from blocking while placing the words.

The layout algorithm itself is incredibly simple. For each word, starting with the most “important”:

Attempt to place the word at some starting point: usually near the middle, or somewhere on a central horizontal line.
If the word intersects with any previously placed words, move it one step along an increasing spiral. Repeat until no intersections are found.
The hard part is making it perform efficiently! According to Jonathan Feinberg, Wordle uses a combination of hierarchical bounding boxes and quadtrees to achieve reasonable speeds.

Glyphs in JavaScript

There isn’t a way to retrieve precise glyph shapes via the DOM, except perhaps for SVG fonts. Instead, we draw each word to a hidden canvas element, and retrieve the pixel data.

Retrieving the pixel data separately for each word is expensive, so we draw as many words as possible and then retrieve their pixels in a batch operation.
`;

<WordCloud
  wordData={data}
  base={{
    width: 900,
    height: 500
  }}
></WordCloud>
```
