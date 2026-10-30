import fs from "node:fs";
import postcss from "postcss";
import prefix from "postcss-prefix-selector";
for (const kind of ["home", "inner"]) {
  const result = await postcss([
    prefix({
      prefix: `.${kind}-page`,
      transform(p, s, prefixed) {
        if (s === ":root") return p;
        if (s === "body") return p;
        if (s.startsWith("html.motion-off"))
          return s.replace("html.motion-off", `${p}.motion-off`);
        if (s.startsWith("body:")) return s.replace("body", p);
        return prefixed;
      },
    }),
  ]).process(fs.readFileSync(`src/styles/${kind}-original.css`, "utf8"), {
    from: undefined,
  });
  fs.writeFileSync(`src/styles/${kind}.css`, result.css);
}
