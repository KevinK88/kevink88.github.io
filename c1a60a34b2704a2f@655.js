// https://observablehq.com/@kevink88/csc196v-final-project@655
import define1 from "./450051d7f1174df8@201.js";
import define2 from "./7764a40fe6b83ca1@364.js";
import define3 from "./a2166040e5fb39a6@226.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`
# CSC196V - Final Project
\`\`\`
Sam Lee 
Hung Quach
Rigo Garcia Soto
\`\`\`
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
## Import helper function
`
)});
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  const child2 = runtime.module(define2);
  main.import("vl", child2);
  const child3 = runtime.module(define3);
  main.import("printTable", child3);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5", "d3-array@2")
)});
  const child4 = runtime.module(define3);
  main.import("uniqueValid", child4);
  main.variable(observer("vegalite")).define("vegalite", ["require"], function(require){return(
require("@observablehq/vega-lite@0.2")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
## Import dataset from URL so we can retrieve from the cloud. 
`
)});
  main.variable(observer("df")).define("df", ["d3"], function(d3){return(
d3.csv('https://gist.githubusercontent.com/rigogsoto/e4182f1fa64a1210b6c7a8c6f92eba65/raw/ad54d5b4bc2eb8ef91bcb2a8119eb09883b03d2f/safsdj.csv')
)});
  main.variable(observer()).define(["df"], function(df){return(
df
)});
  main.variable(observer("Datamap")).define("Datamap", ["require"], function(require){return(
require('https://bundle.run/datamaps@0.5.9')
)});
  main.variable(observer("countries")).define("countries", ["uniqueValid","df"], function(uniqueValid,df){return(
uniqueValid(df, d => d.name)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
## Question 1: What is the propotional of the death rate with people who are positive of each state?
`
)});
  main.variable(observer()).define(["vl","countries","df"], function(vl,countries,df)
{
  const selectCounty = vl.selectSingle('Select State')
                       .fields('name')
                       .init({name: 'AK'})
                       .bind({name: vl.menu(countries)});

  return vl.markLine().data(df)
    .select(selectCounty)
    .transform({filter: selectCounty})
    .encode(
    vl.x().fieldQ('value').bin(false),
    vl.y().fieldQ('death'),
    vl.tooltip(vl.y().count())
  )
  .width(600)
  .height(500)
  .render()
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`
## Question 2: What is the median of negative/positve of the top 10 states
`
)});
  main.variable(observer("viewof point")).define("viewof point", ["html"], function(html){return(
html`<input type=file accept="*">`
)});
  main.variable(observer("point")).define("point", ["Generators", "viewof point"], (G, _) => G.input(_));
  main.variable(observer("point_image")).define("point_image", ["d3","Files","point"], async function(d3,Files,point){return(
d3.csvParse(await Files.text(point))
)});
  main.variable(observer()).define(["vegalite"], function(vegalite){return(
vegalite({
   "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  "data": {"url": 'https://gist.githubusercontent.com/rigogsoto/e4182f1fa64a1210b6c7a8c6f92eba65/raw/ad54d5b4bc2eb8ef91bcb2a8119eb09883b03d2f/safsdj.csv'},
  "layer": [
    {
      "selection": {"brush": {"type": "interval", "encodings": ["x"]}},
      "mark": "bar",
      "encoding": {
        "x": {"field": "name", "type": "ordinal"},
        "y": {
          "aggregate": "mean",
          "field": "negative",
          "type": "quantitative"
        },
        "opacity": {
          "condition": {"selection": "brush", "value": 1},
          "value": 0.7
        }
      }
    },
    {
      "transform": [{"filter": {"selection": "brush"}}],
      "mark": "rule",
      "encoding": {
        "y": {
          "aggregate": "mean",
          "field": "negative",
          "type": "quantitative"
        },
        "color": {"value": "green"},
        "size": {"value": 3}
      }
    }
  ]
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
## Question 3: How is COVID-19 affectting every state in the U.S from January to April?
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
### Helper Function
`
)});
  main.variable(observer("names")).define("names", ["df"], function(df){return(
new Set(df.map(d => d.name))
)});
  main.variable(observer("datevalues")).define("datevalues", ["d3","df"], function(d3,df){return(
Array.from(d3.rollup(df, ([d]) => d.value, d => d.date, d => d.name))
  .map(([date, data]) => [new Date(date), data])
  .sort(([a], [b]) => d3.ascending(a, b))
)});
  main.variable(observer("legend")).define("legend", ["d3","ramp"], function(d3,ramp){return(
function legend({
  color,
  title,
  tickSize = 6,
  width = 320, 
  height = 44 + tickSize,
  marginTop = 18,
  marginRight = 0,
  marginBottom = 16 + tickSize,
  marginLeft = 0,
  ticks = width / 64,
  tickFormat,
  tickValues
} = {}) {

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("overflow", "visible")
      .style("display", "block");

  let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  let x;

  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);

    x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));

    svg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
  }

  // Sequential
  else if (color.interpolator) {
    x = Object.assign(color.copy()
        .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
        {range() { return [marginLeft, width - marginRight]; }});

    svg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(color.interpolator()).toDataURL());

    // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1);
        tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
      }
      if (typeof tickFormat !== "function") {
        tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
      }
    }
  }

  // Threshold
  else if (color.invertExtent) {
    const thresholds
        = color.thresholds ? color.thresholds() // scaleQuantize
        : color.quantiles ? color.quantiles() // scaleQuantile
        : color.domain(); // scaleThreshold

    const thresholdFormat
        = tickFormat === undefined ? d => d
        : typeof tickFormat === "string" ? d3.format(tickFormat)
        : tickFormat;

    x = d3.scaleLinear()
        .domain([-1, color.range().length - 1])
        .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(color.range())
      .join("rect")
        .attr("x", (d, i) => x(i - 1))
        .attr("y", marginTop)
        .attr("width", (d, i) => x(i) - x(i - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", d => d);

    tickValues = d3.range(thresholds.length);
    tickFormat = i => thresholdFormat(thresholds[i], i);
  }

  // Ordinal
  else {
    x = d3.scaleBand()
        .domain(color.domain())
        .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(color.domain())
      .join("rect")
        .attr("x", x)
        .attr("y", marginTop)
        .attr("width", Math.max(0, x.bandwidth() - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", color);

    tickAdjust = () => {};
  }

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x)
        .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
        .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues))
      .call(tickAdjust)
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", marginLeft)
        .attr("y", marginTop + marginBottom - height - 6)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(title));

  return svg.node();
}
)});
  main.variable(observer("nameframes")).define("nameframes", ["d3","keyframes"], function(d3,keyframes){return(
d3.groups(keyframes.flatMap(([, data]) => data), d => d.name)
)});
  main.variable(observer("keyframes")).define("keyframes", ["d3","datevalues","k","rank"], function(d3,datevalues,k,rank)
{
  const keyframes = [];
  let ka, a, kb, b;
  for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
    for (let i = 0; i < k; ++i) {
      const t = i / k;
      keyframes.push([
        new Date(ka * (1 - t) + kb * t),
        rank(name => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t)
      ]);
    }
  }
  keyframes.push([new Date(kb), rank(name => b.get(name) || 0)]);
  return keyframes;
}
);
  main.variable(observer("margin")).define("margin", function(){return(
{top: 16, right: 6, bottom: 6, left: 0}
)});
  main.variable(observer("barSize")).define("barSize", function(){return(
38
)});
  main.variable(observer("height")).define("height", function(){return(
782
)});
  main.variable(observer("x")).define("x", ["d3","margin","width"], function(d3,margin,width){return(
d3.scaleLinear([0, 1], [margin.left, width - margin.right - 50])
)});
  main.variable(observer("entity")).define("entity", function(){return(
function entity(character) {
  return `&#${character.charCodeAt(0).toString()};`;
}
)});
  main.variable(observer("swatches")).define("swatches", ["DOM","html","entity"], function(DOM,html,entity){return(
function swatches({
  color,
  columns = null,
  format = x => x,
  swatchSize = 15,
  swatchWidth = swatchSize,
  swatchHeight = swatchSize,
  marginLeft = 0
}) {
  const id = DOM.uid().id;

  if (columns !== null) return html`<div style="display: flex; align-items: center; margin-left: ${+marginLeft}px; min-height: 33px; font: 10px sans-serif;">
  <style>

.${id}-item {
  break-inside: avoid;
  display: flex;
  align-items: center;
  padding-bottom: 1px;
}

.${id}-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - ${+swatchWidth}px - 0.5em);
}

.${id}-swatch {
  width: ${+swatchWidth}px;
  height: ${+swatchHeight}px;
  margin: 0 0.5em 0 0;
}

  </style>
  <div style="width: 100%; columns: ${columns};">${color.domain().map(value => {
    const label = format(value);
    return html`<div class="${id}-item">
      <div class="${id}-swatch" style="background:${color(value)};"></div>
      <div class="${id}-label" title="${label.replace(/["&]/g, entity)}">${document.createTextNode(label)}</div>
    </div>`;
  })}
  </div>
</div>`;

  return html`<div style="display: flex; align-items: center; min-height: 33px; margin-left: ${+marginLeft}px; font: 10px sans-serif;">
  <style>

.${id} {
  display: inline-flex;
  align-items: center;
  margin-right: 1em;
}

.${id}::before {
  content: "";
  width: ${+swatchWidth}px;
  height: ${+swatchHeight}px;
  margin-right: 0.5em;
  background: var(--color);
}

  </style>
  <div>${color.domain().map(value => html`<span class="${id}" style="--color: ${color(value)}">${document.createTextNode(format(value))}</span>`)}</div>`;
}
)});
  main.variable(observer("ramp")).define("ramp", ["DOM"], function(DOM){return(
function ramp(color, n = 256) {
  const canvas = DOM.canvas(n, 1);
  const context = canvas.getContext("2d");
  for (let i = 0; i < n; ++i) {
    context.fillStyle = color(i / (n - 1));
    context.fillRect(i, 0, 1, 1);
  }
  return canvas;
}
)});
  main.variable(observer("bars")).define("bars", ["n","color","y","x"], function(n,color,y,x){return(
function bars(svg) {
  let bar = svg.append("g")
      .attr("fill-opacity", 0.9)
    .selectAll("rect");

  return ([date, data], transition) => bar = bar
    .data(data.slice(0, n), d => d.name)
    .join(
      enter => enter.append("rect")
        .attr("fill", color)
        .attr("height", y.bandwidth())
        .attr("x", x(0))
        .attr("y", y(n))
        .attr("width", d => x(d.value) - x(0)),
      update => update,
      exit => exit.transition(transition).remove()
        .attr("y", y(n))
        .attr("width", d => x(d.value) - x(0))
    )
    .call(bar => bar.transition(transition)
      .attr("y", d => y(d.rank))
      .attr("width", d => x(d.value) - x(0)));
}
)});
  main.variable(observer("ticker")).define("ticker", ["barSize","width","margin","n","formatDate","keyframes"], function(barSize,width,margin,n,formatDate,keyframes){return(
function ticker(svg) {
  const now = svg.append("text")
      .style("font", `bold ${barSize}px var(--sans-serif)`)
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
      .attr("x", width - 6)
      .attr("y", margin.top + barSize * (n - 0.45) - 150)
      .attr("dy", "0.32em")
      .text(formatDate(keyframes[0][0]));

  return ([date], transition) => {
    transition.end().then(() => now.text(formatDate(date)));
  };
}
)});
  main.variable(observer("formatDate")).define("formatDate", ["d3"], function(d3){return(
d3.utcFormat("%B %d, %Y")
)});
  main.variable(observer("color")).define("color", ["d3","df"], function(d3,df)
{
  const scale = d3.scaleOrdinal(d3.schemeSet1);
  if (df.some(d => d.category !== undefined)) {
    const categoryByName = new Map(df.map(d => [d.name, d.category]))
    scale.domain(Array.from(categoryByName.values()));
    return d => scale(categoryByName.get(d.name));
  }
  return d => scale(d.name);
}
);
  main.variable(observer("y")).define("y", ["d3","n","margin","barSize"], function(d3,n,margin,barSize){return(
d3.scaleBand()
    .domain(d3.range(n + 1))
    .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
    .padding(0.1)
)});
  main.variable(observer("parseNumber")).define("parseNumber", function(){return(
string => +string.replace(/,/g, "")
)});
  main.variable(observer("formatNumber")).define("formatNumber", ["d3"], function(d3){return(
d3.format(",d")
)});
  main.variable(observer("textTween")).define("textTween", ["d3","formatNumber"], function(d3,formatNumber){return(
function textTween(a, b) {
  const i = d3.interpolateNumber(a, b);
  return function(t) {
    this.textContent = formatNumber(i(t));
  };
}
)});
  main.variable(observer("labels")).define("labels", ["n","x","y","textTween","parseNumber"], function(n,x,y,textTween,parseNumber){return(
function labels(svg) {
  let label = svg.append("g")
      .style("font", "bold 12px var(--sans-serif)")
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "start")
    .selectAll("text");

  return ([date, data], transition) => label = label
    .data(data.slice(0, n), d => d.name)
    .join(
      enter => enter.append("text")
        .attr("transform", d => `translate(${x(d.value)},${y(n)})`)
        .attr("y", y.bandwidth() / 2)
        .attr("x", 6)
        .attr("dy", "-0.25em")
        .text(d => d.name)
        .call(text => text.append("tspan")
          .attr("fill-opacity", 0.7)
          .attr("font-weight", "normal")
          .attr("x", 6)
          .attr("dy", "1.15em")),
      update => update,
      exit => exit.transition(transition).remove()
        .attr("transform", d => `translate(${x(d.value)},${y(n)})`)
    )
    .call(bar => bar.transition(transition)
      .attr("transform", d => `translate(${x(d.value)},${y(d.rank)})`)
      .call(g => g.select("tspan").tween("text", function(d) {
          return textTween(parseNumber(this.textContent), d.value);
        })));
}
)});
  main.variable(observer("axis")).define("axis", ["margin","d3","x","width","barSize","n","y"], function(margin,d3,x,width,barSize,n,y){return(
function axis(svg) {
  const g = svg.append("g")
      .attr("transform", `translate(0,${margin.top})`);

  const axis = d3.axisTop(x)
      .ticks(width / 160)
      .tickSizeOuter(0)
      .tickSizeInner(-barSize * (n + y.padding()));

  return (_, transition) => {
    g.transition(transition).call(axis);
    g.select(".tick:first-of-type text").remove();
    g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
    g.select(".domain").remove();
  };
}
)});
  main.variable(observer("rank")).define("rank", ["names","d3","n"], function(names,d3,n){return(
function rank(value) {
  const data = Array.from(names, name => ({name, value: value(name)}));
  data.sort((a, b) => d3.descending(a.value, b.value));
  for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
  return data;
}
)});
  main.variable(observer()).define(["chart","keyframe"], function(chart,keyframe){return(
chart.update(keyframe)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
### Controller for bar speed
`
)});
  main.variable(observer("k")).define("k", function(){return(
10
)});
  main.variable(observer("duration")).define("duration", function(){return(
200
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
### Number of states to display 
`
)});
  main.variable(observer("n")).define("n", function(){return(
20
)});
  main.variable(observer("viewof keyframe")).define("viewof keyframe", ["Scrubber","keyframes","formatDate","duration"], function(Scrubber,keyframes,formatDate,duration){return(
Scrubber(keyframes, {
  format: ([date]) => formatDate(date),
  delay: duration,
  loop: false
})
)});
  main.variable(observer("keyframe")).define("keyframe", ["Generators", "viewof keyframe"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","width","height","bars","axis","labels","ticker","invalidation","duration","x"], function(d3,width,height,bars,axis,labels,ticker,invalidation,duration,x)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  const updateBars = bars(svg);
  const updateAxis = axis(svg);
  const updateLabels = labels(svg);
  const updateTicker = ticker(svg);

  invalidation.then(() => svg.interrupt());

  return Object.assign(svg.node(), {
    update(keyframe) {
      const transition = svg.transition()
          .duration(duration)
          .ease(d3.easeLinear);

      // Extract the top bar’s value.
      x.domain([0, keyframe[1][0].value]);

      updateAxis(keyframe, transition);
      updateBars(keyframe, transition);
      updateLabels(keyframe, transition);
      updateTicker(keyframe, transition);
    }
  });
}
);
  return main;
}
