import { Platform } from 'react-native';

export function listsEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  a.sort();
  b.sort();

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function getCurrentLocation() {
  const locationOptions = Platform.OS === 'android' ? null :
    { enableHighAccuracy: true, timeout: 100000, maximumAge: 1000 };

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {console.log(position); resolve(position.coords)}, ({ code, message }) =>
      reject(Object.assign(new Error(message), { name: "PositionError", code })),
      locationOptions);
  });
};
