function makeCZMLAndStatsForListOfFires(f) {
    // The first packet is the CZML header and the most important part is the clock definition 
    var mtbsCZML = [
        {
            id: 'document',
            name: 'MTBS',
            version: "1.0",
            clock: {
                interval: '',         // This is the time range of our simulation
                currentTime: '',    // This is the time associated with the start view
                multiplier: 10518975,
                range: 'LOOP_STOP',
                step: 'SYSTEM_CLOCK_MULTIPLIER'
            }
        }
    ];
  //...

  f.features.forEach(function (feature) {
    
    //...
    
    var czmlItem = {
      id: feature.properties.id,
      name: 'Fire Name: ' + feature.properties.name,
      description: 
      
      //      ...
      
      // Here we define the availability for each cylinder, based on the year of the wildfire
      availability: year + '-01-01T00:00:00.000Z' + '/' + year + '-12-31T23:59:59.999Z',
      cylinder: {
        topRadius: ,
        bottomRadius:  ...,
        length: ...,
        outline: false,
        material : {
          solidColor : {
            color : {
              rgba: ...
            }
          }
        }
      },
      
      // Here we get the position of each cylinder from the source GeoJSON
      position: {
        cartographicDegrees: [feature.geometry.coordinates[0], feature.geometry.coordinates[1], feature.geometry.coordinates[2] + cylinderLength/2]
      }
    };

    mtbsCZML.push(czmlItem);
  });
  // Here we set the entire time interval of the simulation
  mtbsCZML[0].clock.interval = statsAll.fromYear + '-01-01T00:00:00.000Z/'+ statsAll.toYear + '-12-31T23:59:59.999Z';
  // Here we set the starting current time view of the scene, i.e., the last wildfire year reported
  mtbsCZML[0].clock.currentTime = statsAll.toYear + '-12-31T23:59:59.999Z';

  return {stats: stats, statsAll: statsAll, <b>czml: mtbsCZML</b>};