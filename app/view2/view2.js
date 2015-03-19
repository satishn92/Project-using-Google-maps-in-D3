angular.module('myApp.view2', ['ngRoute'])

.controller('View2Ctrl', ['settings', '$scope', View2Ctrl]);


function View2Ctrl(settings, $scope) {
  var width = 960,
    height = 1160,
    svg = null,
    projection = null,
    path = null,
    rateById = null,
    quantize = null,
    colors = null,
    legend = null,
    colorArray = [];

  function InitiateSVGContainer() {
    svg = d3.select('div.chloroplethContainer').append('svg')
      .attr('width', width)
      .attr('height', height);
  }

  function getGeoJson() {
    d3.json('subunits.json', function(error, data) {
      console.log('subunits.json', data);
    });

    d3.json('places.json', function(error, data) {
      // console.log('places.json', data);
    });

    d3.json('brazil.json', function(error, data) {
      if (error) {
        return console.error(error);
      }
      console.log('brazil.json', data);
      setColorsArray(data.objects.subunits.geometries);

      d3.tsv('unemployment.tsv', function(err, dtsv) {
        if (err) {
          console.log('err', err);
        }

        // console.log('unemployment.tsv', dtsv);

        for (var dt in dtsv) {
          rateById.set(dtsv[dt].id, +dtsv[dt].rate);
        }

        projection = d3.geo.mercator()
          .scale(700)
          .translate([width + 200, 100]);

        path = d3.geo.path().projection(projection);

        svg.selectAll('.subunit')
          .data(topojson.feature(data, data.objects.subunits).features)
          .enter().append('path')
          .attr('class', 'subunit')
          .style('fill', function(d) {
            return colors(rateById.get(d.id) / 0.15);
          })
          .attr('d', path)
          .append('svg:title').text(function(d) {
            return d.properties.name;
          });

        // svg.append('path')
        //   .datum(topojson.mesh(data, data.objects.subunits, function(a, b) {
        //     return a === b || a !== b;
        //   }))
        //   .attr('d', path)
        //   .attr('class', 'subunit-boundary');

        // svg.append('path')
        //   .dataum(topojson.feature(data, data.objects.places))
        //   .attr('d', path)
        //   .attr('class', 'place');

        // svg.selectAll('.place-label')
        //   .data(topojson.feature(data, data.objects.places).features)
        //   .enter().append('text')
        //   .attr('class', 'place-label')
        //   .attr('transform', function(d) {
        //     return 'translate(' + projection(d.geometry.coordinates) + ')';
        //   })
        //   .text(function(d) {
        //     return d.properties.name;
        //   });

        // svg.selectAll('.place-label')
        //   .attr('x', function(d) {
        //     return d.geometry.coordinates[0] > -1 ? 6 : -6;
        //   })
        //   .style('text-anchor', function(d) {
        //     return d.geometry.coordinates[0] > -1 ? 'start' : 'end';
        //   });

        // svg.append('path')
        // .datum(topojson.feature(data, data.objects.subunits))
        // .attr('d', d3.geo.path().projection(d3.geo.mercator()));

        // svg.selectAll('path')
        //   .attr('class', function(d) {
        //     return quantize(rateById.get(d.id));
        //   });

        legend = svg.append('g')
          .attr('class', 'legend')
          .attr('transform', 'translate(' + (width - 160) + ',' + (100) + ')')
          .selectAll('.color-box')
          .data(colorArray).enter();

        legend.append('rect')
          .attr('class', 'color-box')
          .attr('height', '20px')
          .attr('width', '20px')
          .style('fill', function(d) {
            console.log('d', d);
            return d.color;
          })
          .attr('y', function(d, i) {
            return i * 40 + 20;
          })
          .style('stroke', '#E7E7E7')
          .style('stroke-width', '1px')
          .style('shape-rendering', 'crispEdges');

        legend.append('text')
        .attr('x', '30px')
        .attr('y', function(d, i) {
          return i*40 + 35;
        })
        .style('fill', 'rgb(134, 138, 137)')
        .text(function (d) {
          return d.range[0] + ' - ' + d.range[1] + ' Unemployment Rate';
        })
        .style('font-size', '12px');
      });
    });
  }

  function setColorsArray(data) {
    var max = -1;
    console.log('data.count', data.length);
    if (data.length > max) {
      max = data.length;
    }
    // max = 0.15;
    console.log('max', max);

    var maxN = 10,
      count;

    for (var i = 0; i < maxN; i++) {
      if (max / maxN >= 1) {
        count = (i > 0) ? Math.round(i * max / maxN) + 1 : Math.round(i * max / maxN);
        colorArray.push({
          count: count,
          color: colors(count / Math.round(max)),
          range: [(i * 0.15 /10).toFixed(2), ((i + 1) * 0.15 /10).toFixed(2)]
        });
      } else {
        if (max >= i) {
          count = i;
          colorArray.push({
            count: count,
            color: colors(count / max),
            range: [count, i + 1]
          });
        }
      }
    }

    console.log('colorArray', colorArray);
  }

  function init() {
    console.log("Welcome to controller 2");

    rateById = d3.map();
    quantize = d3.scale.quantize()
      .domain([0, 0.15])
      .range(d3.range(9).map(function(i) {
        return "q" + i + "-9";
      }));
    colors = d3.interpolate('#F2FBFF', '#217AC3');
    // console.log('colors', colors);

    InitiateSVGContainer();
    getGeoJson();
  }

  init();
}
