module.exports = {
  plugins: [{ plugin: require('@semantic-ui-react/craco-less') }],
  webpack: {
    alias: {
      'mapbox-gl': 'maplibre-gl'
    }
  },
}