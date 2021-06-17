import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { Icon } from "leaflet";

const MapView = () => {
  const [comercios, guardarComercios] = useState([]);
  const [infoLocal, guardarInfoLocal] = useState(null);
  
  const [state] = useState({
    currenLocation: { lat: "-28.4686195", lng: " -65.795289" }, zoom: 14
  })

  const icon = new Icon({
    iconUrl: "/commerce.svg",
    iconSize: [25, 25]
  });

  const consultarLocales = async () => {
    const url = "https://tarjetafamilia.catamarca.gob.ar/api/v1/commerce/";
    const respuesta = await axios.get(url);
    respuesta.data.data.splice(3, 1);
    guardarComercios(respuesta.data.data);

  }

  useEffect(() => {
    consultarLocales()
  }, [])

  return (
    <MapContainer center={state.currenLocation} zoom={state.zoom}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Fragment>
        {comercios.map(local => (

          <Marker
            key={local.id}
            position={[
              local.attributes.point.coordinates[1],
              local.attributes.point.coordinates[0],
            ]}
            icon={icon}
            onClick={() => {
              guardarInfoLocal(local);
            }}
          />
        ))}
        {
          infoLocal ? (
            <Popup
              position={[
                infoLocal.attributes.point.coordinates[1],
                infoLocal.attributes.point.coordinates[0],
              ]}
              onClose={() => {
                guardarInfoLocal(null);
              }}
            >
              <strong>{infoLocal.attributes.name}</strong>
              <p><strong>Dirección:</strong>{infoLocal.attributes.address}</p>
              <p><strong>Descripcion:</strong>{infoLocal.attributes.description}</p>
            </Popup>
          ) : null
        }
      </Fragment>

    </MapContainer>
  );
};

export default MapView;
