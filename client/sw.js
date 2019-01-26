/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.2/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "bundle.js",
    "revision": "8cbceefeb2741c6984c3110000e59dcb"
  },
  {
      "url": "css/style.css",
      "revision": "18aa6503056c72bc43428030cc9bf553"
  },
    {
        "url": "fonts/LibreBaskerville-Regular.ttf",
        "revision": "27b9efe7ae34478c82311efb90011607"
    },
  {
    "url": "fonts/PlayfairDisplay-Regular.ttf",
    "revision": "2ec4a3528bb6b0bd79edf9a1dc601fc7"
  },
  {
    "url": "fonts/Roboto-Regular.ttf",
    "revision": "3e1af3ef546b9e6ecef9f3ba197bf7d2"
  },
  {
    "url": "images/background_map.jpg",
    "revision": "30af1a695dda6348f9fda637bb08c5fc"
  },
  {
    "url": "images/favicon-32x32.png",
    "revision": "f091d20829d8e7d0198e41f0f139db7a"
  },
  {
    "url": "images/favicon.ico",
    "revision": "5f1b9e3a4b2425df57a7da83e096ae59"
  },
  {
    "url": "images/img_0.png",
    "revision": "77d7885362703e19392c25e4410e4f48"
  },
  {
      "url": "images/public/ThisWay-Logo40a4acde1c228274a2abaceb26b5e5a6.png",
      "revision": "40a4acde1c228274a2abaceb26b5e5a6"
  },
    {
        "url": "images/public/ThisWay-Logo4b1577df5528c588c2a02b90d26f556d.png",
        "revision": "4b1577df5528c588c2a02b90d26f556d"
    },
  {
    "url": "images/svg/map.svg",
    "revision": "238926963f307ec2b778b0ddc646a153"
  },
  {
    "url": "images/svg/music-player.svg",
    "revision": "46557fc39f2d16847c7fa2ff676754e4"
  },
  {
    "url": "images/svg/time-icon.svg",
    "revision": "9d5b1d2cea107c21873cc368f98ff13d"
  },
  {
    "url": "images/svg/track.svg",
    "revision": "5b98605f8267da23286cd57523090356"
  },
  {
    "url": "images/svg/userMap.svg",
    "revision": "dd7afe19db8c2e426219d72740034906"
  },
  {
    "url": "images/ThisWay-Logo.png",
    "revision": "40a4acde1c228274a2abaceb26b5e5a6"
  },
  {
    "url": "images/ThisWay-Logo.svg",
    "revision": "36effa6c2cf9ef2ebceb6de4d500143b"
  },
  {
    "url": "images/ThisWay-Template.jpg",
    "revision": "b8cfbc075cd1de288792ea43adfd3b12"
  },
  {
    "url": "images/ThisWay-Template.png",
    "revision": "a4e4d48a9685b0f43156a80c07e04796"
  },
  {
    "url": "index.js",
      "revision": "16e71b07f1fb890ca8dc4c4ee996f1d5"
  },
  {
    "url": "manifest.json",
    "revision": "a5e4099864df8cfda17be895c6fb28f0"
  },
  {
    "url": "pwa/android-icon-144x144.png",
    "revision": "decbe2b0a996f9e2b86c33fd59b6326f"
  },
  {
    "url": "pwa/android-icon-192x192.png",
    "revision": "a2772b9a2a98847099fd497f9b2851a1"
  },
  {
    "url": "pwa/android-icon-36x36.png",
    "revision": "280de217c8ed0ae96645ba731454e348"
  },
  {
    "url": "pwa/android-icon-48x48.png",
    "revision": "ea09e4ee4aaa9cc1f51cb8cb7111677f"
  },
  {
    "url": "pwa/android-icon-512x512.png",
    "revision": "dd2652953c21ee80450cc98d3889b0c6"
  },
  {
    "url": "pwa/android-icon-72x72.png",
    "revision": "0325e0da4495bf5269ac4824a5b2e9cc"
  },
  {
    "url": "pwa/android-icon-96x96.png",
    "revision": "9a08fcd827d8b15305b2e63d7ab8f344"
  },
  {
    "url": "routes.jsx",
      "revision": "38f793d2e089295e6a8e618cff21f75d"
  },
  {
    "url": "style.css",
      "revision": "18aa6503056c72bc43428030cc9bf553"
  },
  {
    "url": "/",
    "revision": "63a006d9b2c07fb3c9835d831e219f73"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("/");

workbox.routing.registerRoute(/\.(?:png|jpg|jpeg|svg)$/, workbox.strategies.staleWhileRevalidate({
    "cacheName": "this-way",
    plugins: [new workbox.expiration.Plugin({"maxEntries": 5, "maxAgeSeconds": 60, "purgeOnQuotaError": false})]
}), "GET");
workbox.routing.registerRoute(/^https:\/\/this-way\.s3\.amazonaws\.com\//, workbox.strategies.staleWhileRevalidate({
    "cacheName": "this-way",
    plugins: [new workbox.expiration.Plugin({"maxEntries": 5, "maxAgeSeconds": 60, "purgeOnQuotaError": false})]
}), "GET");
