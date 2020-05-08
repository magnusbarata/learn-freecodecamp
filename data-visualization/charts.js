const viewBarChart = function() {
  const w = 800, h = 400, padding = 60;
  let visArea = d3.select('.visArea');
  let title = visArea.select('#title').text('US GDP');
  let desc = visArea.select('#description').text('');
  visArea.select('#tooltip').remove();
  visArea.select('svg').remove();

  let svg = visArea.append('svg').attr('width', w).attr('height', h);
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
  xhr.send();
  xhr.onload = () => {
    // Preparation
    const dataset = JSON.parse(xhr.responseText).data;
    const N = dataset.length;
    const minYear = d3.min(dataset, d => new Date(d[0]));
    const maxYear = d3.max(dataset, d => new Date(d[0]));
    maxYear.setMonth(maxYear.getMonth() + 3);
    const xScale = d3.scaleTime().domain([minYear, maxYear]).range([padding, w-padding]);
    const maxGDP = d3.max(dataset, d => d[1]);
    const yScale = d3.scaleLinear().domain([0, maxGDP+1000]).range([h-padding, 0]);

    // Add Tooltip
    let tooltip = visArea.append('div').attr('id', 'tooltip')
                         .attr('class','barTip').style('opacity', 0);

    // Add bars
    svg.selectAll('rect').data(dataset).enter().append('rect')
       .attr('data-date', d => d[0])
       .attr('data-gdp', d => d[1])
       .attr('class', 'bar')
       .attr('x', (d, i) => xScale(new Date(d[0])))
       .attr('y', (d, i) => yScale(d[1]))
       .attr('width', w/N)
       .attr('height', (d, i) => h-yScale(d[1])-padding)
       .attr('fill', 'navy')
       .on('mouseover', d => {
         let qMap = {'01': 'Q1', '04': 'Q2', '07': 'Q3', '10': 'Q4'};

         tooltip.transition().duration(200).style('opacity', .9);
         tooltip.html(`${d[0].slice(0,4)} ${qMap[d[0].slice(5,7)]}<br/>$${d[1]} Billion`)
                .attr('data-date', d[0])
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px');
         })
       .on('mouseout', d => tooltip.transition().duration(500).style('opacity', 0));

    // Add axes
    let xAxis = svg.append('g').attr('transform', `translate(0,${h-padding})`)
                   .attr('id', 'x-axis').call(d3.axisBottom(xScale));
    let yAxis = svg.append('g').attr('transform', `translate(${padding},0)`)
                   .attr('id', 'y-axis').call(d3.axisLeft(yScale));

    // Axes labels
    svg.append('text').attr('transform', 'rotate(-90)')
       .attr('x', -h/2-45).attr('y', 15).text('Gross Domestic Product');
    svg.append('text').attr('x', w/2-10).attr('y', h-25).text('Year');
  };
}

const viewScatterplot = function() {
  const w = 800, h = 400, padding = 60;
  let visArea = d3.select('.visArea');
  let title = visArea.select('#title').text('Doping in Bicycle Racing');
  let desc = visArea.select('#description').text('');
  visArea.select('#tooltip').remove();
  visArea.select('svg').remove();

  let svg = visArea.append('svg').attr('width', w).attr('height', h);
  d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(function (data) {
      // Preparation
      const color = d3.scaleOrdinal(['red', 'green'])
      const minYear = d3.min(data, d => new Date(d.Year.toString()));
      const maxYear = d3.max(data, d => new Date(d.Year.toString()));
      maxYear.setFullYear(maxYear.getFullYear() + 1);
      minYear.setFullYear(minYear.getFullYear() - 1);
      const xScale = d3.scaleTime().domain([minYear, maxYear]).range([padding, w-padding]);
      const minTime = d3.min(data, d => new Date('1970-01-01T00:'+d.Time));
      const maxTime = d3.max(data, d => new Date('1970-01-01T00:'+d.Time));
      const yScale = d3.scaleTime().domain([maxTime, minTime]).range([h-padding, 5]);

      // Add Tooltip
      let tooltip = visArea.append('div').attr('id', 'tooltip')
                           .attr('class','scatterTip').style('opacity', 0);

      // Add dots
      svg.selectAll('circle').data(data).enter().append('circle')
         .attr('class', 'dot')
         .attr('data-xvalue', d => new Date(d.Year.toString()))
         .attr('data-yvalue', d => new Date('1970-01-01T00:'+d.Time))
         .attr('cx', d => xScale(new Date(d.Year.toString())))
         .attr('cy', d => yScale(new Date('1970-01-01T00:'+d.Time)))
         .attr('r', d => 5)
         .attr('fill', d => color(!d.Doping))
         .on('mouseover', d => {
           let flagMap = {ITA: '🇮🇹', USA: '🇺🇸', GER: '🇩🇪', ESP: '🇪🇸',
                          SUI: '🇨🇭', UKR: '🇺🇦', DEN: '🇩🇰', FRA: '🇫🇷',
                          POR: '🇵🇹', COL: '🇨🇴', RUS: '🇷🇺'};
           /*const getFlagIcon = function(natCode) {
             return natCode.slice(0,2).toUpperCase()
                           .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0)+127397));
           }*/

           tooltip.transition().duration(200).style('opacity', .9);
           tooltip.html(`${flagMap[d.Nationality]} ${d.Name}
                         (${d.Year})<br/>${d.Time}<br/>${d.Doping}`)
                  .attr('data-year', new Date(d.Year.toString()))
                  .style('left', (d3.event.pageX) + 'px')
                  .style('top', (d3.event.pageY - 28) + 'px');
          })
        .on('mouseout', d => tooltip.transition().duration(500).style('opacity', 0));

      // Add legend
      let legend = svg.append('g').attr('id', 'legend');
      let legendLabel = legend.selectAll('#legend').data(color.domain())
                              .enter().append('g')
                              .attr('transform', (d, i) => `translate(0, ${10 + i * 20})`);

      legendLabel.append('circle').attr('class', 'dotlegend').attr('cx', w-220)
                 .attr('cy', 10).attr('r', 5).style('fill', color);

      legendLabel.append('text').attr('x', w - 210).attr('y', 10)
                 .attr('dy', '.35em').style('text-anchor', 'start')
                 .text(d => d ? 'No allegations' : 'Doping allegations');

      // Legend border
      legend.each(function() {
          let bbox = d3.select(this).node().getBBox();
          d3.select(this).append('rect')
            .attr('width', bbox.width+20).attr('height', bbox.height+20)
            .attr('x', bbox.x-10).attr('y', bbox.y-10)
            .style('fill', 'transparent').style('stroke', 'black');
      });

      // Add axes
      let xAxis = svg.append('g').attr('transform', `translate(0,${h-padding})`)
                     .attr('id', 'x-axis').call(d3.axisBottom(xScale));
      let yAxis = svg.append('g').attr('transform', `translate(${padding},0)`)
                     .attr('id', 'y-axis')
                     .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S')));

      // Axes labels
      svg.append('text').attr('transform', 'rotate(-90)')
         .attr('x', -h/2-20).attr('y', 15).text('Time (min:sec)');
      svg.append('text').attr('x', w/2-10).attr('y', h-25).text('Year');
    });
}

const viewHeatMap = function() {
  const w = 1000, h = 500, pad = {vert: 80, horiz: 80};
  let visArea = d3.select('.visArea');
  let title = visArea.select('#title').text('Global Land Surface Temperature Heatmap');
  visArea.select('#tooltip').remove();
  visArea.select('svg').remove();

  let svg = visArea.append('svg').attr('width', w).attr('height', h);
  d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(function (data) {
      let desc = visArea.select('#description')
                        .text(`Data from ${data.monthlyVariance[0].year} to
                               ${data.monthlyVariance[data.monthlyVariance.length-1].year}
                               with base temperature ${data.baseTemperature}˚C`);

      // Scale setup
      const xScale = d3.scaleBand().range([pad.horiz, w-pad.horiz]).padding(0)
                       .domain(data.monthlyVariance.map(d => new Date(d.year.toString())));
      const yScale = d3.scaleBand().range([0, h-pad.vert]).padding(0)
                       .domain(data.monthlyVariance.map(d => new Date(0).setMonth(d.month-1)));
      const minTemp = d3.min(data.monthlyVariance, d => d.variance);
      const maxTemp = d3.max(data.monthlyVariance, d => d.variance);
      const cScale = d3.scaleSequential([minTemp, maxTemp], d3.interpolateTurbo);

      // Add tooltip
      let tooltip = visArea.append('div').attr('id', 'tooltip')
                           .attr('class','heatmapTip').style('opacity', 0);

      // Add cells
      svg.selectAll('rect').data(data.monthlyVariance).enter().append('rect')
         .attr('data-month', d => d.month-1)
         .attr('data-year', d => d.year)
         .attr('data-temp', d => d.variance)
         .attr('class', 'cell')
         .attr('x', d => xScale(new Date(d.year.toString())))
         .attr('y', d => yScale(new Date(0).setMonth(d.month-1)))
         .attr('width', xScale.bandwidth())
         .attr('height', yScale.bandwidth())
         .attr('fill', d => cScale(d.variance))
         .on('mouseover', d => {
           let date = new Date(d.year, d.month-1);
           tooltip.transition().duration(200).style('opacity', .9);
           tooltip.html(`${d3.timeFormat('%B, %Y')(date)}<br/>
                         ${(data.baseTemperature+d.variance).toFixed(1)}˚C
                         (${d.variance.toFixed(1)}˚C)`)
                  .attr('data-year', d.year)
                  .style('left', (d3.event.pageX) + 'px')
                  .style('top', (d3.event.pageY - 28) + 'px');
           })
         .on('mouseout', d => tooltip.transition().duration(500).style('opacity', 0));

      // Add legend
      let legend = svg.append('g').attr('id', 'legend');
      let legendLabel = legend.selectAll('#legend').data(cScale.ticks())
                              .enter().append('g')
                              .attr('transform', (d, i) => `translate(${w/2+60},${h-pad.vert+20})`)

      legendLabel.append('rect').attr('x', (d, i) => 30*i).attr('y', 0)
                 .attr('width', 30).attr('height',30)
                 .style('fill', d => cScale(d));

      legendLabel.append('text').attr('x', (d, i) => 30*i).attr('y', 40)
                 .attr('dy', '.3em').style('font-size', '12')
                 .style('text-anchor', 'middle')
                 .text(d => (data.baseTemperature+d).toFixed(1));

      // Add axes
      let xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y'))
                    .tickValues(xScale.domain().filter(y => y.getFullYear()%10 === 0));
      svg.append('g').attr('transform', `translate(0,${h-pad.vert})`)
         .attr('id', 'x-axis').call(xAxis);

      let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'));
      svg.append('g').attr('transform', `translate(${pad.horiz},0)`)
         .attr('id', 'y-axis').call(yAxis);

      // Axes labels
      svg.append('text').attr('transform', 'rotate(-90)')
         .attr('x', -h/2).attr('y', 15).text('Month');
      svg.append('text').attr('x', w/2-10).attr('y', h-pad.vert+35).text('Year');
    });
}

const viewChoroplethMap = function() {
  const sources = ['https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json',
                   'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'];
  const w = 975, h = 610;
  let visArea = d3.select('.visArea');
  let title = visArea.select('#title').text('US Educational Attainment');
  let desc = visArea.select('#description').text('Percentage of adults aged 25 and older with bachelor\'s degree or higher (2010-2014)');

  visArea.select('#tooltip').remove();
  let tooltip = visArea.append('div').attr('id', 'tooltip')
                       .attr('class','choroplethTip').style('opacity', 0);

  visArea.select('svg').remove();
  let svg = visArea.append('svg').attr('width', w).attr('height', h);
  Promise.all(sources.map(url => d3.json(url))).then(function(datas) {
    const us = datas[0], edu = datas[1];
    const path = d3.geoPath();
    const minEdu = d3.min(edu, d => d.bachelorsOrHigher);
    const maxEdu = d3.max(edu, d => d.bachelorsOrHigher);
    const cScale = d3.scaleSequential([minEdu, maxEdu], d3.interpolateRdYlGn);
    const eduMap = edu.reduce((obj, data) => {
      obj[data.fips] = data;
      return obj;
    }, {});

    // Add counties
    svg.append('g').selectAll('path')
       .data(topojson.feature(us, us.objects.counties).features).enter()
       .append('path')
       .attr('class', 'county')
       .attr('data-fips', d => d.id)
       .attr('data-education', d => eduMap[d.id] ?
          eduMap[d.id].bachelorsOrHigher :
          console.log(`matching fips id (${d.id}) not found.`)
        )
       .attr('d', path)
       .attr('fill', d => eduMap[d.id] ?
          cScale(eduMap[d.id].bachelorsOrHigher) :
          cScale(0)
        )
      .on('mouseover', d => {
          tooltip.transition().duration(200).style('opacity', .9);
          return eduMap[d.id] ?
            tooltip.html(`${eduMap[d.id].area_name}, ${eduMap[d.id].state}
                          (${eduMap[d.id].bachelorsOrHigher}%)`)
                 .attr('data-education', eduMap[d.id].bachelorsOrHigher)
                 .style('left', (d3.event.pageX) + 'px')
                 .style('top', (d3.event.pageY - 28) + 'px') : 0;
        })
      .on('mouseout', d => tooltip.transition().duration(500).style('opacity', 0));

    // Add line between states
    svg.append('path').datum(topojson.mesh(us, us.objects.states, (a,b) => a!==b))
       .attr('fill', 'none').attr('stroke', 'white')
       .attr('stroke-linejoin', 'round').attr('d', path);

    // Add legend
    let legend = svg.append('g').attr('id', 'legend');
    let legendLabel = legend.selectAll('#legend').data(cScale.ticks())
                            .enter().append('g')
                            .attr('transform', (d, i) => `translate(900,500)`);

    legendLabel.append('rect').attr('x', 0).attr('y', (d, i) => -30*i)
               .attr('width', 15).attr('height',30)
               .style('fill', d => cScale(d));

    const pScale = d3.scaleLinear().domain([0, 70]).range([530,320]);
    let lAxis = d3.axisRight(pScale).tickSize(25).ticks(7).tickFormat(d => d + '%');

    legend.append('g').attr('transform', `translate(900,0)`).call(lAxis)
          .select(".domain").remove().style('font-size', '11');
  });
}
