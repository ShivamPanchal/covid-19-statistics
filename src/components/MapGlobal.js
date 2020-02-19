import React, { useEffect, useState } from 'react'
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export default function MapGlobal({mapData}) {

  useEffect(() => {
    import(`echarts/map/json/world.json`).then(map => {
      echarts.registerMap('world', map.default)  
    });
  }, []);
 
  const getLoadingOption = () => {
    return {
      text: 'Loading data...',
      color: '#4413c2',
      textColor: '#270240',
      maskColor: 'rgba(194, 88, 86, 0.3)',
      zlevel: 0
    };
  };

  const onChartReady = (chart) => {
    setTimeout(() => { chart.hideLoading(); }, 3000);
  };

  const getOption = () => {
    return {
      // backgroundColor: '#C0C0C0',
      title:  {
          x: 'center',
          text: 'Cases by country Worldwide',
          subtext: 'Data from https://lab.isaaclin.cn/',
          margin: '10px',
          textStyle: {fontSize: 18},
      },
      visualMap: {
        show: true,
        type: 'piecewise',
        min: 0,
        max: 100000,
        align: 'left',
        top: '50%',
        left: 'left',
        inRange: { color: [ '#ffc0b1', '#ff8c71', '#ef1717', '#9c0505' ] },
        // cases number ranges: greater number indicates more severe epidemic area
        pieces: [ 
          {min: 500},
          {min: 100, max: 499},
          {min: 50, max: 99},
          {min: 10, max: 49},
          {min: 1, max: 9},
        ],        
        padding: 30,
        orient: 'vertical',
        showLabel: true,
        text: ['Outbreak', 'Minor Break'],
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 12, fontWeight: 'bold' }
      },
      tooltip: {
        formatter: (params) => {
          let value = ((params.value || 'No Case') + '').split('.');
          value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
          return (params.seriesName + '<br />' + params.name + ': ' + value );
        }
      },
      // geo: {  },
      series: [{
        top: '20%',
        left: 'center',
        type: 'map',
        name: 'Confirmed Cases',
        geoIndex: 0,
        data: mapData, // area(countries) data
        map: 'world',
        // the following attributes can be put in geo, but the map will smaller
        // and cannot be zoomed out
        silent: false, // country area is clickable
        label: { normal: { 
          show: false,  // do not show country name
          fontSize:'8', 
          color: 'rgba(0,0,0,0.7)'  // default area color
        }}, 
        itemStyle: {
          normal:{ 
            borderColor: 'rgba(0, 0, 0, 0.2)',
            areaColor: '#B2E5BC'  // default area color 
          },
          emphasis:{
              areaColor: '#53adf3', // change color when click
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,           
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        mapType: 'world',        
        zoom: 1.15,        
        roam: false,
        showLegendSymbol: false,
        rippleEffect: { show: true, brushType: 'stroke', scale: 2.5, period: 4 },
      }]
    }
  }

  return (
    <ReactEcharts 
      style={{height: "85vh"}}
      echarts={echarts}
      option={getOption()}
      // loadingOption={getLoadingOption()}
      // onChartReady={onChartReady}
      // showLoading={true}
      notMerge={true}
      lazyUpdate={true}
      theme={"theme_name"}
      // onEvents={EventsDict}
      // opts={} 
    />
  )
}