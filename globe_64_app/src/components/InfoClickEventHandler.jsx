import { ScreenSpaceEvent, useCesium } from "resium";
import { useEffect } from "react";
import * as Cesium from "cesium";


export const InfoClickEventHandler = ({viewRef}) => {
//essentially a copy of the code in https://github.com/CesiumGS/cesium/blob/1.111/packages/widgets/Source/Viewer/Viewer.js#L116
//tried to find a nice way to get the initial left click action but failed miserably
    function pickAndSelectObject(e) {
        viewRef.current.cesiumElement.selectedEntity = pickEntity(viewRef.current.cesiumElement, e);
      }
    
      function pickEntity(viewer, e) {
        const picked = viewer.scene.pick(e.position);
        if (Cesium.defined(picked)) {
          const id = Cesium.defaultValue(picked.id, picked.primitive.id);
          if (id instanceof Cesium.Entity) {
            return id;
          }
      
          if (picked instanceof Cesium.Cesium3DTileFeature) {
            return new Cesium.Entity({
              name: getCesium3DTileFeatureName(picked),
              description: getCesium3DTileFeatureDescription(picked),
              feature: picked,
            });
          }
        }
      //THIS NOT IMPLEMENTED HERE THEREFORE COMMENTED
        // No regular entity picked.  Try picking features from imagery layers.
       /* if (defined(viewer.scene.globe)) {
          return pickImageryLayerFeature(viewer, e.position);
        }*/
      }
    
      function getCesium3DTileFeatureName(feature) {
        // We need to iterate all property IDs to find potential
        // candidates, but since we prefer some property IDs
        // over others, we store them in an indexed array
        // and then use the first defined element in the array
        // as the preferred choice.
      
        let i;
        const possibleIds = [];
        const propertyIds = feature.getPropertyIds();
        for (i = 0; i < propertyIds.length; i++) {
          const propertyId = propertyIds[i];
          if (/^name$/i.test(propertyId)) {
            possibleIds[0] = feature.getProperty(propertyId);
          } else if (/name/i.test(propertyId)) {
            possibleIds[1] = feature.getProperty(propertyId);
          } else if (/^title$/i.test(propertyId)) {
            possibleIds[2] = feature.getProperty(propertyId);
          } else if (/^(id|identifier)$/i.test(propertyId)) {
            possibleIds[3] = feature.getProperty(propertyId);
          } else if (/element/i.test(propertyId)) {
            possibleIds[4] = feature.getProperty(propertyId);
          } else if (/(id|identifier)$/i.test(propertyId)) {
            possibleIds[5] = feature.getProperty(propertyId);
          }
        }
      
        const length = possibleIds.length;
        for (i = 0; i < length; i++) {
          const item = possibleIds[i];
          if (Cesium.defined(item) && item !== "") {
            return item;
          }
        }
        return "Unnamed Feature";
      }
    
      function getCesium3DTileFeatureDescription(feature) {
        const propertyIds = feature.getPropertyIds();
      
        let html = "";
        propertyIds.forEach(function (propertyId) {
          const value = feature.getProperty(propertyId);
          if (Cesium.defined(value)) {
            html += `<tr><th>${propertyId}</th><td>${value}</td></tr>`;
          }
        });
      
        if (html.length > 0) {
          html = `<table class="cesium-infoBox-defaultTable"><tbody>${html}</tbody></table>`;
        }
      
        return html;
      }


return   (<ScreenSpaceEvent action={pickAndSelectObject} type={Cesium.ScreenSpaceEventType.LEFT_CLICK} />)}
