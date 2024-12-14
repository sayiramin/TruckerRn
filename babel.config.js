module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Other Babel plugins can go here
    'react-native-reanimated/plugin', // Add this as the last plugin
  ],
};
