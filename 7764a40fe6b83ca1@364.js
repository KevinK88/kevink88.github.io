// https://observablehq.com/@vega/vega-lite-api@364
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Vega-Lite API`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The [Vega-Lite JavaScript API](https://github.com/vega/vega-lite-api/) provides a convenient way to write [Vega-Lite](https://vega.github.io/vega-lite) specifications in a programmatic fashion. Scroll down for some usage examples, or browse the [Vega-Lite API example collection](https://observablehq.com/collection/@vega/vega-lite-api)! 

Want to learn more about data visualization and how to use the Vega-Lite API? Read the [introduction to Vega-lite](https://observablehq.com/@uwdata/introduction-to-vega-lite) and the [data visualization curriculum](https://observablehq.com/@uwdata/data-visualization-curriculum?collection=@uwdata/visualization-curriculum).`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
The cell below imports the Vega-Lite API and registers the desired versions of Vega and Vega-Lite, along with default [Vega View options](https://vega.github.io/vega/docs/api/view/#view) and [Vega-Lite configuration](https://vega.github.io/vega-lite/docs/config.html):
`
)});
  main.variable(observer("vl")).define("vl", ["require"], async function(require)
{
  const [vega, vegalite, api, tooltip] = await Promise.all([
    'vega@5.10.1',
    'vega-lite@4.9.0',
    'vega-lite-api@0.5.0',
    'vega-tooltip@0.22.0'
  ].map(module => require(module)));

  const options = {
    config: {
      // vega-lite default configuration
      config: {
        view: {continuousWidth: 400, continuousHeight: 300},
        mark: {tooltip: null}
      }
    },
    init: view => {
      // initialize tooltip handler
      view.tooltip(new tooltip.Handler().call);
      // enable horizontal scrolling for large plots
      if (view.container()) view.container().style['overflow-x'] = 'auto';
    },
    view: {
      // view constructor options
      loader: vega.loader({baseURL: 'https://vega.github.io/vega-datasets/'}),
      renderer: 'canvas'
    }
  };
  
  return api.register(vega, vegalite, options);
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`To use the same setup in your own notebooks, add a cell with the following code:
~~~ js
import {vl} from '@vega/vega-lite-api'
~~~
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Zip Codes

A dot for each zip code in the United States, colored by the first digit.
`
)});
  main.variable(observer()).define(["vl","width"], function(vl,width){return(
vl.markSquare({size: 2, opacity: 1})
  .data('data/zipcodes.csv')
  .transform(vl.calculate('substring(datum.zip_code, 0, 1)').as('digit'))
  .project(
    vl.projection('albersUsa')
  )
  .encode(
    vl.longitude().fieldQ('longitude'),
    vl.latitude().fieldQ('latitude'),
    vl.color().fieldN('digit')
  )
  .width(width)
  .height(Math.floor(width / 1.75))
  .autosize({type: 'fit-x', contains: 'padding'})
  .config({view: {stroke: null}})
  .render()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Interactive Seattle Weather 2012-2015

A scatter plot and summary histogram with linked \`selections\` between plots to perform cross-filtering and configure conditional color encodings.
`
)});
  main.variable(observer()).define(["vl","width"], function(vl,width)
{
  const brush = vl.selectInterval().encodings('x');
  const click = vl.selectMulti().encodings('color');

  const scale = {
    domain: ['sun', 'fog', 'drizzle', 'rain', 'snow'],
    range: ['#e7ba52', '#a7a7a7', '#aec7e8', '#1f77b4', '#9467bd']
  };

  const plot1 = vl.markPoint({filled: true})
    .encode(
      vl.color().value('lightgray')
        .if(brush, vl.color().fieldN('weather').scale(scale).title('Weather')),
      vl.size().fieldQ('precipitation').scale({domain: [-1, 50], range: [10, 500]}).title('Precipitation'),
      vl.order().fieldQ('precipitation').sort('descending'),
      vl.x().timeMD('date').axis({title: 'Date', format: '%b'}),
      vl.y().fieldQ('temp_max').scale({domain: [-5, 40]}).axis({title: 'Maximum Daily Temperature (°C)'})
    )
    .width(width)
    .height(300)
    .select(brush)
    .transform(vl.filter(click));

  const plot2 = vl.markBar()
    .encode(
      vl.color().value('lightgray')
        .if(click, vl.color().fieldN('weather').scale(scale).title('Weather')),
      vl.x().count(),
      vl.y().fieldN('weather').scale({domain: scale.domain}).title('Weather')
    )
    .width(width)
    .select(click)
    .transform(vl.filter(brush));

  return vl.vconcat(plot1, plot2)
    .data('data/seattle-weather.csv')
    .autosize({type: 'fit-x', contains: 'padding'})
    .render();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Parallel Coordinates

A [parallel coordinates plot](https://en.wikipedia.org/wiki/Parallel_coordinates) that uses \`window\` and \`fold\` transforms to convert the four dimensions of Iris flower measurements into normalized coordinates that can be visualized as \`line\` marks. The graphic includes an additional layer with custom \`text\` mark labels for the parallel axis grid lines. We render the plot as SVG by passing \`{renderer:'svg'}\` to the \`render\` method.
`
)});
  main.variable(observer()).define(["vl","width"], function(vl,width)
{
  const domain = ['petalLength', 'petalWidth', 'sepalLength', 'sepalWidth'];

  const scale = {
    type: 'point',
    padding: 0
  };
  
  const axis = {
    domain: false,
    ticks: false,
    title: false,
    grid: true,
    gridColor: '#888',
    labelAngle: 0,
    labelPadding: 8,
    labelFontWeight: 'bold'
  };

  const lines = vl.markLine({
      strokeWidth: 1.5,
      opacity: 0.5
    })
    .encode(
      vl.color().fieldN('species').sort('descending'),
      vl.detail().fieldN('index'),
      vl.x().fieldO('key').scale(scale).axis(axis),
      vl.y().fieldQ('fraction').axis(null)
    );

  const labels = vl.markText({
      dx: -2,
      align: 'right',
      baseline: 'middle'
    })
    .transform(
      vl.groupby('key').aggregate(vl.min('value').as('min'), vl.max('value').as('max')),
      vl.fold('min', 'max').as('op', 'value'),
      vl.groupby('key').window(vl.percent_rank('value').as('fraction'))
    )
    .encode(
      vl.x().fieldN('key'),
      vl.y().fieldQ('fraction').axis(null),
      vl.text().fieldN('value')
    );

  const plot = vl.layer(lines, labels)
    .data('data/iris.json')
    .transform(
      vl.window(vl.row_number().as('index')),
      vl.fold(domain),
      vl.groupby('key').join(vl.min('value').as('min'), vl.max('value').as('max')),
      vl.calculate('(datum.value - datum.min) / (datum.max - datum.min)').as('fraction')
    )
    .width(width)
    .height(300)
    .autosize({type: 'fit-x', contains: 'padding'})

  return plot.render({renderer: 'svg'});
}
);
  return main;
}
