const viewBarChart = function() {
  const w = 800, h = 400, padding = 60;
  let visArea = d3.select('.visArea');
  let title = visArea.select('#title').text('US GDP');
  visArea.select('#tooltip').remove();
  visArea.select('svg').remove();

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
    let svg = visArea.append('svg').attr('width', w).attr('height', h);
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
  visArea.select('#tooltip').remove();
  visArea.select('svg').remove();

  d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(function (data) {
      // Preparation
      const N = data.length;
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
      let svg = visArea.append('svg').attr('width', w).attr('height', h);
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
                 .text(d => d ? 'Doping allegations' : 'No allegations');

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
