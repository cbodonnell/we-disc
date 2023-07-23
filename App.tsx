import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker, Region, UrlTile } from 'react-native-maps';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';

export default function App() {

  const mapRef = useRef<MapView | null>(null);

  const [location, setLocation] = useState<Location.LocationObject | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // const [region, setRegion] = useState<Region | undefined>(undefined);

  const onRegionChange = (region: Region) => {
    // do something with region
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      const locationWatch = Location.watchPositionAsync({ distanceInterval: 2 }, (location) => {
        setLocation(location);
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        // region={region}
        style={styles.map}
        // mapType='standard'
        userInterfaceStyle='dark'
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsBuildings={true}
        showsTraffic={true}
        showsIndoors={true}
        onRegionChange={onRegionChange}
      >
      </MapView>
      {location && <View
        style={{ position: "absolute", bottom: 50, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', opacity: 0.5, height: 50 }}
      >
        <Pressable
          style={{
            borderRadius: 10,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
          onPress={() => {
            mapRef.current?.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }}>
          <Text style={{
            color: '#fff',
            fontSize: 16,
          }}>
            Touch!
          </Text>
        </Pressable>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
