"use strict";

const css = require("css");
const cssToReactNative = require("css-to-react-native").default;

const remToPx = (value) => `${parseFloat(value) * 16}px`;

const getStyles = (rule) => {
  const styles = rule.declarations
    .filter(({ property, value }) => {
      if (property.includes("--")) {
        return false;
      }

      if (value.includes("var")) {
        return false;
      }

      if (property === "line-height") {
        if (!value.endsWith("rem")) {
          return false;
        }
      }

      return true;
    })
    .map(({ property, value }) => {
      if (value.endsWith("rem")) {
        return [property, remToPx(value)];
      }

      return [property, value];
    });

  let style = {};
  let error = null;

  try {
    style = cssToReactNative(styles);
  } catch (err) {
    error = err;
  }

  return {
    style,
    error,
  };
};

const supportedUtilities = [
  // Flexbox
  /^flex/,
  /^items-/,
  /^content-/,
  /^justify-/,
  /^self-/,
  // Display
  "hidden",
  "overflow-hidden",
  "overflow-visible",
  "overflow-scroll",
  // Position
  "absolute",
  "relative",
  // Top, right, bottom, left
  /^(inset-0|inset-x-0|inset-y-0)/,
  /^(top|bottom|left|right)-0$/,
  // Z Index
  /^z-\d+$/,
  // Padding
  /^(p.?-\d+|p.?-px)/,
  // Margin
  /^-?(m.?-\d+|m.?-px)/,
  // Width
  /^w-(\d|\/)+|^w-px|^w-full/,
  // Height
  /^(h-\d+|h-px|h-full)/,
  // Min/Max width/height
  /^(min-w-|max-w-|min-h-0|min-h-full|max-h-full)/,
  // Font size
  /^text-/,
  // Font style
  /^(not-)?italic$/,
  // Font weight
  /^font/,
  // Letter spacing
  /^tracking-/,
  // Line height
  /^leading-/,
  // Text align, color
  /^text-/,
  // Text transform
  "uppercase",
  "lowercase",
  "capitalize",
  "normal-case",
  // Background color
  /^bg-/,
  // Border color, style, width, radius
  /^border(?!-current)/,
  /^rounded-/,
  // Opacity
  /^opacity-/,
  // Pointer events
  /^pointer-events-/,
  // box-shadow
  /^shadow-/,
];

const isUtilitySupported = (utility) => {
  for (const supportedUtility of supportedUtilities) {
    if (typeof supportedUtility === "string" && supportedUtility === utility) {
      return true;
    }

    if (supportedUtility instanceof RegExp && supportedUtility.test(utility)) {
      return true;
    }
  }

  return false;
};

function buildJson(source, logErrors) {
  const { stylesheet } = css.parse(source);
  const styles = {};
  let errors = [];
  for (const rule of stylesheet.rules) {
    if (rule.type === "rule") {
      for (const selector of rule.selectors) {
        const utility = selector.replace(/^\./, "").replace("\\/", "/");

        if (isUtilitySupported(utility)) {
          const { style, error } = getStyles(rule);
          styles[utility] = style;
          if (error) {
            errors.push(`Error: ${utility}: ${error.message}`);
          }
        }
      }
    }
  }

  // Additional styles that we're not able to parse correctly automatically
  styles.underline = { textDecorationLine: "underline" };
  styles["line-through"] = { textDecorationLine: "line-through" };
  styles["no-underline"] = { textDecorationLine: "none" };

  if (logErrors) {
    errors.map((error) => {
      console.log(error);
    });
  }

  return styles;
}

module.exports = buildJson;
