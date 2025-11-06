export default function (eleventyConfig) {
  // Copy anything in /public to site root (css, images, etc.)
  eleventyConfig.addPassthroughCopy({ public: "/" });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
